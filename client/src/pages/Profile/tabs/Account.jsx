import React, { useState } from "react";
import { CiEdit } from "react-icons/ci";

import { useAuth } from "../../../context/AuthContext";
import Toast from "../../../components/Toast.jsx";
import LoadingSpinner from "../../../components/LoadingSpinner.jsx";

const Account = () => {
  const {
    user,
    token,
    updateUser,
  } = useAuth();

  const [isEditing, setIsEditing] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    city: user?.city || "",
    address: user?.address || "",
    postCode: user?.postCode || "",
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

  const resetForm = () => {
    setFormData({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      city: user?.city || "",
      address: user?.address || "",
      postCode: user?.postCode || "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    resetForm();
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (loading) return;

    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.email.trim()
    ) {
      showToast(
        "First name, last name, and email are required.",
        "warning"
      );
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:5000/users/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            firstName: formData.firstName.trim(),
            lastName: formData.lastName.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            city: formData.city.trim(),
            address: formData.address.trim(),
            postCode: formData.postCode.trim(),
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          showToast(
            "Your session has expired. Please sign in again.",
            "error"
          );
          return;
        }

        showToast(
          data.message ||
            "Unable to update your profile.",
          "error"
        );
        return;
      }

      updateUser(data.user);
      setFormData({
        firstName: data.user.firstName || "",
        lastName: data.user.lastName || "",
        email: data.user.email || "",
        phone: data.user.phone || "",
        city: data.user.city || "",
        address: data.user.address || "",
        postCode: data.user.postCode || "",
      });

      setIsEditing(false);

      showToast(
        "Profile updated successfully!",
        "success"
      );
    } catch (error) {
      console.error(
        "UPDATE PROFILE ERROR:",
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

      <div className="rounded-xl bg-white p-8 shadow">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-800">
            Personal Information
          </h2>

          <button
            type="button"
            onClick={() =>
              isEditing
                ? handleCancel()
                : setIsEditing(true)
            }
            disabled={loading}
            className="flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-blue-600 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CiEdit className="text-2xl" />

            <span className="font-medium">
              {isEditing ? "Cancel" : "Edit"}
            </span>
          </button>
        </div>

        <hr className="mb-8" />

        {/* Form */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="firstName"
              className="mb-2 block text-sm font-medium text-gray-600"
            >
              First Name
            </label>

            <input
              id="firstName"
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              readOnly={!isEditing}
              disabled={loading}
              className={`w-full rounded-lg border px-4 py-3 outline-none transition ${
                isEditing
                  ? "border-blue-500 bg-white"
                  : "border-gray-300 bg-gray-50"
              } disabled:cursor-not-allowed disabled:opacity-60`}
            />
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="mb-2 block text-sm font-medium text-gray-600"
            >
              Last Name
            </label>

            <input
              id="lastName"
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              readOnly={!isEditing}
              disabled={loading}
              className={`w-full rounded-lg border px-4 py-3 outline-none transition ${
                isEditing
                  ? "border-blue-500 bg-white"
                  : "border-gray-300 bg-gray-50"
              } disabled:cursor-not-allowed disabled:opacity-60`}
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-600"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              readOnly={!isEditing}
              disabled={loading}
              className={`w-full rounded-lg border px-4 py-3 outline-none transition ${
                isEditing
                  ? "border-blue-500 bg-white"
                  : "border-gray-300 bg-gray-50"
              } disabled:cursor-not-allowed disabled:opacity-60`}
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="mb-2 block text-sm font-medium text-gray-600"
            >
              Phone
            </label>

            <input
              id="phone"
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              readOnly={!isEditing}
              disabled={loading}
              className={`w-full rounded-lg border px-4 py-3 outline-none transition ${
                isEditing
                  ? "border-blue-500 bg-white"
                  : "border-gray-300 bg-gray-50"
              } disabled:cursor-not-allowed disabled:opacity-60`}
            />
          </div>

          <div>
            <label
              htmlFor="city"
              className="mb-2 block text-sm font-medium text-gray-600"
            >
              City
            </label>

            <input
              id="city"
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              readOnly={!isEditing}
              disabled={loading}
              className={`w-full rounded-lg border px-4 py-3 outline-none transition ${
                isEditing
                  ? "border-blue-500 bg-white"
                  : "border-gray-300 bg-gray-50"
              } disabled:cursor-not-allowed disabled:opacity-60`}
            />
          </div>

          <div>
            <label
              htmlFor="postCode"
              className="mb-2 block text-sm font-medium text-gray-600"
            >
              Post Code
            </label>

            <input
              id="postCode"
              type="text"
              name="postCode"
              value={formData.postCode}
              onChange={handleChange}
              readOnly={!isEditing}
              disabled={loading}
              className={`w-full rounded-lg border px-4 py-3 outline-none transition ${
                isEditing
                  ? "border-blue-500 bg-white"
                  : "border-gray-300 bg-gray-50"
              } disabled:cursor-not-allowed disabled:opacity-60`}
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="address"
              className="mb-2 block text-sm font-medium text-gray-600"
            >
              Address
            </label>

            <input
              id="address"
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              readOnly={!isEditing}
              disabled={loading}
              className={`w-full rounded-lg border px-4 py-3 outline-none transition ${
                isEditing
                  ? "border-blue-500 bg-white"
                  : "border-gray-300 bg-gray-50"
              } disabled:cursor-not-allowed disabled:opacity-60`}
            />
          </div>
        </div>

        {isEditing && (
          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              disabled={loading}
              className="flex min-w-40 cursor-pointer items-center justify-center rounded-lg bg-blue-600 px-8 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <LoadingSpinner
                  text="Saving..."
                  size="small"
                />
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Account;