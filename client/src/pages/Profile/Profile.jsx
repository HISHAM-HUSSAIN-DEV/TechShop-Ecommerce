import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FaUserCircle } from "react-icons/fa";

import ProfileSidebar from "./ProfileSidebar";

import Orders from "./tabs/MyOrder.jsx";
import Account from "./tabs/Account.jsx";
import OrderDetails from "./tabs/OrderDetails.jsx";
import ReturnsCancel from "./tabs/ReturnsCancel.jsx";
import Wishlist from "./tabs/Wishlist.jsx";
import ChangePassword from "./tabs/ChangePassword.jsx";
import MyReviews from "./tabs/MyReviews.jsx";
import Payment from "./tabs/Payment.jsx";
import Settings from "./tabs/Settings.jsx";

const Profile = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="mb-6 text-3xl font-semibold text-gray-800">
                Profile
            </h1>

            <div className="flex items-start gap-8">
                {/* Sidebar */}
                <div className="w-72 shrink-0 rounded-xl bg-white shadow">
                    {/* User Info */}
                    <div className="flex items-center gap-4 border-b p-6">
                        <FaUserCircle className="text-6xl text-gray-500" />

                        <div>
                            <p className="text-sm text-gray-500">
                                Hello
                            </p>

                            <h2 className="text-lg font-semibold">
                                {user?.firstName} {user?.lastName}
                            </h2>
                        </div>
                    </div>

                    <ProfileSidebar />
                </div>

                {/* Content */}
                <div className="flex-1">
                    <Routes>
                        <Route
                            index
                            element={<Navigate to="account" replace />}
                        />

                        <Route
                            path="account"
                            element={<Account />}
                        />

                        <Route
                            path="orders"
                            element={<Orders />}
                        />

                        <Route
                            path="orders/:orderNumber"
                            element={<OrderDetails />}
                        />

                        <Route
                            path="returns"
                            element={<ReturnsCancel />}
                        />

                        <Route
                            path="reviews"
                            element={<MyReviews />}
                        />

                        <Route
                            path="wishlist"
                            element={<Wishlist />}
                        />
                        <Route
                            path="payment"
                            element={<Payment />}
                        />

                        <Route
                            path="change-password"
                            element={<ChangePassword />}
                        />
                        <Route
                            path="settings"
                            element={<Settings />}
                        />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default Profile;