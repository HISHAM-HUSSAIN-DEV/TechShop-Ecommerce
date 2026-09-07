import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useAuth } from "../../context/AuthContext.jsx";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import Toast from "../../components/Toast.jsx";

const UsersManagement = () => {
  const { token } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

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

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/users/admin/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        showToast(
          data.message ||
          "Failed to load users",
          "error"
        );

        return;
      }

      setUsers(data.users || []);
    } catch (error) {
      console.error(
        "Fetch users error:",
        error
      );

      showToast(
        "Something went wrong while loading users",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token]);

  const filteredUsers = useMemo(() => {
    const value = search
      .trim()
      .toLowerCase();

    if (!value) {
      return users;
    }

    return users.filter((user) => {
      const fullName =
        `${user.firstName || ""} ${user.lastName || ""
          }`.toLowerCase();

      const email =
        user.email?.toLowerCase() || "";

      const phone =
        user.phone?.toLowerCase() || "";

      return (
        fullName.includes(value) ||
        email.includes(value) ||
        phone.includes(value)
      );
    });
  }, [users, search]);

  if (loading) {
    return (
      <LoadingSpinner text="Loading users..." />
    );
  }

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

      <div className="space-y-6">
        {/* Header */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Users Management
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              View and manage registered users.
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white px-5 py-3 shadow-sm">
            <p className="text-sm text-gray-500">
              Total Users
            </p>

            <p className="text-2xl font-bold text-gray-900">
              {users.length}
            </p>
          </div>
        </div>

        {/* Search */}

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search by name, email or phone..."
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Users Table */}

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          {filteredUsers.length === 0 ? (
            <div className="p-10 text-center">
              <p className="font-medium text-gray-700">
                No users found
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Try another search.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                      Name
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                      Email
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                      Phone
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                      Role
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                      Joined
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.map(
                    (user) => (
                      <tr
                        key={user._id}
                        className="transition hover:bg-gray-50"
                      >
                        <td className="whitespace-nowrap px-6 py-4">
                          <p className="font-semibold text-gray-900">
                            {user.firstName}{" "}
                            {user.lastName}
                          </p>
                        </td>

                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                          {user.email}
                        </td>

                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                          {user.phone || "—"}
                        </td>

                        <td className="whitespace-nowrap px-6 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${user.role === "admin"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-700"
                              }`}
                          >
                            {user.role === "admin" ? "Admin" : "User"}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          {user.createdAt
                            ? new Date(
                              user.createdAt
                            ).toLocaleDateString(
                              "en-US",
                              {
                                month:
                                  "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )
                            : "—"}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UsersManagement;