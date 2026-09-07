import React, { useEffect, useState } from "react";
import {
    useNavigate,
    useParams,
} from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

import { useAuth } from "../../../context/AuthContext";
import { formatOrderDate } from "../../../utils/orderUtils";

import ReturnRequestForm from "./ReturnRequestForm";

import Toast from "../../../components/Toast.jsx";
import StatusBadge from "../../../components/StatusBadge.jsx";
import LoadingSpinner from "../../../components/LoadingSpinner.jsx";
import ConfirmModal from "../../../components/ConfirmModal.jsx";

const OrderDetails = () => {
    const { orderNumber } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showReturnForm, setShowReturnForm] =
        useState(false);

    const [showCancelModal, setShowCancelModal] =
        useState(false);

    const [cancelling, setCancelling] =
        useState(false);

    const [returnLoading, setReturnLoading] =
        useState(false);

    const [toast, setToast] = useState({
        message: "",
        type: "success",
    });

    const showToast = (
        message,
        type = "success"
    ) => {
        setToast({
            message,
            type,
        });
    };

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await fetch(
                    `http://localhost:5000/orders/${orderNumber}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await res.json();

                if (!res.ok) {
                    setError(
                        data.message || "Unable to load order."
                    );

                    return;
                }

                setOrder(data.order);
            } catch (error) {
                console.error(
                    "GET ORDER DETAILS ERROR:",
                    error
                );

                setError(
                    "Something went wrong while loading the order."
                );
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchOrder();
        } else {
            setLoading(false);
        }
    }, [orderNumber, token]);

    const handleCancelOrder = async () => {
        if (!order || cancelling) return;

        try {
            setCancelling(true);

            const res = await fetch(
                `http://localhost:5000/orders/${order.orderNumber}/cancel`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json();

            if (!res.ok) {
                showToast(
                    data.message || "Unable to cancel order.",
                    "error"
                );

                return;
            }

            setOrder(data.order);
            setShowCancelModal(false);

            showToast(
                "Order cancelled successfully!",
                "success"
            );
        } catch (error) {
            console.error(
                "CANCEL ORDER ERROR:",
                error
            );

            showToast(
                "Something went wrong. Please try again.",
                "error"
            );
        } finally {
            setCancelling(false);
        }
    };

    const handleReturnRequest = async (reason) => {
        if (!order || returnLoading) return;

        try {
            setReturnLoading(true);

            const res = await fetch(
                `http://localhost:5000/orders/${order.orderNumber}/return`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        reason,
                    }),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                showToast(
                    data.message ||
                    "Unable to submit return request.",
                    "error"
                );

                return;
            }

            setOrder(data.order);
            setShowReturnForm(false);

            showToast(
                "Return request submitted successfully!",
                "success"
            );
        } catch (error) {
            console.error(
                "RETURN REQUEST ERROR:",
                error
            );

            showToast(
                "Something went wrong. Please try again.",
                "error"
            );
        } finally {
            setReturnLoading(false);
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

            <ConfirmModal
                isOpen={showCancelModal}
                title="Cancel Order"
                message="Are you sure you want to cancel this order?"
                confirmText="Cancel Order"
                cancelText="Keep Order"
                loadingText="Cancelling..."
                onConfirm={handleCancelOrder}
                onCancel={() => setShowCancelModal(false)}
                loading={cancelling}
            />

            {loading ? (
                <LoadingSpinner text="Loading order..." />
            ) : error || !order ? (
                <div className="rounded-xl bg-white p-8 shadow-sm">
                    <p className="text-red-500">
                        {error || "Order not found"}
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/profile/orders")
                        }
                        className="mt-5 flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-blue-600 px-4 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white active:scale-95"
                    >
                        <FiArrowLeft className="text-lg" />
                        Back to My Orders
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Back */}
                    <button
                        type="button"
                        onClick={() =>
                            navigate("/profile/orders")
                        }
                        className="flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-blue-600 px-4 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white active:scale-95"
                    >
                        <FiArrowLeft className="text-lg" />
                        Back to My Orders
                    </button>

                    {/* Order Header */}
                    <div className="rounded-xl bg-white p-6 shadow-sm">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-500">
                                    Order Number
                                </p>

                                <h2 className="text-xl font-semibold text-gray-800">
                                    #{order.orderNumber}
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Placed on{" "}
                                    {formatOrderDate(
                                        order.createdAt
                                    )}
                                </p>
                            </div>

                            <div className="flex flex-col items-start gap-3 sm:items-end">
                                {/* Statuses */}
                                <div className="flex flex-wrap items-center gap-2">
                                    <StatusBadge
                                        status={order.status}
                                    />

                                    {order.returnStatus !==
                                        "None" && (
                                            <StatusBadge
                                                status={
                                                    order.returnStatus
                                                }
                                            />
                                        )}
                                </div>

                                {/* Actions */}
                                <div className="flex flex-wrap gap-2">
                                    {order.status ===
                                        "Processing" && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowCancelModal(true)

                                                }

                                                disabled={cancelling}
                                                className="cursor-pointer rounded-lg border border-red-600 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                Cancel Order
                                            </button>
                                        )}

                                    {order.status ===
                                        "Delivered" &&
                                        order.returnStatus ===
                                        "None" && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowReturnForm(true)
                                                }
                                                disabled={returnLoading}
                                                className="cursor-pointer rounded-lg border border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                Request Return
                                            </button>
                                        )}
                                </div>
                            </div>
                        </div>

                        {/* Return Form */}
                        {showReturnForm && (
                            <div className="mt-6 border-t pt-6">
                                <ReturnRequestForm
                                    onCancel={() =>
                                        setShowReturnForm(false)
                                    }
                                    onSubmit={
                                        handleReturnRequest
                                    }
                                    loading={returnLoading}
                                />
                            </div>
                        )}
                    </div>

                    {/* Products */}
                    <div className="rounded-xl bg-white p-6 shadow-sm">
                        <h3 className="mb-5 text-xl font-semibold text-gray-800">
                            Items
                        </h3>

                        <div className="divide-y">
                            {order.items.map((item) => (
                                <div
                                    key={
                                        item._id ||
                                        item.product
                                    }
                                    className="flex gap-4 py-5 first:pt-0 last:pb-0"
                                >
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="h-24 w-24 rounded-lg object-contain"
                                    />

                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-800">
                                            {item.name}
                                        </h4>

                                        <p className="mt-2 text-sm text-gray-500">
                                            Quantity:{" "}
                                            {item.quantity}
                                        </p>

                                        <p className="mt-1 font-medium text-gray-700">
                                            {item.price.toFixed(2)}{" "}
                                            SAR each
                                        </p>
                                    </div>

                                    <p className="font-semibold text-gray-800">
                                        {(
                                            item.price *
                                            item.quantity
                                        ).toFixed(2)}{" "}
                                        SAR
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Shipping */}
                    <div className="rounded-xl bg-white p-6 shadow-sm">
                        <h3 className="mb-4 text-xl font-semibold text-gray-800">
                            Shipping Address
                        </h3>

                        <div className="space-y-2 text-gray-600">
                            <p>
                                {
                                    order.shippingAddress
                                        .address
                                }
                            </p>

                            <p>
                                {
                                    order.shippingAddress
                                        .city
                                }
                            </p>

                            <p>
                                {
                                    order.shippingAddress
                                        .postCode
                                }
                            </p>
                        </div>
                    </div>

                    {/* Total */}
                    <div className="rounded-xl bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-lg font-semibold text-gray-700">
                                Order Total
                            </span>

                            <span className="text-2xl font-bold text-gray-900">
                                {order.totalPrice.toFixed(
                                    2
                                )}{" "}
                                SAR
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default OrderDetails;