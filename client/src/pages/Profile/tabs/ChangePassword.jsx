import React, { useState } from "react";

import { useAuth } from "../../../context/AuthContext";
import Toast from "../../../components/Toast.jsx";
import LoadingSpinner from "../../../components/LoadingSpinner.jsx";

const ChangePassword = () => {
  const { token } = useAuth();

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });

  const passwordRules = {
    length: formData.newPassword.length >= 8,
    uppercase: /[A-Z]/.test(formData.newPassword),
    lowercase: /[a-z]/.test(formData.newPassword),
    number: /\d/.test(formData.newPassword),
    special: /[!@#$%&]/.test(formData.newPassword),
  };

  const showToast = (message, type = "success") => {
    setToast({
      message,
      type,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (
      !formData.currentPassword ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      showToast(
        "Please fill in all fields.",
        "warning"
      );
      return;
    }

    if (
      !Object.values(passwordRules).every(Boolean)
    ) {
      showToast(
        "New password does not meet all requirements.",
        "warning"
      );
      return;
    }

    if (
      formData.newPassword !==
      formData.confirmPassword
    ) {
      showToast(
        "New passwords do not match.",
        "warning"
      );
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:5000/users/change-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword:
              formData.currentPassword,
            newPassword:
              formData.newPassword,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        showToast(
          data.message ||
            "Unable to change password.",
          "error"
        );
        return;
      }

      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      showToast(
        "Password changed successfully!",
        "success"
      );
    } catch (error) {
      console.error(
        "CHANGE PASSWORD ERROR:",
        error
      );

      showToast(
        "Something went wrong. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
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

      <div className="rounded-xl bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Change Password
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Update your account password.
          </p>
        </div>

        <hr className="mb-8" />

        <form
          onSubmit={handleSubmit}
          className="max-w-xl space-y-6"
        >
          <div>
            <label
              htmlFor="currentPassword"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Current Password
            </label>

            <input
              id="currentPassword"
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              disabled={loading}
              autoComplete="current-password"
              placeholder="Enter current password"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
            />
          </div>

          <div>
            <label
              htmlFor="newPassword"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              New Password
            </label>

            <input
              id="newPassword"
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              disabled={loading}
              autoComplete="new-password"
              placeholder="Enter new password"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
            />

            <div className="mt-3 space-y-1 text-sm">
              <p
                className={
                  passwordRules.length
                    ? "text-green-600"
                    : "text-gray-500"
                }
              >
                ✓ At least 8 characters
              </p>

              <p
                className={
                  passwordRules.uppercase
                    ? "text-green-600"
                    : "text-gray-500"
                }
              >
                ✓ Uppercase letter
              </p>

              <p
                className={
                  passwordRules.lowercase
                    ? "text-green-600"
                    : "text-gray-500"
                }
              >
                ✓ Lowercase letter
              </p>

              <p
                className={
                  passwordRules.number
                    ? "text-green-600"
                    : "text-gray-500"
                }
              >
                ✓ Number
              </p>

              <p
                className={
                  passwordRules.special
                    ? "text-green-600"
                    : "text-gray-500"
                }
              >
                ✓ Special character (!@#$%&)
              </p>
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Confirm New Password
            </label>

            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
              autoComplete="new-password"
              placeholder="Confirm new password"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
            />

            {formData.confirmPassword &&
              formData.newPassword !==
                formData.confirmPassword && (
                <p className="mt-2 text-sm text-red-500">
                  Passwords do not match.
                </p>
              )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex min-w-44 cursor-pointer items-center justify-center rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <LoadingSpinner
                text="Updating..."
                size="small"
              />
            ) : (
              "Update Password"
            )}
          </button>
        </form>
      </div>
    </>
  );
};

export default ChangePassword;