import express from "express";
import passport from "passport";
import {
  placeOrder,
  getMyOrders,
  getOrderDetails,
  getAdminOrders,
  processOrder,
  placeOrderOnline,
  paymentVerification,
} from "../controller/order.js";
import { isLoggedIn, isAdmin } from "../middleware/auth.js";
const router = express.Router();
router.post("/createorder", isLoggedIn, placeOrder);
router.post("/createorderonline", isLoggedIn, placeOrderOnline);
router.post("/paymentverification", isLoggedIn, paymentVerification);

router.get("/myorders", isLoggedIn, getMyOrders);
router.get("/order/:id", isLoggedIn, getOrderDetails);
// Add Admin Middleware
router.get("/admin/orders", isLoggedIn, isAdmin, getAdminOrders);
router.get("/admin/order/:id", isLoggedIn, isAdmin, processOrder);
export default router;
