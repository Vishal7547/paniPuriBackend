import jwt from "jsonwebtoken";

// Create Token and saving in cookie
export const sendToken = (user, statusCode, res) => {
  const userData = {
    ...user,
  };
  try {
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    res
      .status(statusCode)
      .cookie("token", token, {
        expires: new Date(Date.now() + 600000),
        httpOnly: true,
      })
      .json({
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
