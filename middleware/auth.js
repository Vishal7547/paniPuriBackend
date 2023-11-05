export const isLoggedIn = (req, res, next) => {
  const token = req.cookies["babapanipuri"];
  console.log("token", token);
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not Logged In",
    });
  }
  next();
};

export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(405).json({
      success: false,
      message: "Only Admin Allowed",
    });
  }
  next();
};
