import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext.jsx";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";

const AdminDashboard = () => {
  const { token } = useAuth();

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    processingOrders: 0,
    returnRequests: 0,
    totalUsers: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          "http://localhost:5000/orders/admin/stats/dashboard",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          console.error(data.message);
          return;
        }

        setStats(data);
      } catch (error) {
        console.error(
          "FETCH DASHBOARD STATS ERROR:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchStats();
    }
  }, [token]);

  const cards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      link: "/admin/products",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      link: "/admin/orders",
    },
    {
      title: "Processing Orders",
      value: stats.processingOrders,
      link: "/admin/orders",
    },
    {
      title: "Return Requests",
      value: stats.returnRequests,
      link: "/admin/returns",
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      link: "/admin/users",
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Dashboard
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Overview of your store activity.
        </p>
      </div>

      {loading ? (
        <div className="rounded-xl bg-white shadow-sm">
          <LoadingSpinner text="Loading dashboard..." />
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <Link
              to={card.link}
              key={card.title}
              className="block"
            >
              <div className="h-full rounded-xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <p className="text-sm text-gray-500">
                  {card.title}
                </p>

                <h3 className="mt-2 text-3xl font-bold text-gray-800">
                  {card.value}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;