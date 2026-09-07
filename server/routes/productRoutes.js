import express from "express";

import {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import protect from "../middleware/protect.js";
import adminOnly from "../middleware/adminOnly.js";

const router = express.Router();

router.get("/", getProducts);

router.post(
  "/",
  protect,
  adminOnly,
  addProduct
);

router.put(
  "/:id",
  protect,
  adminOnly,
  updateProduct
);

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteProduct
);

router.get("/:id", getProductById);

export default router;