import React from "react";
import { NavLink } from "react-router-dom";

import {
  MdDashboard,
  MdInventory,
  MdShoppingCart,
  MdAssignmentReturn,
  MdPeople,
  MdLogout,
} from "react-icons/md";

import { useAuth } from "../../../context/AuthContext.jsx";

const AdminSidebar = () => {
  const { logout } = useAuth();

  const linkStyle = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-4 py-3 transition ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <aside className="w-64 shrink-0 rounded-xl bg-white p-4 shadow">
      <h2 className="mb-6 px-4 text-2xl font-bold text-gray-800">
        Admin
      </h2>

      <nav className="space-y-2">
        {/* Dashboard */}
        <NavLink
          to="/admin"
          end
          className={linkStyle}
        >
          <MdDashboard className="text-xl" />
          <span>Dashboard</span>
        </NavLink>

        {/* Products */}
        <NavLink
          to="/admin/products"
          className={linkStyle}
        >
          <MdInventory className="text-xl" />
          <span>Products</span>
        </NavLink>

        {/* Orders */}
        <NavLink
          to="/admin/orders"
          className={linkStyle}
        >
          <MdShoppingCart className="text-xl" />
          <span>Orders</span>
        </NavLink>

        {/* Returns */}
        <NavLink
          to="/admin/returns"
          className={linkStyle}
        >
          <MdAssignmentReturn className="text-xl" />
          <span>Returns</span>
        </NavLink>

        {/* Users */}
        <NavLink
          to="/admin/users"
          className={linkStyle}
        >
          <MdPeople className="text-xl" />
          <span>Users</span>
        </NavLink>
      </nav>

      {/* Logout */}
      <button
        type="button"
        onClick={logout}
        className="mt-8 flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-3 text-red-600 transition hover:bg-red-50"
      >
        <MdLogout className="text-xl" />
        <span>Logout</span>
      </button>
    </aside>
  );
};

export default AdminSidebar;