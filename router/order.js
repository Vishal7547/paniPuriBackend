import express from "express";
import {
  placeOrder,
  getMyOrders,
  getOrderDetails,
  getAdminOrders,
  processOrder,
  placeOrderOnline,
  paymentVerification,
} from "../controller/order.js";
// import { isLoggedIn, isAdmin } from "../middleware/auth.js";
import { isLoggedIn, isAdmin } from "../middleware/jwtAuth.js";

const router = express.Router();
router.post("/createorder", isLoggedIn, placeOrder);
router.post("/createorderonline", isLoggedIn, placeOrderOnline);
router.post("/paymentverification", isLoggedIn, paymentVerification);

router.get("/myorders", isLoggedIn, getMyOrders);
router.get("/order/:id", isLoggedIn, getOrderDetails);
// Add Admin Middleware
router.get("/admin/orders", isLoggedIn, isAdmin("admin"), getAdminOrders);
router.get("/admin/order/:id", isLoggedIn, isAdmin("admin"), processOrder);
export default router;
