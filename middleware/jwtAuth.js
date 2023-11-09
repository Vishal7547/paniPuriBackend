import jwt from "jsonwebtoken";
import { User } from "../model/user.js";

export const isLoggedIn = async (req, res, next) => {
  const { token } = req.cookies;
  console.log("token", token);
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Please Login to access this resource",
    });
  }
  try {
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decodedData._doc._id);
  } catch (e) {
    return res.status(501).json({
      success: false,
      message: "Internal server error",
    });
  }
  next();
};

export const isAdmin = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role: ${req.user.role} is not allowed to access this resouce `,
      });
    }

    next();
  };
};
