import express from "express";
import { addCategory, getCategory, editCategory, deleteCategory } from "../controllers/categoryController.js";
const router = express.Router();

router.post("/addCategory", addCategory);
router.get("/getCategory", getCategory);
router.post("/editCategory", editCategory);
router.post("/deleteCategory", deleteCategory);

export default router;
