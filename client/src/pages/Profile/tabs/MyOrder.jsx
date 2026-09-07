import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../../context/AuthContext";
import { formatOrderDate } from "../../../utils/orderUtils";

import Toast from "../../../components/Toast.jsx";
import StatusBadge from "../../../components/StatusBadge.jsx";
import LoadingSpinner from "../../../components/LoadingSpinner.jsx";

const MyOrders = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/orders/my-orders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          console.error(data.message);

          showToast(
            data.message || "Failed to load orders",
            "error"
          );

          return;
        }

        setOrders(data.orders);
      } catch (error) {
        console.error("GET MY ORDERS ERROR:", error);

        showToast(
          "Something went wrong while loading your orders",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [token]);

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
        <LoadingSpinner text="Loading orders..." />
      ) : orders.length === 0 ? (
        <div className="rounded-xl bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800">
            No Orders Yet
          </h2>

          <p className="mt-2 text-gray-500">
            You haven't placed any orders yet.
          </p>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-5 cursor-pointer rounded-lg bg-primary px-5 py-2.5 font-medium text-white transition hover:bg-blue-700"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              My Orders
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              View your order history
            </p>
          </div>

          {orders.map((order) => (
            <div
              key={order._id}
              className="rounded-xl bg-white p-6 shadow-sm"
            >
              {/* Header */}
              <div className="flex flex-col gap-4 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    Order
                  </p>

                  <h3 className="font-semibold text-gray-800">
                    #{order.orderNumber}
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={order.status} />

                  {order.returnStatus !== "None" && (
                    <StatusBadge
                      status={order.returnStatus}
                    />
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/profile/orders/${order.orderNumber}`
                      )
                    }
                    className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium transition hover:bg-gray-100"
                  >
                    View Order
                  </button>
                </div>
              </div>

              {/* Products */}
              <div className="divide-y">
                {order.items.map((item) => (
                  <div
                    key={item.product}
                    className="flex gap-4 py-4"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-20 w-20 rounded-lg object-contain"
                    />

                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">
                        {item.name}
                      </h4>

                      <p className="mt-1 text-sm text-gray-500">
                        Quantity: {item.quantity}
                      </p>

                      <p className="mt-1 font-medium text-gray-800">
                        {item.price.toFixed(2)} SAR
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="mt-4 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    Total
                  </p>

                  <p className="text-lg font-bold text-gray-800">
                    {order.totalPrice.toFixed(2)} SAR
                  </p>
                </div>

                <p className="text-sm text-gray-500">
                  {formatOrderDate(order.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default MyOrders;