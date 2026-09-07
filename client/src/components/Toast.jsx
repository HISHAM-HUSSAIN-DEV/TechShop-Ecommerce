import React, { useEffect } from "react";

const Toast = ({
  message,
  type = "success",
  onClose,
}) => {
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  const styles = {
    success: "bg-green-100 text-green-800 border-green-300",
    error: "bg-red-100 text-red-800 border-red-300",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-300",
    info: "bg-blue-100 text-blue-800 border-blue-300",
  };

  return (
    <div
      className={`fixed right-5 top-5 z-50 min-w-72 rounded-lg border px-5 py-4 shadow-lg ${styles[type]}`}
    >
      <div className="flex items-center justify-between gap-5">
        <span className="text-sm font-medium">
          {message}
        </span>

        <button
          onClick={onClose}
          className="font-bold"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Toast;