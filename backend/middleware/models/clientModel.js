import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: String, required: true },
  rating: { type: String, required: false, default: "0%" },
  apply: { type: Boolean, required: true },
  resetToken: { type: String, required: false },
});

const clientModel = mongoose.model("Client", clientSchema);
export default clientModel;
