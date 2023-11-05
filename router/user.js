import express from "express";
import passport from "passport";
import {
  handleMe,
  getAdminUser,
  updateUserRole,
  getAdminStats,
} from "../controller/user.js";
import { isLoggedIn, isAdmin } from "../middleware/auth.js";
const router = express.Router();

router.get("/me", isLoggedIn, handleMe);

router.get("/admin/users", isLoggedIn, isAdmin, getAdminUser);
router.patch("/admin/user/:id", isLoggedIn, isAdmin, updateUserRole);
router.get("/admin/stats", isLoggedIn, isAdmin, getAdminStats);

export default router;
