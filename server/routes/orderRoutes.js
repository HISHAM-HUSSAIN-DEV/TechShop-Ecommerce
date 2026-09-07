import express from "express";

import protect from "../middleware/protect.js";
import adminOnly from "../middleware/adminOnly.js";

import {
  createOrder,
  getMyOrders,
  getOrderByNumber,
  cancelOrder,
  requestReturn,
  getAllOrders,
  getAdminOrderByNumber,
  updateOrderStatus,
  getReturnRequests,
  updateReturnStatus,
  getAdminStats,
} from "../controllers/orderController.js";

const router = express.Router();

// ========================
// User Routes
// ========================

router.post(
  "/",
  protect,
  createOrder
);

router.get(
  "/my-orders",
  protect,
  getMyOrders
);

// ========================
// Admin Static Routes
// ========================

router.get(
  "/admin/all",
  protect,
  adminOnly,
  getAllOrders
);

router.get(
  "/admin/returns",
  protect,
  adminOnly,
  getReturnRequests
);

router.get(
  "/admin/stats/dashboard",
  protect,
  adminOnly,
  getAdminStats
);

// ========================
// Admin Dynamic Routes
// ========================

router.get(
  "/admin/:orderNumber",
  protect,
  adminOnly,
  getAdminOrderByNumber
);

router.put(
  "/admin/:orderNumber/status",
  protect,
  adminOnly,
  updateOrderStatus
);

router.put(
  "/admin/:orderNumber/return-status",
  protect,
  adminOnly,
  updateReturnStatus
);

// ========================
// User Dynamic Routes
// ========================

router.get(
  "/:orderNumber",
  protect,
  getOrderByNumber
);

router.put(
  "/:orderNumber/cancel",
  protect,
  cancelOrder
);

router.put(
  "/:orderNumber/return",
  protect,
  requestReturn
);

export default router;