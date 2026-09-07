import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../../context/AuthContext";
import { formatOrderDate } from "../../../utils/orderUtils";

import Toast from "../../../components/Toast.jsx";
import StatusBadge from "../../../components/StatusBadge.jsx";
import LoadingSpinner from "../../../components/LoadingSpinner.jsx";
const API_URL = import.meta.env.VITE_API_URL;

const ReturnsCancel = () => {
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
          `${API_URL}/orders/my-orders`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          showToast(
            data.message ||
              "Failed to load returns and cancellations.",
            "error"
          );
          return;
        }

        const filteredOrders = data.orders.filter(
          (order) =>
            order.status === "Cancelled" ||
            order.returnStatus !== "None"
        );

        setOrders(filteredOrders);
      } catch (error) {
        console.error(
          "FETCH RETURNS AND CANCELLATIONS ERROR:",
          error
        );

        showToast(
          "Something went wrong while loading your orders.",
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
        <LoadingSpinner text="Loading returns and cancellations..." />
      ) : (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              Returns & Cancel
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              View your cancelled orders and return requests.
            </p>
          </div>

          {orders.length === 0 ? (
            <div className="rounded-xl bg-white p-10 text-center shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800">
                No returns or cancellations
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                You don't have any cancelled orders or return requests.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="rounded-xl bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-500">
                        Order
                      </p>

                      <h3 className="font-semibold text-gray-800">
                        #{order.orderNumber}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        {formatOrderDate(order.createdAt)}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <StatusBadge status={order.status} />

                      {order.returnStatus !== "None" && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">
                            Return:
                          </span>

                          <StatusBadge
                            status={order.returnStatus}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {order.returnReason && (
                    <div className="mt-5 rounded-lg bg-gray-50 p-4">
                      <p className="text-sm font-medium text-gray-700">
                        Return Reason
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        {order.returnReason}
                      </p>
                    </div>
                  )}

                  <div className="mt-5 flex items-center justify-between border-t pt-4">
                    <div>
                      <p className="text-sm text-gray-500">
                        Total
                      </p>

                      <p className="font-semibold text-gray-800">
                        {order.totalPrice.toFixed(2)} SAR
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/profile/orders/${order.orderNumber}`
                        )
                      }
                      className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium transition hover:bg-gray-100"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ReturnsCancel;