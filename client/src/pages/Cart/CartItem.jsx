import React from "react";
import { FaTrash } from "react-icons/fa";
import { useCart } from "../../context/CartContext";

const CartItem = ({ item }) => {
  const {
    addQuantity,
    subQuantity,
    removeFromCart,
  } = useCart();

  const reachedMaxStock =
    item.quantity >= item.stock;

  const reachedMinQuantity =
    item.quantity <= 1;

  const itemTotal =
    item.price * item.quantity;

  return (
    <div className="grid items-center gap-6 border-b py-6 md:grid-cols-3">
      {/* Product */}
      <div className="flex items-center gap-5">
        <img
          src={item.image}
          alt={item.name}
          className="h-28 w-28 rounded-lg border object-contain"
        />

        <div>
          <h2 className="text-xl font-semibold">
            {item.name}
          </h2>

          <p className="mt-1 text-gray-500">
            {item.price.toFixed(2)} SAR
          </p>

          <p className="mt-1 text-xs text-gray-400">
            {Number(item.stock).toLocaleString("en-US")} available
          </p>
        </div>
      </div>

      {/* Quantity */}
      <div className="flex items-center justify-center gap-4">
        <div className="flex items-center overflow-hidden rounded-lg border">
          <button
            type="button"
            onClick={() =>
              subQuantity(item._id)
            }
            disabled={reachedMinQuantity}
            className={`px-4 py-2 text-xl transition ${
              reachedMinQuantity
                ? "cursor-not-allowed text-gray-300"
                : "cursor-pointer hover:bg-gray-100"
            }`}
          >
            -
          </button>

          <span
            aria-label={`Quantity of ${item.name}`}
            className="w-14 text-center"
          >
            {Number(item.quantity).toLocaleString(
              "en-US"
            )}
          </span>

          <button
            type="button"
            onClick={() =>
              addQuantity(item._id)
            }
            disabled={reachedMaxStock}
            className={`px-4 py-2 text-xl transition ${
              reachedMaxStock
                ? "cursor-not-allowed text-gray-300"
                : "cursor-pointer hover:bg-gray-100"
            }`}
          >
            +
          </button>
        </div>

        <button
          type="button"
          onClick={() =>
            removeFromCart(item._id)
          }
          aria-label={`Remove ${item.name} from cart`}
          title="Remove from cart"
          className="cursor-pointer text-red-500 transition hover:text-red-700"
        >
          <FaTrash size={20} />
        </button>
      </div>

      {/* Total */}
      <div className="text-right">
        <h2 className="text-2xl font-bold">
          {itemTotal.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}{" "}
          SAR
        </h2>
      </div>
    </div>
  );
};

export default CartItem;