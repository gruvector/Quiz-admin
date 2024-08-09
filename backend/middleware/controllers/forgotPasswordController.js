import userModel from "../models/userModel.js";
import { createTransport } from "nodemailer";
import crypto from "crypto";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import fs from "fs";
dotenv.config();

// Route to handle "forgot password" request
const forgotPassword = async (req, res) => {
  // const { email } = req.body;

  // // Check if email exists in the database
  // const user = await userModel.findOne({ email });
  // if (!user) {
  //   return res.status(404).json({ message: "User not found" });
  // }

  // // Generate reset token
  // const resetToken = crypto.randomBytes(20).toString("hex");
  // user.resetToken = resetToken;
  // await user.save();

  // //Send email with reset token
  // const resetUrl = `https://todo-app-b96a5.web.app/resetPassword?token=${resetToken}`;
  // var transporter = createTransport({
  //   service: "gmail",
  //   host: "smtp.gmail.com",
  //   port: 465,
  //   secure: true,
  //   auth: {
  //     user: process.env.GMAIL_USERNAME,
  //     pass: process.env.GMAIL_PASSWORD,
  //   },
  // });

  // var mailOptions = {
  //   from: "alok.yadav6000@gmail.com",
  //   to: email,
  //   subject: "Reset Password",
  //   html: `<h1>Reset Password</h1><h2>Click on the link to reset your password</h2><h3>${resetUrl}</h3>`,
  // };

  // await transporter.sendMail(mailOptions, function (error, info) {
  //   if (error) {
  //     console.log(error);
  //   } else {
  //     console.log("Email sent: " + info.response);
  //   }
  // });

  // res
  //   .status(200)
  //   .json({
  //     message: "A link to reset your password have been sent to your email.",
  //   });

  fs.readFile("./data.json", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return;
    }
    try {
      const jsonData = JSON.parse(data);
      console.log("Data read successfully:", jsonData);
    } catch (err) {
      console.error("Error parsing JSON:", err);
    }
  });
};

//  Route to handle password reset request
const resetPassword = async (req, res) => {
  // const { token, password } = req.body;

  // // Verify reset token
  // console.log("token: ", token);
  // const user = await userModel.findOne({ resetToken: token });
  // if (!user) {
  //   return res.status(400).json({ message: "Invalid token" });
  // }

  // // Update password
  // const salt = await bcrypt.genSalt(10);
  // user.password = await bcrypt.hash(password, salt);
  // user.resetToken = null;
  // await user.save();

  // res.status(200).json({ message: "Password reset successful" });

  const dataToWrite = {
    name: "ChatGPT",
    type: "AI",
  };

  // Asynchronously write data to a JSON file
  fs.writeFile(
    "./output.json",
    JSON.stringify(dataToWrite, null, 2),
    "utf8",
    (err) => {
      if (err) {
        console.error("Error writing file:", err);
        return;
      }
      console.log("Data written successfully");
    }
  );
};
export { forgotPassword, resetPassword };
