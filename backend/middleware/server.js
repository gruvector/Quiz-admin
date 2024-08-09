import express, { application } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import userRouter from "./routes/userRoute.js";
import taskRouter from "./routes/taskRoute.js";
import forgotPasswordRouter from "./routes/forgotPassword.js";
import clientRouter from "./routes/clientRoute.js";
import categoryRouter from "./routes/categoryRouter.js";

//app config
dotenv.config();
const app = express();
const port = process.env.PORT || 8001;
mongoose.set("strictQuery", true);

//middlewares
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

//db config

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  connectTimeoutMS: 30000,
  socketTimeoutMS: 45000,
};

const connectDatabase = async () => {
  await mongoose.connect(process.env.MONGO_URI, options, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("DB Connected");
    }
  });
};
connectDatabase();

//api endpoints
app.use("/api/user", userRouter);
app.use("/api/task", taskRouter);
app.use("/api/client", clientRouter);
app.use("/api/forgotPassword", forgotPasswordRouter);
app.use("/api/category", categoryRouter);

//listen
app.listen(port, () => console.log(`Listening on localhost:${port}`));
