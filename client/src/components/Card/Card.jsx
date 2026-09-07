import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CiHeart } from "react-icons/ci";
import { FaHeart, FaStar } from "react-icons/fa";

import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

import Toast from "../../components/Toast.jsx";
import AddToCartButton from "../../components/AddToCartButton.jsx";

const API_URL = import.meta.env.VITE_API_URL;

const Card = ({ product }) => {
  const {
    token,
    isAuthenticated,
    wishlist,
    setWishlist,
  } = useAuth();

  const { addToCart } = useCart();

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

  const isFavorite = wishlist.some(
    (item) => item._id === product._id
  );

  const isOutOfStock = product.stock <= 0;

  const handleWishlist = async () => {
    if (!isAuthenticated) {
      showToast(
        "Please sign in to use your wishlist",
        "warning"
      );

      return;
    }

    try {
      const res = await fetch(
        `${API_URL}/users/wishlist/${product._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        showToast(
          data.message ||
            "Failed to update wishlist",
          "error"
        );

        return;
      }

      if (isFavorite) {
        setWishlist((prev) =>
          prev.filter(
            (item) =>
              item._id !== product._id
          )
        );

        showToast(
          "Product removed from wishlist",
          "success"
        );
      } else {
        setWishlist((prev) => [
          ...prev,
          product,
        ]);

        showToast(
          "Product added to wishlist",
          "success"
        );
      }
    } catch (error) {
      console.error(
        "WISHLIST ERROR:",
        error
      );

      showToast(
        "Something went wrong",
        "error"
      );
    }
  };

  const handleAddToCart = () => {
    if (isOutOfStock) {
      showToast(
        "This product is out of stock",
        "error"
      );

      return false;
    }

    const success = addToCart(product);

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

      <div className="flex h-full max-w-sm flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md transition duration-300 hover:shadow-xl">
        {/* Product Image */}
        <Link to={`/products/${product._id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="h-48 w-full object-contain"
          />
        </Link>

        {/* Card Content */}
        <div className="flex flex-1 flex-col p-5">
          {/* Name + Rating */}
          <div className="mt-5 flex items-start justify-between gap-3">
            <Link
              to={`/products/${product._id}`}
              className="min-w-0 flex-1"
            >
              <h2 className="line-clamp-2 text-lg font-semibold hover:text-blue-600">
                {product.name}
              </h2>
            </Link>

            <Link
              to={`/products/${product._id}`}
              className="flex shrink-0 items-center gap-2"
            >
              <FaStar
                className={
                  product.totalReviews > 0
                    ? "text-yellow-400"
                    : "text-gray-300"
                }
              />

              {product.totalReviews > 0 ? (
                <>
                  <span className="font-semibold text-gray-800">
                    {product.averageRating}
                  </span>

                  <span className="text-sm text-gray-500">
                    ({product.totalReviews})
                  </span>
                </>
              ) : (
                <span className="text-sm text-gray-500">
                  No reviews yet
                </span>
              )}
            </Link>
          </div>

          {/* Description */}
          <p className="mt-2 line-clamp-2 text-sm text-gray-500">
            {product.description}
          </p>

          {/* Price + Actions */}
          <div className="mt-auto pt-5">
            {/* Price */}
            <span className="block text-xl font-bold text-primary">
              {product.price} SAR
            </span>

            {/* Wishlist + Add to Cart */}
            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={handleWishlist}
                aria-label={
                  isFavorite
                    ? "Remove from wishlist"
                    : "Add to wishlist"
                }
                className="shrink-0 cursor-pointer rounded-full bg-white p-2 shadow transition hover:scale-110"
              >
                {isFavorite ? (
                  <FaHeart className="text-xl text-red-500" />
                ) : (
                  <CiHeart className="text-2xl text-gray-600" />
                )}
              </button>

              <AddToCartButton
                onAdd={handleAddToCart}
                disabled={isOutOfStock}
                variant="primary"
                className="min-w-0 flex-1 px-4 py-2.5 text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Card;