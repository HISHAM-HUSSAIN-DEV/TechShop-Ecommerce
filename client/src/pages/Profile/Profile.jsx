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
    <div className="min-h-screen bg-gray-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <h1 className="mb-6 text-3xl font-semibold text-gray-800">
          Profile
        </h1>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
          {/* Sidebar */}
          <div className="w-full shrink-0 rounded-xl bg-white shadow lg:w-72">
            {/* User Info */}
            <div className="flex items-center gap-4 border-b p-5 sm:p-6">
              <FaUserCircle className="shrink-0 text-5xl text-gray-500 sm:text-6xl" />

              <div className="min-w-0">
                <p className="text-sm text-gray-500">
                  Hello
                </p>

                <h2 className="truncate text-lg font-semibold text-gray-900">
                  {user?.firstName} {user?.lastName}
                </h2>
              </div>
            </div>

            <ProfileSidebar />
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <Routes>
              <Route
                index
                element={
                  <Navigate
                    to="account"
                    replace
                  />
                }
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
    </div>
  );
};

export default Profile;