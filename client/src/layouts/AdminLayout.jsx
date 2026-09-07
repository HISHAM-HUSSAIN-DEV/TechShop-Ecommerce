import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../pages/Admin/components/AdminSideBar.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const AdminLayout = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="border-b bg-white px-8 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">
            E-Commerce Admin
          </h1>

          <div className="text-sm text-gray-600">
            Welcome,{" "}
            <span className="font-semibold">
              {user?.firstName}
            </span>
          </div>
        </div>
      </header>

      <div className="flex items-start gap-6 p-6">
        <AdminSidebar />

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;