import express from "express";
import {
  addTask,
  getTask,
  removeTask,
  getAllTask,
  getTaskId,
  editTask,
  changeCategory,
  removeChangeCategoryTask,
} from "../controllers/taskController.js";
import requireAuth from "../middleware/requireAuth.js";

const router = express.Router();

router.post("/addTask", requireAuth, addTask);
router.post("/editTask/:id", editTask);
router.get("/getTask", requireAuth, getTask);
router.get("/getTaskId/:id", getTaskId);
router.get("/getAllTask", getAllTask);
router.post("/removeTask", requireAuth, removeTask);
router.post("/changeCategory", changeCategory);
router.post("/changeCategoryDeleteData", removeChangeCategoryTask);

export default router;
