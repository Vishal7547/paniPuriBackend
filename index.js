import express, { urlencoded } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import Razorpay from "razorpay";
import cors from "cors";
import session from "express-session";
import { connectDB } from "./config/database.js";
import passport from "passport";
import { connectPassport } from "./utils/googleAuth.js";

const app = express();
dotenv.config({
  path: "./config/config.env",
});
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

connectDB();
export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: "auto",
      httpOnly: true,
      sameSite: "none",
    },
  })
);
app.use(cookieParser());

app.use(
  cors({
    credentials: true,
    origin: "https://burger-wala-eight.vercel.app",
    headers: {
      "Access-Control-Allow-Origin": "https://burger-wala-eight.vercel.app",
      "Access-Control-Allow-Credentials": true,
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(passport.initialize());
app.use(passport.session());
connectPassport();
app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "working" });
});

import user from "./router/user.js";
import authUser from "./router/auth.js";
import order from "./router/order.js";

app.use("/api/v1", user);
app.use("/api/v2", order);
app.use("/", authUser);
app.listen(process.env.PORT, () => {
  console.log(
    `server is working on port number: http://localhost:${process.env.PORT}`
  );
});
