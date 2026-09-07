import React from "react";
import { Routes, Route } from "react-router-dom";

import Cart from "../pages/Cart/Cart.jsx";
import Home from "../pages/Home/Home.jsx";
import SignIn from "../pages/Auth/SignIn.jsx";
import SignUp from "../pages/Auth/SignUp.jsx";
import Profile from "../pages/Profile/Profile.jsx";
import Checkout from "../pages/Checkout/Checkout.jsx";
import ProductDetails from "../pages/Products/ProductDetails.jsx";

import MainLayout from "../layouts/MainLayout.jsx";
import AdminLayout from "../layouts/AdminLayout.jsx";

import ProtectedRoute from "../components/ProtectedRoute.jsx";
import AdminRoute from "../components/AdminRoute.jsx";

import AdminDashboard from "../pages/Admin/AdminDashboard.jsx";
import ProductsManagement from "../pages/Admin/ProductsMangement.jsx";
import OrdersManagement from "../pages/Admin/OrdersMangement.jsx";
import OrderDetails from "../pages/Admin/OrderDetails.jsx";
import ReturnsManagement from "../pages/Admin/ReturnsManagement.jsx";
import UsersManagement from "../pages/Admin/UsersManagement.jsx";

function Router() {
  return (
    <Routes>
      {/* ========================= */}
      {/* User */}
      {/* ========================= */}

      <Route element={<MainLayout />}>
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/cart"
          element={<Cart />}
        />

        <Route
          path="/products/:id"
          element={<ProductDetails />}
        />

        <Route
          path="/profile/*"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* ========================= */}
      {/* Auth */}
      {/* ========================= */}

      <Route
        path="/signin"
        element={<SignIn />}
      />

      <Route
        path="/signup"
        element={<SignUp />}
      />

      {/* ========================= */}
      {/* Checkout */}
      {/* ========================= */}

      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        }
      />

      {/* ========================= */}
      {/* Admin */}
      {/* ========================= */}

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route
          index
          element={<AdminDashboard />}
        />

        <Route
          path="products"
          element={<ProductsManagement />}
        />

        <Route
          path="orders"
          element={<OrdersManagement />}
        />

        <Route
          path="orders/:orderNumber"
          element={<OrderDetails />}
        />

        <Route
          path="returns"
          element={<ReturnsManagement />}
        />

        <Route
          path="users"
          element={<UsersManagement />}
        />
      </Route>
    </Routes>
  );
}

export default Router;