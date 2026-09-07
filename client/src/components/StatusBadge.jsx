import React from "react";

const StatusBadge = ({ status }) => {
  const styles = {
    // Order Status
    Processing: "bg-yellow-100 text-yellow-700",
    Shipped: "bg-blue-100 text-blue-700",
    Delivered: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",

    // Return Status
    Requested: "bg-yellow-100 text-yellow-700",
    Approved: "bg-blue-100 text-blue-700",
    Rejected: "bg-red-100 text-red-700",
    Returned: "bg-purple-100 text-purple-700",
    Refunded: "bg-green-100 text-green-700",

    None: "bg-gray-100 text-gray-600",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        styles[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;