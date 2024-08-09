import mongoose from "mongoose";
const taskInstance = mongoose.Schema(
  {
    subCategory: { type: String, required: true },
    subHeading: { type: String, required: true },
    question: { type: String, required: true },
    answerA: { type: String, required: true },
    answerB: { type: String, required: true },
    answerC: { type: String, required: true },
    answerD: { type: String, required: false },
    refData: { type: String, required: false },
    correctAnswer: { type: String, required: true },
    imageA: { type: Object, required: false },
    imageB: { type: Object, required: false },
    imageC: { type: Object, required: false },
    imageD: { type: Object, required: false },
    imageQ: { type: Object, required: false },
    imageR: { type: Object, required: false },
    completed: { type: Boolean, required: true },
  },
  { timestamps: true }
);

const taskModel = mongoose.model("Task", taskInstance);
export default taskModel;
