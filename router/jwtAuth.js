import express from "express";

import { User } from "../model/user.js";
import { sendToken } from "../utils/sendToken.js";
const router = express.Router();

// Register a User

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  console.log(req.body);

  try {
    const user = await User.create({
      name,
      email,
      password,
    });
    console.log(user);

    sendToken(user, 201, res);
  } catch (e) {
    res.status(500).json({
      success: false,
      message: e,
    });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // checking if user has given password and email both

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please Enter Email & Password",
    });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  const passwordCheck = await User.findOne({ password: req.body.password });

  if (!passwordCheck) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  sendToken(user, 200, res);
});

router.get("/logout", (req, res) => {
  // Logout User
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});
export default router;
