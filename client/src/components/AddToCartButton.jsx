import React, { useState } from "react";
import { FiCheck, FiShoppingCart } from "react-icons/fi";

const AddToCartButton = ({
  onAdd,
  disabled = false,
  className = "",
  variant = "primary",
}) => {
  const [added, setAdded] = useState(false);

  const handleClick = () => {
    if (disabled || added) return;

    const success = onAdd();

    if (success === false) return;

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 500);
  };

  const variantStyles = {
    primary: "bg-blue-600 hover:bg-blue-700",
    black: "bg-black hover:bg-gray-800",
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || added}
      className={`flex items-center justify-center gap-2 rounded-lg font-semibold text-white transition-all duration-200 ${
        disabled
          ? "cursor-not-allowed bg-gray-400"
          : added
          ? "bg-green-600 scale-95"
          : `cursor-pointer active:scale-95 ${variantStyles[variant]}`
      } ${className}`}
    >
      {disabled ? (
        "Out of Stock"
      ) : added ? (
        <>
          <FiCheck className="text-lg" />
          Added
        </>
      ) : (
        <>
          <FiShoppingCart className="text-lg" />
          Add to Cart
        </>
      )}
    </button>
  );
};

export default AddToCartButton;