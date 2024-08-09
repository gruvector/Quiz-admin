import React, { useState, useEffect } from "react";
import "./task.css";
import { useContext } from "react";
import TokenContext from "../../context/TokenContext";
import Snackbar from "@mui/material/Snackbar";
import axios from "../../Axios/axios.js";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";

const vertical = "bottom";
const horizontal = "center";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Task({ task, id }) {
  const { userToken } = useContext(TokenContext);
  const [categories, setCategories] = useState([]);
  const [subCategory, setSubCategory] = useState("");
  const [subHeading, setSubHeading] = useState("");
  const [question, setQuestion] = useState("");
  const [answerA, setAnswerA] = useState("");
  const [answerB, setAnswerB] = useState("");
  const [answerC, setAnswerC] = useState("");
  const [answerD, setAnswerD] = useState("");
  const [refData, setRefData] = useState("");
  const [imgQData, setImgQData] = useState(null);
  const [imgAData, setImgAData] = useState(null);
  const [imgBData, setImgBData] = useState(null);
  const [imgCData, setImgCData] = useState(null);
  const [imgDData, setImgDData] = useState(null);
  const [imgRData, setImgRData] = useState(null);
  const [taskId, setTaskId] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openSnack, setOpenSnack] = useState(false);
  const [snackText, setSnackText] = useState("");

  useEffect(() => {
    async function getCategoryFunc() {
      try {
        const res = await axios.get("/category/getCategory");
        setCategories(res.data);
      } catch (error) {
        console.log(error);
      }
    }
    getCategoryFunc();
  }, []);

  const handleCloseSnack = () => {
    setOpenSnack(false);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  const handleEditConfirm = async (e, taskid) => {
    e.preventDefault();
    try {
      const res = await axios.post(`/task/editTask/${taskid}`, {
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
      });
      console.log(res);
      setSnackText("成果的に登録されました。");
      setOpenSnack(true);
    } catch (error) {
      console.log(error);
      setSnackText(error.response.data.message);
      setOpenSnack(true);
    }
    setOpenEditDialog(false);
    window.location.reload();
  };

  const handleImageChange = (e, setImageData) => {
    const file = e.target.files[0];

    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();

      reader.onload = () => {
        const img = new Image();
        img.src = reader.result;

        img.onload = () => {
          setImageData(reader.result); // Use the passed function to set data
        };
        img.onerror = () => {
          console.error("The file could not be read as an image.");
        };
      };

      reader.readAsDataURL(file);
    } else {
      console.error("Please upload a valid image file.");
    }
  };

  const handleCategoryChange = (e) => {
    setSubCategory(e.target.value);
  };

  async function handleDeleteConfirm(e, taskid) {
    e.preventDefault();
    try {
      await axios.post(
        "/task/removeTask",
        {
          taskid,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
    window.location.reload();
  }

  const handleEdit = async (e, taskid) => {
    e.preventDefault();
    try {
      const res = await axios.get(`/task/getTaskId/${taskid}`);
      setSubCategory(res.data.subCategory);
      setSubHeading(res.data.subHeading);
      setQuestion(res.data.question);
      setAnswerA(res.data.answerA);
      setAnswerB(res.data.answerB);
      setAnswerC(res.data.answerC);
      setAnswerD(res.data.answerD);
      setRefData(res.data.refData);
      setCorrectAnswer(res.data.correctAnswer);
      setImgAData(res.data.imgAData);
      setImgBData(res.data.imgBData);
      setImgCData(res.data.imgCData);
      setImgDData(res.data.imgDData);
      setImgQData(res.data.imgQData);
      setImgRData(res.data.imgRData);
      setTaskId(res.data._id);
      setOpenEditDialog(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="">
      <div className="remove-task text-lg text-white cursor-pointer border border-white w-8 text-center rounded-full border-2 bg-blue-700">
        <div onClick={(e) => handleEdit(e, task._id, id)}>{id}</div>
      </div>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={openSnack}
        onClose={handleCloseSnack}
        message={snackText}
        key={vertical + horizontal}
      />
      <Dialog
        open={openEditDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseEditDialog}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Edit / Delete Problem"}</DialogTitle>
        <DialogContent>
          <form>
            <div>
              <label htmlFor="title">QuestionTitle</label>
              <input
                type="text"
                name="subHeading"
                id="subHeading"
                value={subHeading}
                required
                onChange={(e) => {
                  setSubHeading(e.target.value);
                }}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
            <div className="my-3">
              <label htmlFor="question">Question</label>
              <textarea
                rows={3}
                name="question"
                id="question"
                value={question}
                required
                onChange={(e) => setQuestion(e.target.value)}
                style={{ resize: "none" }}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, setImgQData)}
                className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary my-3"
              />
            </div>
            <div className="flex flex-col md:flex-row md:justify-between">
              <div className="md:w-1/2 md:mx-auto pr-3">
                <label htmlFor="title">Answer A</label>
                <input
                  type="text"
                  name="answerA"
                  id="answerA"
                  value={answerA}
                  required
                  onChange={(e) => setAnswerA(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, setImgAData)}
                  className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary my-3"
                />
              </div>
              <div className="md:w-1/2 md:mx-auto pl-3">
                <label htmlFor="title">Answer B</label>
                <input
                  type="text"
                  name="answerB"
                  id="answerB"
                  value={answerB}
                  required
                  onChange={(e) => setAnswerB(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, setImgBData)}
                  className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary my-3"
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row md:justify-between">
              <div className="md:w-1/2 md:mx-auto pr-3">
                <label htmlFor="title">Answer C</label>
                <input
                  type="text"
                  name="answerC"
                  id="answerC"
                  value={answerC}
                  required
                  onChange={(e) => setAnswerC(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, setImgCData)}
                  className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary my-3"
                />
              </div>
              <div className="md:w-1/2 md:mx-auto pl-3">
                <label htmlFor="title">Answer D</label>
                <input
                  type="text"
                  name="answerD"
                  id="answerD"
                  value={answerD}
                  onChange={(e) => setAnswerD(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, setImgDData)}
                  className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary my-3"
                />
              </div>
            </div>
            <div>
              <label htmlFor="title">Reference Data</label>
              <input
                type="text"
                name="refData"
                id="refData"
                value={refData}
                onChange={(e) => setRefData(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, setImgRData)}
                className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary my-3"
              />
            </div>
            <div>
              <label htmlFor="title">Correct Answer</label>
              <select
                name="correctAnswer"
                id="correctAnswer"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/6 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-3"
                onChange={(e) => setCorrectAnswer(e.target.value)}
                value={correctAnswer}
              >
                <option defaultValue={""}></option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
            </div>
            <div className="flex justify-center">
              <button
                className=" bg-blue-700 rounded-md text-white px-5 py-3 w-36 font-bold text-lg"
                onClick={(e) => handleEditConfirm(e, taskId)}
              >
                Edit
              </button>
              <button
                className=" bg-red-700 rounded-md text-white px-5 py-3 w-36 font-bold text-lg ml-8"
                onClick={(e) => handleDeleteConfirm(e, taskId)}
              >
                Delete
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Task;
