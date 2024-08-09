import { createTransport } from "nodemailer";
import dotenv from "dotenv";

import taskModel from "../models/taskModel.js";

dotenv.config();

const addTask = async (req, res) => {
  const {
    subCategory,
    subHeading,
    question,
    answerA,
    answerB,
    answerC,
    answerD,
    refData,
    correctAnswer,
    imgAData,
    imgBData,
    imgCData,
    imgDData,
    imgQData,
    imgRData,
  } = req.body;

  const newTask = new taskModel({
    subCategory,
    subHeading,
    question,
    answerA,
    answerB,
    answerC,
    answerD,
    refData,
    correctAnswer,
    imgAData,
    imgBData,
    imgCData,
    imgDData,
    imgQData,
    imgRData,
    completed: false,
  });
  newTask
    .save()
    .then(() => {
      return res.status(200).json({ id: newTask.id });
    })
    .catch((error) => {
      return res.status(500).json({ message: error.message });
    });
};

const removeTask = (req, res) => {
  const { taskid } = req.body;
  console.log("id: ", taskid);
  taskModel
    .findByIdAndDelete(taskid)
    .then(() => res.status(200).json({ message: "Task deleted successfully" }))
    .catch((error) => res.status(501).json({ message: error.message }));
};

const editTask = (req, res) => {
  const {
    subCategory,
    subHeading,
    question,
    answerA,
    answerB,
    answerC,
    answerD,
    refData,
    correctAnswer,
    imgAData,
    imgBData,
    imgCData,
    imgDData,
    imgQData,
    imgRData,
  } = req.body;

  taskModel
    .findByIdAndUpdate(
      req.params.id,
      {
        subCategory,
        subHeading,
        question,
        answerA,
        answerB,
        answerC,
        answerD,
        refData,
        correctAnswer,
        imgAData,
        imgBData,
        imgCData,
        imgDData,
        imgQData,
        imgRData,
      },
      { new: true }
    )
    .then((user) => {
      if (!user) {
        return res.status(404).send("User not found");
      }
      res.send(user);
    })
    .catch((err) => {
      res.status(500).send("Server error");
    });
};

const getTask = (req, res) => {
  taskModel
    .find({ userId: req.user.id })
    .then((data) => res.status(200).json(data))
    .catch((error) => res.status(501).json({ message: error.message }));
};

const getTaskId = async (req, res) => {
  try {
    const item = await taskModel.findById(req.params.id);
    if (!item) {
      return res.status(404).send("Item not found");
    }
    res.send(item);
  } catch (error) {
    res.status(500).send("Error fetching item: " + error.message);
  }
};

const getAllTask = (req, res) => {
  taskModel
    .find({}) // Empty filter object to fetch all documents
    .then((data) => res.status(200).json(data))
    .catch((error) => res.status(500).json({ message: error.message })); // Changed error code to 500, which is more appropriate for server errors
};

const changeCategory = async (req, res) => {
  const { editCategory, editCategoryName } = req.body;
  const filter = { subCategory: editCategoryName };
  const updateDoc = {
    $set: { subCategory: editCategory },
  };
  try {
    const result = await taskModel.updateMany(filter, updateDoc);
    if (result.modifiedCount == 0) {
      res.status(404).send({ message: "No documents found to update" });
    } else {
      res.send({
        message: `Successfully updated ${result.modifiedCount} documents`,
      });
    }
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).send({ message: "Failed to update", error: error.message });
  }
};

const removeChangeCategoryTask = async (req, res) => {
  const { deleteCategoryName } = req.body;
  const filter = { subCategory: deleteCategoryName };
  try {
    const result = await taskModel.deleteMany(filter);
    if (result.deletedCount == 0) {
      res.status(404).send({ message: "No documents found to delete" });
    } else {
      res.send({
        message: `Successfully deleted ${result.deletedCount} documents`,
      });
    }
  } catch (error) {
    console.error("Deletion error:", error);
    res.status(500).send({ message: "Failed to delete", error: error.message });
  }
};

export {
  addTask,
  getTask,
  removeTask,
  getAllTask,
  getTaskId,
  editTask,
  changeCategory,
  removeChangeCategoryTask,
};
