import { User } from "../model/user.js";
import { Order } from "../model/order.js";

export const handleMe = (req, res) => {
  console.log(req.user);

  res.status(200).json({ success: true, user: req.user });
};

export const getAdminUser = async (req, res) => {
  try {
    const user = await User.find({});
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (e) {
    return res.status(501).json({
      success: false,
      message: e,
    });
  }
};
export const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  const user = await User.findById(id);

  // If the user is not found, return a 404 error
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { $set: { role } },
      { new: true }
    );
    return res.status(200).json({ success: true, user });
  } catch (error) {
    // Handle the error
    return res.status(500).send({ success: false, message: error });
  }
};

export const getAdminStats = async (req, res) => {
  const usersCount = await User.countDocuments();

  const orders = await Order.find({});

  const preparingOrders = orders.filter((i) => i.orderStatus === "Preparing");
  const shippedOrders = orders.filter((i) => i.orderStatus === "Shipped");
  const deliveredOrders = orders.filter((i) => i.orderStatus === "Delivered");

  let totalIncome = 0;

  orders.forEach((i) => {
    totalIncome += i.totalAmount;
  });

  res.status(200).json({
    success: true,
    usersCount,
    ordersCount: {
      total: orders.length,
      preparing: preparingOrders.length,
      shipped: shippedOrders.length,
      delivered: deliveredOrders.length,
    },
    totalIncome,
  });
};
