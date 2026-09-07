import React, { useState } from "react";
import {Link} from "react-router-dom";
import { FaHeart } from "react-icons/fa";

import { useAuth } from "../../../context/AuthContext";
import { useCart } from "../../../context/CartContext";

import Toast from "../../../components/Toast.jsx";
import AddToCartButton from "../../../components/AddToCartButton.jsx";
const API_URL = import.meta.env.VITE_API_URL;

const Wishlist = () => {
  const {
    wishlist,
    setWishlist,
    token,
  } = useAuth();

  const {
    cartItems,
    addToCart,
  } = useCart();

  const [removingId, setRemovingId] = useState(null);

  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });

  const showToast = (message, type = "success") => {
    setToast({
      message,
      type,
    });
  };

  const handleRemove = async (productId) => {
    if (removingId === productId) return;

    try {
      setRemovingId(productId);

      const res = await fetch(
        `${API_URL}/users/wishlist/${productId}`,
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
          data.message || "Failed to remove product from wishlist",
          "error"
        );
        return;
      }

      setWishlist((prev) =>
        prev.filter(
          (product) => product._id !== productId
        )
      );

      showToast(
        "Product removed from wishlist",
        "success"
      );
    } catch (error) {
      console.error("REMOVE WISHLIST ERROR:", error);

      showToast(
        "Something went wrong.",
        "error"
      );
    } finally {
      setRemovingId(null);
    }
  };

  const handleAddToCart = (product) => {
    if (product.stock <= 0) {
      showToast(
        "This product is out of stock",
        "error"
      );
      return false;
    }

    const existingItem = cartItems.find(
      (item) => item._id === product._id
    );

    if (
      existingItem &&
      existingItem.quantity >= product.stock
    ) {
      showToast(
        "You reached the maximum available stock",
        "warning"
      );
      return false;
    }

    addToCart(product);

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

      <div>
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            My Wishlist
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Products you've saved for later.
          </p>
        </div>

        {/* Empty Wishlist */}
        {wishlist.length === 0 ? (
          <div className="rounded-xl bg-white p-10 text-center shadow-sm">
            <FaHeart className="mx-auto text-4xl text-gray-300" />

            <h3 className="mt-4 text-lg font-semibold text-gray-800">
              Your wishlist is empty
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Save products you like and they'll appear here.
            </p>
          </div>
        ) : (
          /* Products */
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {wishlist.map((product) => {
              const isOutOfStock = product.stock <= 0;

              return (
                <div
                  key={product._id}
                  className="relative rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md"
                >
                  {/* Remove */}
                  <button
                    type="button"
                    onClick={() =>
                      handleRemove(product._id)
                    }
                    disabled={
                      removingId === product._id
                    }
                    aria-label={`Remove ${product.name} from wishlist`}
                    className="absolute right-4 top-4 z-10 cursor-pointer rounded-full bg-white p-2 shadow transition hover:scale-110 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <FaHeart className="text-xl text-red-500" />
                  </button>

                  {/* Image */}
                  <Link to={`/products/${product._id}`}
                  >

                    <div className="flex h-48 items-center justify-center">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-contain"
                      />
                    </div>
                  </Link>
                  {/* Product Info */}
                  <div className="mt-4">
                    <h3 className="font-semibold text-gray-800">
                      {product.name}
                    </h3>

                    <p className="mt-2 text-lg font-bold text-gray-900">
                      {product.price.toFixed(2)} SAR
                    </p>


                    <AddToCartButton
                      onAdd={() =>
                        handleAddToCart(product)
                      }
                      disabled={isOutOfStock}
                      variant="black"
                      className="mt-4 w-full py-3"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div >
    </>
  );
};

export default Wishlist;