import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { formatOrderDate } from "../../utils/orderUtils.js";
import StatusBadge from "../../components/StatusBadge.jsx";
import Toast from "../../components/Toast.jsx";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import { FiArrowLeft } from "react-icons/fi";

const API_URL = import.meta.env.VITE_API_URL;

const OrderDetails = () => {
  const { orderNumber } = useParams();
  const { token } = useAuth();

  const [order, setOrder] = useState(null);
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
    const fetchOrder = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${API_URL}/orders/admin/${orderNumber}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          showToast(
            data.message || "Failed to load order",
            "error"
          );
          return;
        }

        setOrder(data);
      } catch (error) {
        console.error("FETCH ORDER ERROR:", error);

        showToast(
          "Failed to load order",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchOrder();
    }
  }, [orderNumber, token]);

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
          <LoadingSpinner text="Loading order..." />
        </div>
      ) : !order ? (
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-gray-500">
            Order not found.
          </p>

          <Link
            to="/admin/orders"
            className="flex items-center gap-2 rounded-lg border border-blue-600 px-4 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white active:scale-95"
          >
            <FiArrowLeft className="text-lg" />
            Back to Orders
          </Link>
        </div>
      ) : (
        <div>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Order #{order.orderNumber}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Order details and customer information
              </p>
            </div>

            <Link
              to="/admin/orders"
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              Back
            </Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">

              {/* Products */}
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <h3 className="mb-5 text-lg font-semibold text-gray-800">
                  Products
                </h3>

                <div className="space-y-4">
                  {order.items?.map((item, index) => (
                    <div
                      key={item._id || index}
                      className="flex items-center justify-between border-b pb-4 last:border-b-0 last:pb-0"
                    >
                      <div className="flex items-center gap-4">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-16 w-16 rounded-lg object-contain"
                          />
                        )}

                        <div>
                          <p className="font-semibold text-gray-800">
                            {item.name}
                          </p>

                          <p className="text-sm text-gray-500">
                            Quantity: {item.quantity}
                          </p>

                          {item.product && (
                            <p className="text-xs text-gray-400">
                              Product ID: {item.product}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold text-gray-800">
                          {Number(item.price || 0).toFixed(2)} SAR
                        </p>

                        <p className="text-sm text-gray-500">
                          {(
                            Number(item.price || 0) *
                            Number(item.quantity || 0)
                          ).toFixed(2)}{" "}
                          SAR
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping */}
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold text-gray-800">
                  Shipping Address
                </h3>

                <div className="space-y-2 text-sm text-gray-600">
                  <p>
                    {order.shippingAddress?.address || "-"}
                  </p>

                  {order.shippingAddress?.address2 && (
                    <p>
                      {order.shippingAddress.address2}
                    </p>
                  )}

                  <p>
                    {order.shippingAddress?.city || "-"}
                    {order.shippingAddress?.state
                      ? `, ${order.shippingAddress.state}`
                      : ""}
                  </p>

                  <p>
                    {order.shippingAddress?.postCode || "-"}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">

              {/* Summary */}
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold text-gray-800">
                  Order Summary
                </h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      Status
                    </span>

                    <StatusBadge status={order.status} />
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      Date
                    </span>

                    <span>
                      {formatOrderDate(order.createdAt)}
                    </span>
                  </div>

                  <div className="flex justify-between border-t pt-3">
                    <span className="font-semibold text-gray-800">
                      Total
                    </span>

                    <span className="font-bold text-gray-800">
                      {Number(order.totalPrice || 0).toFixed(2)} SAR
                    </span>
                  </div>
                </div>
              </div>

              {/* Return */}
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold text-gray-800">
                  Return
                </h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      Status
                    </span>

                    <StatusBadge
                      status={order.returnStatus || "None"}
                    />
                  </div>

                  {order.returnReason && (
                    <div>
                      <p className="mb-1 text-gray-500">
                        Reason
                      </p>

                      <p className="text-gray-800">
                        {order.returnReason}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderDetails;