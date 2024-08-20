import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

import clientModel from "../models/clientModel.js";

//create token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: 3 * 24 * 60 * 60,
  });
};

//login user
const loginClient = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Please enter all fields" });
    }
    const client = await clientModel.findOne({ email: email, apply: true });

    if (!client) {
      return res.status(400).json({ message: "client does not exist" });
    }

    const isMatch = await bcrypt.compare(password, client.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = createToken(client._id);
    res.status(200).json({ client, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//register user
const registerClient = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    //check if user already exists
    const exists = await clientModel.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "client already exists" });
    }
    if (
      validator.isEmpty(name) ||
      validator.isEmpty(email) ||
      validator.isEmpty(password)
    ) {
      return res.status(400).json({ message: "Please enter all fields" });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Please enter a valid email" });
    }
    if (!validator.isStrongPassword(password)) {
      return res
        .status(400)
        .json({ message: "Please enter a strong password" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newClient = new clientModel({
      name,
      email,
      password: hashedPassword,
      apply: true,
      age: getRandomInt(20, 30),
    });
    const client = await newClient.save();
    console.log(client);
    const token = createToken(client._id);
    res.status(200).json({ client, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get user info
const getAllClient = async (req, res) => {
  try {
    const client = await clientModel.find({});
    res.status(200).json(client);
  } catch (error) {
    res.status(502).json({ message: error.message });
  }
};
//set Apply
const setApply = async (req, res) => {
  const { id, apply } = req.body;

  try {
    const client = await clientModel.findOneAndUpdate(
      { _id: id },
      { $set: { apply: apply } },
      { new: true }
    );

    if (client) {
      res.status(200).json(client);
    } else {
      res.status(404).json({ message: "Client not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//delete client
const deleteClient = async (req, res) => {
  const { id } = req.body;

  try {
    const client = await clientModel.findOneAndDelete({ _id: id });
    if (!client) {
      return res
        .status(404)
        .send({ success: false, message: "No client found" });
    }
    res.send({ success: true, message: "Client deleted successfully", client });
  } catch (err) {
    res.status(500).send({ success: false, message: err.message });
  }
};

function getRandomInt(min, max) {
  min = Math.ceil(min); // Ensure the minimum is rounded up to the nearest whole number
  max = Math.floor(max); // Ensure the maximum is rounded down to the nearest whole number
  return Math.floor(Math.random() * (max - min + 1) + min);
}
export { loginClient, registerClient, getAllClient, setApply, deleteClient };
