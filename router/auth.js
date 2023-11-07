import express from "express";
import passport from "passport";
const router = express.Router();

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    // failureRedirect: "/google/fail",
    successRedirect: "http://localhost:3000",
    // successRedirect: "/api/v1/me",
  })
);

router.get("/google/fail", (req, res) => {
  res.status.json({
    success: false,
    message: "Internal error",
  });
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }

    res.clearCookie("babapanipuri", {
      secure: process.env.NODE_ENV === "development" ? false : true,
      httpOnly: process.env.NODE_ENV === "development" ? false : true,
      sameSite: process.env.NODE_ENV === "development" ? false : "none",
    });

    res.status(200).json({
      success: true,
      message: "Logged Out",
    });
  });
});
export default router;