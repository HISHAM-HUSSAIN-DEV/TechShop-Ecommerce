import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useCart } from "../../context/CartContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

import Toast from "../../components/Toast.jsx";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    address: user?.address || "",
    city: user?.city || "",
    postCode: user?.postCode || "",
  });

  const [loading, setLoading] = useState(false);

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

  const totalPrice = cartItems.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (cartItems.length === 0) {
      showToast(
        "Your cart is empty.",
        "warning"
      );
      return;
    }

    if (
      !formData.address.trim() ||
      !formData.city.trim() ||
      !formData.postCode.trim()
    ) {
      showToast(
        "Please complete your shipping information.",
        "warning"
      );
      return;
    }

    try {
      setLoading(true);

      const items = cartItems.map((item) => ({
        product: item._id,
        quantity: item.quantity,
      }));

      const res = await fetch(
        "http://localhost:5000/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            items,
            shippingAddress: {
              address: formData.address.trim(),
              city: formData.city.trim(),
              postCode: formData.postCode.trim(),
            },
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        showToast(
          data.message || "Unable to place order.",
          "error"
        );
        return;
      }

      clearCart();

      navigate("/profile/orders", {
        state: {
          orderSuccess: true,
        },
      });
    } catch (error) {
      console.error("PLACE ORDER ERROR:", error);

      showToast(
        "Something went wrong. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
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

        <div className="min-h-screen bg-gray-100 px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl rounded-xl bg-white px-6 py-16 text-center shadow-sm">
            <h1 className="text-3xl font-bold text-gray-800">
              Your cart is empty
            </h1>

            <p className="mt-3 text-gray-500">
              Add some products before proceeding to checkout.
            </p>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="mt-6 cursor-pointer rounded-lg bg-primary px-6 py-3 font-medium text-white transition hover:bg-blue-700"
            >
              Start Shopping
            </button>
          </div>
        </div>
      </>
    );
  }

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

      <div className="min-h-screen bg-gray-100 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="mb-8 text-3xl font-bold text-gray-800">
            Checkout
          </h1>

          <form
            onSubmit={handlePlaceOrder}
            className="grid gap-8 lg:grid-cols-3"
          >
            {/* Shipping Information */}
            <div className="rounded-xl bg-white p-6 shadow-sm lg:col-span-2">
              <h2 className="mb-6 text-xl font-semibold text-gray-800">
                Shipping Information
              </h2>

              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="address"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Address
                  </label>

                  <input
                    id="address"
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter your address"
                    disabled={loading}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="city"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      City
                    </label>

                    <input
                      id="city"
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Enter your city"
                      disabled={loading}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="postCode"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Post Code
                    </label>

                    <input
                      id="postCode"
                      type="text"
                      name="postCode"
                      value={formData.postCode}
                      onChange={handleChange}
                      placeholder="Enter your post code"
                      disabled={loading}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="h-fit rounded-xl bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-xl font-semibold text-gray-800">
                Order Summary
              </h2>

              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between gap-4"
                  >
                    <div>
                      <p className="font-medium text-gray-800">
                        {item.name}
                      </p>

                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>

                    <p className="font-medium text-gray-800">
                      {(item.price * item.quantity).toFixed(2)} SAR
                    </p>
                  </div>
                ))}
              </div>

              <div className="my-6 border-t" />

              <div className="flex justify-between">
                <span className="text-lg font-semibold">
                  Total
                </span>

                <span className="text-xl font-bold">
                  {totalPrice.toFixed(2)} SAR
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-6 flex min-h-12 w-full cursor-pointer items-center justify-center rounded-lg bg-black px-4 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <LoadingSpinner
                    text="Placing order..."
                    size="small"
                  />
                ) : (
                  "Place Order"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Checkout;