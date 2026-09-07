import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import HideEye from "../../assets/HideEye.png";
import OpenEye from "../../assets/openEye.png";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";
import Toast from "../../components/Toast.jsx";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";

const SignIn = () => {
  const { login } = useAuth();

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

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

    if (!formData.email.trim() || !formData.password) {
      showToast(
        "Please enter your email and password.",
        "warning"
      );
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:5000/users/signin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email.trim(),
            password: formData.password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        showToast(
          data.message || "Invalid email or password.",
          "error"
        );
        return;
      }

      login(data.user, data.token);

      if (data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("SIGN IN ERROR:", error);

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

      <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg"
        >
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Welcome Back
          </h1>

          <p className="mb-8 text-gray-500">
            Sign in to your account
          </p>

          <div className="space-y-4">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              autoComplete="email"
              placeholder="Email Address"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-gray-100"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                autoComplete="current-password"
                placeholder="Password"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-14 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-gray-100"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword((prev) => !prev)
                }
                disabled={loading}
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
              >
                <img
                  className="w-8"
                  src={
                    showPassword
                      ? OpenEye
                      : HideEye
                  }
                  alt=""
                />
              </button>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                disabled={loading}
                className="h-4 w-4 cursor-pointer rounded border-gray-300 disabled:cursor-not-allowed"
              />

              Remember me
            </label>

            <button
              type="button"
              disabled
              className="cursor-not-allowed text-sm text-gray-400"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 flex min-h-12 w-full cursor-pointer items-center justify-center rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <LoadingSpinner
                text="Signing in..."
                size="small"
              />
            ) : (
              "Sign In"
            )}
          </button>

          <div className="my-6 flex items-center">
            <div className="h-px flex-1 bg-gray-300" />

            <span className="px-4 text-sm text-gray-500">
              or continue with
            </span>

            <div className="h-px flex-1 bg-gray-300" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              disabled
              className="flex cursor-not-allowed items-center justify-center gap-2 rounded-lg border border-gray-300 py-3 font-medium text-gray-500 opacity-60"
            >
              <FcGoogle className="h-6 w-6" />

              <span className="text-sm">
                Google
              </span>

              <span className="text-xs">
                (Demo)
              </span>
            </button>

            <button
              type="button"
              disabled
              className="flex cursor-not-allowed items-center justify-center gap-2 rounded-lg border border-gray-300 py-3 font-medium text-gray-500 opacity-60"
            >
              <FaGithub className="h-6 w-6" />

              <span className="text-sm">
                GitHub
              </span>

              <span className="text-xs">
                (Demo)
              </span>
            </button>
          </div>

          <p className="mt-3 text-center text-xs text-gray-400">
            Social sign-in is not connected in this demo.
          </p>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-blue-600 hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default SignIn;