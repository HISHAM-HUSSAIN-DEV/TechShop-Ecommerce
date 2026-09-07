import Review from "../models/Review.js";
import Product from "../models/Product.js";

export const getProductReviews = async (req, res) => {
  try {
    const productId = Number(req.params.productId);

    if (Number.isNaN(productId)) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    const reviews = await Review.find({
      product: productId,
    })
      .populate("user", "firstName lastName")
      .sort({ createdAt: -1 });

    const totalReviews = reviews.length;

    const averageRating =
      totalReviews > 0
        ? reviews.reduce(
            (total, review) => total + review.rating,
            0
          ) / totalReviews
        : 0;

    res.status(200).json({
      reviews,
      totalReviews,
      averageRating: Number(averageRating.toFixed(1)),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const createReview = async (req, res) => {
  try {
    const productId = Number(req.params.productId);
    const { rating, comment } = req.body;

    if (Number.isNaN(productId)) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    if (!rating || Number(rating) < 1 || Number(rating) > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    if (!comment?.trim()) {
      return res.status(400).json({
        message: "Comment is required",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const existingReview = await Review.findOne({
      product: productId,
      user: req.user._id,
    });

    if (existingReview) {
      return res.status(400).json({
        message: "You already reviewed this product",
      });
    }

    const review = await Review.create({
      product: productId,
      user: req.user._id,
      rating: Number(rating),
      comment: comment.trim(),
    });

    const populatedReview = await Review.findById(
      review._id
    ).populate("user", "firstName lastName");

    res.status(201).json({
      message: "Review added successfully",
      review: populatedReview,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
export const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      user: req.user._id,
    })
      .populate(
        "product",
        "name image price category"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      reviews,
    });
  } catch (error) {
    console.error(
      "GET MY REVIEWS ERROR:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};