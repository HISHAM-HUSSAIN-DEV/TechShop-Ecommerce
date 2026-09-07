import express from "express";

import {
  signUp,
  signIn,
  updateProfile,
  toggleWishlist,
  getWishlist,
  changePassword,
  getAllUsers,
} from "../controllers/userController.js";

import protect from "../middleware/protect.js";
import adminOnly from "../middleware/adminOnly.js";

const router = express.Router();

// =========================
// Auth
// =========================
router.post("/signup", signUp);

router.post("/signin", signIn);

// =========================
// Profile
// =========================
router.put(
  "/profile",
  protect,
  updateProfile
);

// =========================
// Wishlist
// =========================
router.put(
  "/wishlist/:productId",
  protect,
  toggleWishlist
);

router.get(
  "/wishlist",
  protect,
  getWishlist
);

// =========================
// Change Password
// =========================
router.put(
  "/change-password",
  protect,
  changePassword
);

// =========================
// Admin - Users
// =========================
router.get(
  "/admin/users",
  protect,
  adminOnly,
  getAllUsers
);

export default router;