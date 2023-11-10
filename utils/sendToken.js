import jwt from "jsonwebtoken";

// Create Token and saving in cookie
export const sendToken = (user, statusCode, res) => {
  const userData = {
    ...user,
  };
  try {
    const token = jwt.sign(userData, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    // options for cookie
    const options = {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };
    console.log(user);

    return res.status(statusCode).cookie("token", token, options).json({
      success: true,
      user,
      token,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e,
    });
  }
};
