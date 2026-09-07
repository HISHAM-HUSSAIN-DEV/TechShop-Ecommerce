import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { Link } from "react-router-dom";
import { formatOrderDate } from "../../utils/orderUtils.js";
import Toast from "../../components/Toast.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";

const API_URL = import.meta.env.VITE_API_URL;

const OrdersManagement = () => {
  const { token } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrder, setUpdatingOrder] = useState(null);

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

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${API_URL}/orders/admin/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        showToast(
          data.message || "Failed to load orders",
          "error"
        );
        return;
      }

      setOrders(data);
    } catch (error) {
      console.error("FETCH ORDERS ERROR:", error);

      showToast(
        "Failed to load orders",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  const handleStatusChange = async (
    orderNumber,
    newStatus
  ) => {
    try {
      setUpdatingOrder(orderNumber);

      const res = await fetch(
        `${API_URL}/orders/admin/${orderNumber}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        showToast(
          data.message || "Failed to update order status",
          "error"
        );
        return;
      }

      setOrders((prev) =>
        prev.map((order) =>
          order.orderNumber === orderNumber
            ? {
                ...order,
                status: data.order.status,
              }
            : order
        )
      );

      showToast(
        `Order status updated to ${data.order.status}`,
        "success"
      );
    } catch (error) {
      console.error(
        "UPDATE ORDER STATUS ERROR:",
        error
      );

      showToast(
        "Failed to update order status",
        "error"
      );
    } finally {
      setUpdatingOrder(null);
    }
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

      {loading ? (
        <div className="rounded-xl bg-white shadow-sm">
          <LoadingSpinner text="Loading orders..." />
        </div>
      ) : (
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Orders Management
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Manage customer orders and update their status.
            </p>
          </div>

          <div className="overflow-hidden rounded-xl bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b bg-gray-50 text-sm text-gray-600">
                  <tr>
                    <th className="px-5 py-4">Order</th>
                    <th className="px-5 py-4">Customer</th>
                    <th className="px-5 py-4">Date</th>
                    <th className="px-5 py-4">Total</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-5 py-8 text-center text-gray-500"
                      >
                        No orders found.
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr
                        key={order._id}
                        className="border-b last:border-b-0"
                      >
                        <td className="px-5 py-4">
                          <span className="font-semibold text-gray-800">
                            #{order.orderNumber}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="font-medium text-gray-800">
                            {order.user
                              ? `${order.user.firstName} ${order.user.lastName}`
                              : "Unknown user"}
                          </div>

                          <div className="text-sm text-gray-500">
                            {order.user?.email || "-"}
                          </div>
                        </td>

                        <td className="px-5 py-4 text-gray-600">
                          {formatOrderDate(order.createdAt)}
                        </td>

                        <td className="px-5 py-4 font-semibold text-gray-800">
                          {Number(order.totalPrice || 0).toFixed(2)} SAR
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex flex-col items-start gap-2">
                            <StatusBadge status={order.status} />

                            <select
                              value={order.status}
                              disabled={
                                updatingOrder ===
                                order.orderNumber
                              }
                              onChange={(e) =>
                                handleStatusChange(
                                  order.orderNumber,
                                  e.target.value
                                )
                              }
                              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
                            >
                              <option value="Processing">
                                Processing
                              </option>

                              <option value="Shipped">
                                Shipped
                              </option>

                              <option value="Delivered">
                                Delivered
                              </option>

                              <option value="Cancelled">
                                Cancelled
                              </option>
                            </select>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <Link
                            to={`/admin/orders/${order.orderNumber}`}
                            className="rounded-lg bg-blue-100 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrdersManagement;