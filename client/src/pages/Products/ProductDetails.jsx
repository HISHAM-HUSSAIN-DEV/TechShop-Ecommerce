import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaStar } from "react-icons/fa";

import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import AddToCartButton from "../../components/AddToCartButton.jsx";
import Toast from "../../components/Toast.jsx";
const API_URL = import.meta.env.VITE_API_URL;

const ProductDetails = () => {
  const { id } = useParams();

  const { addToCart } = useCart();
  const { token, isAuthenticated } = useAuth();

  // =========================
  // Toast
  // =========================
  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });

  const showToast = (
    message,
    type = "success"
  ) => {
    setToast({
      message,
      type,
    });
  };

  // =========================
  // Product
  // =========================
  const [product, setProduct] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =========================
  // Reviews
  // =========================
  const [reviews, setReviews] =
    useState([]);

  const [
    averageRating,
    setAverageRating,
  ] = useState(0);

  const [
    totalReviews,
    setTotalReviews,
  ] = useState(0);

  // =========================
  // Review Form
  // =========================
  const [rating, setRating] =
    useState(0);

  const [comment, setComment] =
    useState("");

  const [
    reviewLoading,
    setReviewLoading,
  ] = useState(false);

  const [
    reviewSubmitted,
    setReviewSubmitted,
  ] = useState(false);

  const [
    reviewFeedback,
    setReviewFeedback,
  ] = useState({
    message: "",
    type: "",
  });

  // =========================
  // Review Feedback
  // =========================
  const showReviewFeedback = (
    message,
    type
  ) => {
    setReviewFeedback({
      message,
      type,
    });

    showToast(
      message,
      type
    );
  };

  // =========================
  // Fetch Product
  // =========================
  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/products/${id}`
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load product"
        );
      }

      setProduct(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Fetch Reviews
  // =========================
  const fetchReviews = async () => {
    try {
      const response = await fetch(
        `${API_URL}/reviews/product/${id}`
      );

      const data =
        await response.json();

      if (!response.ok) {
        console.error(
          data.message
        );

        return;
      }

      setReviews(
        data.reviews || []
      );

      setAverageRating(
        data.averageRating || 0
      );

      setTotalReviews(
        data.totalReviews || 0
      );
    } catch (error) {
      console.error(
        "Fetch reviews error:",
        error
      );
    }
  };

  // =========================
  // Load Product + Reviews
  // =========================
  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [id]);

  // =========================
  // Submit Review
  // =========================
  const handleReviewSubmit =
    async (e) => {
      e.preventDefault();

      setReviewFeedback({
        message: "",
        type: "",
      });

      // Rating validation
      if (!rating) {
        showReviewFeedback(
          "Please select a rating",
          "warning"
        );

        return;
      }

      // Comment validation
      if (!comment.trim()) {
        showReviewFeedback(
          "Please write a comment",
          "warning"
        );

        return;
      }

      try {
        setReviewLoading(true);

        const response =
          await fetch(
            `${API_URL}/reviews/product/${id}`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,
              },

              body: JSON.stringify({
                rating,
                comment:
                  comment.trim(),
              }),
            }
          );

        const data =
          await response.json();

        // =========================
        // Review Error
        // =========================
        if (!response.ok) {
          if (
            data.message
              ?.toLowerCase()
              .includes(
                "already reviewed"
              )
          ) {
            showReviewFeedback(
              "You already reviewed this product",
              "warning"
            );
          } else {
            showReviewFeedback(
              data.message ||
                "Failed to add review",
              "error"
            );
          }

          return;
        }

        // =========================
        // Review Success
        // =========================
        setRating(0);
        setComment("");

        setReviewSubmitted(
          true
        );

        showReviewFeedback(
          "Review submitted successfully",
          "success"
        );

        setTimeout(() => {
          setReviewSubmitted(
            false
          );
        }, 700);

        // Update reviews
        await fetchReviews();
      } catch (error) {
        console.error(error);

        showReviewFeedback(
          "Something went wrong",
          "error"
        );
      } finally {
        setReviewLoading(
          false
        );
      }
    };

  // =========================
  // Add To Cart
  // =========================
  const handleAddToCart = () => {
    if (product.stock <= 0) {
      showToast(
        "This product is out of stock",
        "error"
      );

      return false;
    }

    const success =
      addToCart(product);

    if (!success) {
      showToast(
        "You reached the maximum available stock",
        "warning"
      );

      return false;
    }

    showToast(
      "Product added to cart",
      "success"
    );

    return true;
  };

  // =========================
  // Loading
  // =========================
  if (loading) {
    return (
      <div className="py-20 text-center text-gray-500">
        Loading product...
      </div>
    );
  }

  // =========================
  // Error
  // =========================
  if (error) {
    return (
      <div className="py-20 text-center text-red-500">
        {error}
      </div>
    );
  }

  if (!product) {
    return null;
  }

  // =========================
  // Review Message Style
  // =========================
  const reviewMessageStyles = {
    success:
      "border-green-200 bg-green-50 text-green-700",

    warning:
      "border-yellow-200 bg-yellow-50 text-yellow-700",

    error:
      "border-red-200 bg-red-50 text-red-600",
  };

  return (
    <>
      {/* ========================= */}
      {/* Toast */}
      {/* ========================= */}

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() =>
          setToast({
            message: "",
            type: "success",
          })
        }
      />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* ========================= */}
        {/* Product Section */}
        {/* ========================= */}

        <div className="grid gap-10 md:grid-cols-2">
          {/* Product Image */}

          <div className="flex items-center justify-center rounded-2xl bg-gray-50 p-8">
            <img
              src={product.image}
              alt={product.name}
              className="max-h-125 w-full object-contain"
            />
          </div>

          {/* Product Information */}

          <div className="flex flex-col justify-center">
            {/* Category */}

            <p className="mb-2 text-sm font-semibold text-blue-600">
              {product.category}
            </p>

            {/* Name */}

            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              {product.name}
            </h1>

            {/* Rating */}

            <div className="mt-4 flex items-center gap-2">
              <FaStar
                className={
                  totalReviews >
                  0
                    ? "text-yellow-400"
                    : "text-gray-300"
                }
              />

              {totalReviews >
              0 ? (
                <>
                  <span className="font-semibold">
                    {
                      averageRating
                    }
                  </span>

                  <span className="text-sm text-gray-500">
                    (
                    {
                      totalReviews
                    }{" "}
                    {totalReviews ===
                    1
                      ? "review"
                      : "reviews"}
                    )
                  </span>
                </>
              ) : (
                <span className="text-sm text-gray-500">
                  No reviews yet
                </span>
              )}
            </div>

            {/* Price */}

            <p className="mt-6 text-3xl font-bold text-gray-900">
              {product.price.toLocaleString()}{" "}
              SAR
            </p>

            {/* Description */}

            <p className="mt-6 leading-7 text-gray-600">
              {
                product.description
              }
            </p>

            {/* Stock */}

            <div className="mt-6">
              {product.stock >
              0 ? (
                <p className="font-medium text-green-600">
                  In Stock (
                  {product.stock}{" "}
                  available)
                </p>
              ) : (
                <p className="font-medium text-red-600">
                  Out of Stock
                </p>
              )}
            </div>

            {/* Add To Cart */}

            <AddToCartButton
              onAdd={
                handleAddToCart
              }
              disabled={
                product.stock <= 0
              }
              className="mt-8 w-full px-6 py-4"
            />
          </div>
        </div>

        {/* ========================= */}
        {/* Reviews Section */}
        {/* ========================= */}

        <div className="mt-16 border-t border-gray-200 pt-10">
          <h2 className="text-2xl font-bold text-gray-900">
            Customer Reviews
          </h2>

          {/* Reviews Summary */}

          <div className="mt-4 flex items-center gap-3">
            <FaStar
              className={`text-xl ${
                totalReviews > 0
                  ? "text-yellow-400"
                  : "text-gray-300"
              }`}
            />

            {totalReviews >
            0 ? (
              <span className="text-lg font-semibold">
                {
                  averageRating
                }{" "}
                / 5
              </span>
            ) : (
              <span className="text-gray-500">
                No reviews yet
              </span>
            )}
          </div>

          {totalReviews >
            0 && (
            <p className="mt-1 text-sm text-gray-500">
              Based on{" "}
              {totalReviews}{" "}
              {totalReviews === 1
                ? "review"
                : "reviews"}
            </p>
          )}

          {/* ========================= */}
          {/* Write Review */}
          {/* ========================= */}

          <div className="mt-10 rounded-xl border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Write a Review
            </h3>

            {!isAuthenticated ? (
              <p className="mt-4 text-gray-500">
                Please sign in
                to write a
                review.
              </p>
            ) : (
              <form
                onSubmit={
                  handleReviewSubmit
                }
                className="mt-6"
              >
                {/* ========================= */}
                {/* Select Stars */}
                {/* ========================= */}

                <div>
                  <p className="mb-3 text-sm font-medium text-gray-700">
                    Your Rating
                  </p>

                  <div className="flex gap-2">
                    {[
                      1,
                      2,
                      3,
                      4,
                      5,
                    ].map(
                      (
                        star
                      ) => (
                        <button
                          key={
                            star
                          }
                          type="button"
                          onClick={() =>
                            setRating(
                              star
                            )
                          }
                          disabled={
                            reviewLoading ||
                            reviewSubmitted
                          }
                          className="cursor-pointer text-3xl transition hover:scale-110 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <FaStar
                            className={
                              star <=
                              rating
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }
                          />
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* ========================= */}
                {/* Comment */}
                {/* ========================= */}

                <div className="mt-5">
                  <label
                    htmlFor="reviewComment"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Your Review
                  </label>

                  <textarea
                    id="reviewComment"
                    value={
                      comment
                    }
                    onChange={(
                      e
                    ) =>
                      setComment(
                        e
                          .target
                          .value
                      )
                    }
                    placeholder="Write your review..."
                    rows="5"
                    disabled={
                      reviewLoading ||
                      reviewSubmitted
                    }
                    className="w-full resize-none rounded-lg border border-gray-300 p-4 outline-none transition focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-70"
                  />
                </div>

                {/* ========================= */}
                {/* Review Message */}
                {/* ========================= */}

                {reviewFeedback.message && (
                  <div
                    className={`mt-4 rounded-lg border px-4 py-3 text-sm font-medium ${
                      reviewMessageStyles[
                        reviewFeedback
                          .type
                      ] ||
                      reviewMessageStyles.error
                    }`}
                  >
                    {
                      reviewFeedback.message
                    }
                  </div>
                )}

                {/* ========================= */}
                {/* Submit Button */}
                {/* ========================= */}

                <button
                  type="submit"
                  disabled={
                    reviewLoading ||
                    reviewSubmitted
                  }
                  className={`mt-5 flex min-w-40 items-center justify-center gap-2 rounded-lg px-6 py-3 font-semibold text-white transition-all duration-200 ${
                    reviewSubmitted
                      ? "scale-95 bg-green-600"
                      : reviewLoading
                        ? "cursor-not-allowed bg-gray-400"
                        : "cursor-pointer bg-blue-600 hover:bg-blue-700 active:scale-95"
                  }`}
                >
                  {reviewLoading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />

                      Loading...
                    </>
                  ) : reviewSubmitted ? (
                    <>
                      <span>
                        ✓
                      </span>

                      Submitted
                    </>
                  ) : (
                    "Submit Review"
                  )}
                </button>
              </form>
            )}
          </div>

          {/* ========================= */}
          {/* Reviews List */}
          {/* ========================= */}

          <div className="mt-10">
            {reviews.length ===
            0 ? (
              <div className="rounded-xl bg-gray-50 p-8 text-center">
                <p className="text-gray-500">
                  No reviews
                  yet. Be the
                  first to
                  review this
                  product.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {reviews.map(
                  (
                    review
                  ) => (
                    <div
                      key={
                        review._id
                      }
                      className="border-b border-gray-200 pb-6"
                    >
                      {/* User + Date */}

                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {
                              review
                                .user
                                ?.firstName
                            }{" "}
                            {
                              review
                                .user
                                ?.lastName
                            }
                          </p>

                          {/* Review Stars */}

                          <div className="mt-2 flex gap-1">
                            {[
                              1,
                              2,
                              3,
                              4,
                              5,
                            ].map(
                              (
                                star
                              ) => (
                                <FaStar
                                  key={
                                    star
                                  }
                                  className={
                                    star <=
                                    review.rating
                                      ? "text-yellow-400"
                                      : "text-gray-300"
                                  }
                                />
                              )
                            )}
                          </div>
                        </div>

                        {/* Date */}

                        <span className="text-sm text-gray-400">
                          {new Date(
                            review.createdAt
                          ).toLocaleDateString(
                            "en-US",
                            {
                              month:
                                "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </div>

                      {/* Comment */}

                      <p className="mt-4 leading-7 text-gray-600">
                        {
                          review.comment
                        }
                      </p>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;