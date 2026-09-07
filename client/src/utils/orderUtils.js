export const getStatusStyle = (status) => {
  switch (status) {
    case "Processing":
      return "bg-yellow-100 text-yellow-700";

    case "Shipped":
      return "bg-blue-100 text-blue-700";

    case "Delivered":
      return "bg-green-100 text-green-700";

    case "Cancelled":
      return "bg-red-100 text-red-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
};

export const formatOrderDate = (date) => {
  if (!date) return "-";

  const d = new Date(date);

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

return `${year}/${month}/${day}`;
};