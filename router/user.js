import express from "express";
import {
  handleMe,
  getAdminUser,
  updateUserRole,
  getAdminStats,
} from "../controller/user.js";
// import { isLoggedIn, isAdmin } from "../middleware/auth.js";
import { isLoggedIn, isAdmin } from "../middleware/jwtAuth.js";

const router = express.Router();

router.get("/me", isLoggedIn, handleMe);

router.get("/admin/users", isLoggedIn, getAdminUser);
router.patch("/admin/user/:id", isLoggedIn, isAdmin("admin"), updateUserRole);
router.get("/admin/stats", isAdmin("admin"), getAdminStats);

export default router;
