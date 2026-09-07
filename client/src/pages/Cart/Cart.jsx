import React from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import { FiArrowLeft } from "react-icons/fi";

import { useCart } from "../../context/CartContext.jsx";
import CartItem from "./CartItem.jsx";

const Cart = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { cartItems } = useCart();

  const backTo = location.state?.from || "/";

  const subTotal = cartItems.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      {/* Header */}
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-4xl font-bold text-gray-900">
          Your Cart
        </h1>

        <button
          type="button"
          onClick={() => navigate(backTo)}
          className="flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-blue-600 px-4 py-2.5 font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white active:scale-95"
        >
          <FiArrowLeft className="text-lg" />
          Continue Shopping
        </button>
      </div>

      {cartItems.length === 0 ? (
        /* Empty Cart */
        <div className="rounded-xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-800">
            Your cart is empty
          </h2>

          <p className="mt-2 text-gray-500">
            Add some products to your cart to continue shopping.
          </p>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-6 cursor-pointer rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 active:scale-95"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <>
          {/* Table Header */}
          <div className="hidden grid-cols-3 border-b pb-3 font-semibold text-gray-500 md:grid">
            <h2>PRODUCT</h2>

            <h2 className="text-center">
              QUANTITY
            </h2>

            <h2 className="text-right">
              TOTAL
            </h2>
          </div>

          {/* Cart Items */}
          {cartItems.map((item) => (
            <CartItem
              key={item._id}
              item={item}
            />
          ))}

          {/* Summary */}
          <div className="mt-10 flex justify-end">
            <div className="w-full rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:w-96">
              <div className="mb-6 flex justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Subtotal
                </h2>

                <span className="text-2xl font-bold text-gray-900">
                  {subTotal.toFixed(2)} SAR
                </span>
              </div>

              {/* Checkout */}
              <button
                type="button"
                onClick={() =>
                  navigate("/checkout")
                }
                className="w-full cursor-pointer rounded-lg bg-black py-3 font-medium text-white transition hover:bg-gray-800 active:scale-95"
              >
                Checkout
              </button>

              {/* Google Pay - Demo */}
              <button
                type="button"
                disabled
                className="mt-3 w-full cursor-not-allowed rounded-lg border border-gray-300 bg-white py-3 font-medium text-gray-700 opacity-60"
              >
                Google Pay
                <span className="ml-2 text-xs text-gray-500">
                  (Demo)
                </span>
              </button>

              {/* PayPal - Demo */}
              <button
                type="button"
                disabled
                className="mt-3 w-full cursor-not-allowed rounded-lg bg-yellow-400 py-3 font-semibold text-gray-900 opacity-60"
              >
                PayPal
                <span className="ml-2 text-xs">
                  (Demo)
                </span>
              </button>

              <p className="mt-3 text-center text-xs text-gray-400">
                Demo payment options are not connected to a payment gateway.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;