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

connectDB();
export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    name: "babapanipuri",
    cookie: {
      secure: false,
      httpOnly: false,
      sameSite: false,
      // maxAge: 0,
    },
  })
);
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    name: "babapanipuri",
    cookie: {
      secure: process.env.NODE_ENV === "development" ? false : true,
      httpOnly: process.env.NODE_ENV === "development" ? false : true,
      sameSite: process.env.NODE_ENV === "development" ? false : "none",
    },
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(
  urlencoded({
    extended: true,
  })
);
app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(passport.initialize());
app.use(passport.session());
connectPassport();
app.get("/", (req, res) => {
  res.status(200).json({ success: true });
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
