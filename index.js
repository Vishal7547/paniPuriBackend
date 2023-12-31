import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import Razorpay from "razorpay";
import bodyParser from "body-parser";
import cors from "cors";
// import session from "express-session";
import { connectDB } from "./config/database.js";

const app = express();
dotenv.config({
  path: "./config/config.env",
});

connectDB();
export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

// app.use(
//   session({
//     secret: process.env.SECRET,
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       secure: "auto",
//       httpOnly: true,
//       sameSite: "none",
//     },
//   })
// );
// app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: "https://burger-wala-l81iqf7sg-vishal7547.vercel.app/",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
// app.use(cors());

app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "working" });
});

import user from "./router/user.js";
// import authUser from "./router/auth.js";
import authUser from "./router/jwtAuth.js";

import order from "./router/order.js";

app.use("/api/v1", user);
app.use("/api/v2", order);
app.use("/", authUser);

app.listen(process.env.PORT, () => {
  console.log(
    `server is working on port number: http://localhost:${process.env.PORT}`
  );
});
