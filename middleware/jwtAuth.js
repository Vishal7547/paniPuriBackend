import jwt from "jsonwebtoken";
import { User } from "../model/user.js";

export const isLoggedIn = async (req, res, next) => {
  const { token } = req.cookies;
  console.log("token1", token);
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Please Login to access this resource",
    });
  }
  try {
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedData._id);
    req.user = user;
    next();
  } catch (e) {
    return res.status(501).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const isAdmin = (...roles) => {
  return (req, res, next) => {
    console.log(req);
    if (!roles.includes(req.user.role)) {
      console.log("user", req.user.role);
      return res.status(403).json({
        success: false,
        message: `Role: ${req.user.role} is not allowed to access this resouce `,
      });
    }

    next();
  };
};
