import mongoose from "mongoose";
const Schema = new mongoose.Schema({
  // name: String,
  // photo: String,
  // googleId: {
  //   type: String,
  //   required: true,
  //   unique: true,
  // },

  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const User = mongoose.model("User", Schema);
