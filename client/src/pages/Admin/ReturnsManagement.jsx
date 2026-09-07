import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import Toast from "../../components/Toast.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";

const getNextReturnStatuses = (currentStatus) => {
  const transitions = {
    Requested: ["Approved", "Rejected"],
    Approved: ["Returned"],
    Returned: ["Refunded"],
    Rejected: [],
    Refunded: [],
  };

  return transitions[currentStatus] || [];
};

const ReturnsManagement = () => {
  const { token } = useAuth();

  const [returns, setReturns] = useState([]);
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

  const fetchReturns = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:5000/orders/admin/returns",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        showToast(
          data.message || "Failed to load return requests",
          "error"
        );
        return;
      }

      setReturns(data);
    } catch (error) {
      console.error("FETCH RETURNS ERROR:", error);

      showToast(
        "Failed to load return requests",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchReturns();
    }
  }, [token]);

  const handleReturnStatusChange = async (
    orderNumber,
    newStatus
  ) => {
    try {
      setUpdatingOrder(orderNumber);

      const res = await fetch(
        `http://localhost:5000/orders/admin/${orderNumber}/return-status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            returnStatus: newStatus,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        showToast(
          data.message || "Failed to update return status",
          "error"
        );
        return;
      }

      setReturns((prev) =>
        prev.map((order) =>
          order.orderNumber === orderNumber
            ? {
              ...order,
              returnStatus: data.order.returnStatus,
            }
            : order
        )
      );

      showToast(
        `Return status updated to ${data.order.returnStatus}`,
        "success"
      );
    } catch (error) {
      console.error(
        "UPDATE RETURN STATUS ERROR:",
        error
      );

      showToast(
        "Failed to update return status",
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
          <LoadingSpinner text="Loading return requests..." />
        </div>
      ) : (
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Returns Management
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Review and manage customer return requests.
            </p>
          </div>

          <div className="overflow-hidden rounded-xl bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b bg-gray-50 text-sm text-gray-600">
                  <tr>
                    <th className="px-5 py-4">
                      Order
                    </th>

                    <th className="px-5 py-4">
                      Customer
                    </th>

                    <th className="px-5 py-4">
                      Reason
                    </th>

                    <th className="px-5 py-4">
                      Return Status
                    </th>

                    <th className="px-5 py-4">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {returns.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-5 py-8 text-center text-gray-500"
                      >
                        No return requests found.
                      </td>
                    </tr>
                  ) : (
                    returns.map((order) => {
                      const nextStatuses =
                        getNextReturnStatuses(
                          order.returnStatus
                        );

                      const isUpdating =
                        updatingOrder ===
                        order.orderNumber;

                      return (
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

                          <td className="max-w-xs px-5 py-4 text-sm text-gray-600">
                            {order.returnReason || "-"}
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex flex-col items-start gap-2">
                              <StatusBadge
                                status={
                                  order.returnStatus ||
                                  "None"
                                }
                              />

                              <select
                                value={order.returnStatus}
                                disabled={
                                  isUpdating ||
                                  nextStatuses.length === 0
                                }
                                onChange={(e) =>
                                  handleReturnStatusChange(
                                    order.orderNumber,
                                    e.target.value
                                  )
                                }
                                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
                              >
                                <option
                                  value={order.returnStatus}
                                >
                                  {isUpdating
                                    ? "Updating..."
                                    : order.returnStatus}
                                </option>

                                {!isUpdating &&
                                  nextStatuses.map(
                                    (status) => (
                                      <option
                                        key={status}
                                        value={status}
                                      >
                                        {status}
                                      </option>
                                    )
                                  )}
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
                      );
                    })
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

export default ReturnsManagement;