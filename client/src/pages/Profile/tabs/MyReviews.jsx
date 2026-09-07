import React, {
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";

import { useAuth } from "../../../context/AuthContext";

import Toast from "../../../components/Toast.jsx";
import LoadingSpinner from "../../../components/LoadingSpinner.jsx";

const MyReviews = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [reviews, setReviews] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

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

  useEffect(() => {
    const fetchMyReviews = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/reviews/my-reviews",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          showToast(
            data.message ||
              "Failed to load your reviews.",
            "error"
          );
          return;
        }

        setReviews(data.reviews);
      } catch (error) {
        console.error(
          "FETCH MY REVIEWS ERROR:",
          error
        );

        showToast(
          "Something went wrong while loading your reviews.",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchMyReviews();
    } else {
      setLoading(false);
    }
  }, [token]);

  const formatReviewDate = (date) => {
    return new Date(date).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    );
  };

  return (
    <>
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

      {loading ? (
        <LoadingSpinner text="Loading reviews..." />
      ) : (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              My Reviews
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              View the products you've reviewed.
            </p>
          </div>

          {reviews.length === 0 ? (
            <div className="rounded-xl bg-white p-10 text-center shadow-sm">
              <FaStar className="mx-auto text-4xl text-gray-300" />

              <h3 className="mt-4 text-lg font-semibold text-gray-800">
                No reviews yet
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                You haven't reviewed any products yet.
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate("/")
                }
                className="mt-6 cursor-pointer rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700"
              >
                Browse Products
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="rounded-xl bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-col gap-5 sm:flex-row">
                    {review.product && (
                      <img
                        src={
                          review.product.image
                        }
                        alt={
                          review.product.name
                        }
                        className="h-28 w-28 rounded-lg border object-contain"
                      />
                    )}

                    <div className="flex-1">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            {review.product
                              ?.name ||
                              "Product unavailable"}
                          </h3>

                          {review.product && (
                            <p className="mt-1 text-sm text-gray-500">
                              {review.product.price.toFixed(
                                2
                              )}{" "}
                              SAR
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          {Array.from(
                            { length: 5 },
                            (_, index) => (
                              <FaStar
                                key={index}
                                className={
                                  index <
                                  review.rating
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                                }
                              />
                            )
                          )}

                          <span className="ml-1 text-sm font-medium text-gray-700">
                            {review.rating}.0
                          </span>
                        </div>
                      </div>

                      <p className="mt-4 text-gray-600">
                        {review.comment}
                      </p>

                      <div className="mt-5 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-gray-400">
                          Reviewed on{" "}
                          {formatReviewDate(
                            review.createdAt
                          )}
                        </p>

                        {review.product && (
                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/products/${review.product._id}`
                              )
                            }
                            className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-800"
                          >
                            View Product →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default MyReviews;