import express from "express";

import {
  getProductReviews,
  createReview,
  getMyReviews,
} from "../controllers/reviewController.js";

import protect from "../middleware/protect.js";

const router = express.Router();

router.get(
  "/my-reviews",
  protect,
  getMyReviews
);

router.get(
  "/product/:productId",
  getProductReviews
);

router.post(
  "/product/:productId",
  protect,
  createReview
);



export default router;