import { Order } from "../model/order.js";
import { Payment } from "../model/payment.js";
import { instance } from "../index.js";
import crypto from "crypto";

export const placeOrder = async (req, res) => {
  //   console.log("user", req.user);
  const {
    shippingInfo,
    orderItems,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingCharges,
    totalAmount,
  } = req.body;

  const user = req.user._id;
  const orderOptions = {
    shippingInfo,
    orderItems,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingCharges,
    totalAmount,
    user,
  };

  try {
    await Order.create(orderOptions);

    return res.status(201).json({
      success: true,
      message: "Order Placed Successfully via Cash On Delivery",
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e,
    });
  }
};
export const placeOrderOnline = async (req, res) => {
  const {
    shippingInfo,
    orderItems,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingCharges,
    totalAmount,
  } = req.body;

  const user = req.user._id;

  const orderOptions = {
    shippingInfo,
    orderItems,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingCharges,
    totalAmount,
    user,
  };
  console.log(orderOptions);
  const options = {
    amount: Number(totalAmount) * 100,
    currency: "INR",
  };
  console.log(options);

  try {
    const order = await instance.orders.create(options);

    res.status(201).json({
      success: true,
      order,
      orderOptions,
    });
  } catch (e) {
    console.log(e);
    res.status(401).json({
      success: false,
      error: e,
    });
  }
};

export const paymentVerification = async (req, res, next) => {
  const {
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    orderOptions,
  } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
    .update(body)
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  try {
    if (isAuthentic) {
      const payment = await Payment.create({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      });

      await Order.create({
        ...orderOptions,
        paidAt: new Date(Date.now()),
        paymentInfo: payment._id,
      });

      res.status(201).json({
        success: true,
        message: `Order Placed Successfully. Payment ID: ${payment._id}`,
      });
    } else {
      return res.status(400).json({
        status: false,
        message: "Payment Failed",
      });
    }
  } catch (e) {
    return res.status(500).json({
      status: false,
      message: "internal server error",
    });
  }
};
export const getMyOrders = async (req, res) => {
  console.log(req.user);
  try {
    const orders = await Order.find({
      user: req.user._id,
    }).populate("user", "name");

    if (!orders || orders.length <= 0) {
      return res.status(401).json({
        success: false,
        message: "not found",
      });
    }
    res.status(200).json({
      success: true,
      orders,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: e,
    });
  }
};

export const getOrderDetails = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Invalid Order Id",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};

export const getAdminOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "name");
    if (!orders) {
      return res.status(404).json({
        success: false,
        message: "not  found",
      });
    }
    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Internal server  error",
    });
  }
};

export const processOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Invalid Order Id",
      });
    }
    if (order.orderStatus === "Preparing") order.orderStatus = "Shipped";
    else if (order.orderStatus === "Shipped") {
      order.orderStatus = "Delivered";
      order.deliveredAt = new Date(Date.now());
    } else if (order.orderStatus === "Delivered") {
      return res.status(400).json({
        success: false,
        message: "Food Already Delivered",
      });
    }
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Status Updated Successfully",
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
