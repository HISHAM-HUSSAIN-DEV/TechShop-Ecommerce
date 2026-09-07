import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import HideEye from "../../assets/HideEye.png";
import OpenEye from "../../assets/openEye.png";

import PhoneInput from "react-phone-number-input";

import Toast from "../../components/Toast.jsx";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";

const SignUp = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    address: "",
    address2: "",
    city: "",
    state: "",
    postCode: "",
    marketingConsent: false,
  });

  const password = formData.password;

  const passwordRules = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%&]/.test(password),
  };

  const showToast = (message, type = "success") => {
    setToast({
      message,
      type,
    });
  };

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));

    if (value.trim()) {
      setErrors((prev) => ({
        ...prev,
        [name]: false,
      }));
    }
  };

  const handlePhoneChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      phone: value || "",
    }));

    if (value) {
      setErrors((prev) => ({
        ...prev,
        phone: false,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    const newErrors = {};

    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "password",
      "city",
      "state",
      "postCode",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]?.trim()) {
        newErrors[field] = true;
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      showToast(
        "Please fill in all required fields.",
        "warning"
      );
      return;
    }

    if (
      formData.email
        .trim()
        .toLowerCase()
        .endsWith("@admin.com")
    ) {
      showToast(
        "This email domain is reserved for administrators.",
        "error"
      );
      return;
    }

    if (
      !Object.values(passwordRules).every(Boolean)
    ) {
      showToast(
        "Password does not meet all requirements.",
        "warning"
      );
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:5000/users/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            ...formData,

            firstName:
              formData.firstName.trim(),

            lastName:
              formData.lastName.trim(),

            email:
              formData.email
                .trim()
                .toLowerCase(),

            address:
              formData.address.trim(),

            address2:
              formData.address2.trim(),

            city:
              formData.city.trim(),

            state:
              formData.state.trim(),

            postCode:
              formData.postCode.trim(),
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        showToast(
          data.message ||
          "Unable to create account.",
          "error"
        );
        return;
      }

      navigate("/signin");
    } catch (error) {
      console.error(
        "SIGN UP ERROR:",
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

      <div className="mx-auto w-full max-w-3xl rounded-2xl bg-white p-8 shadow-lg">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            Sign Up to Our Service
          </h1>

          <p className="mt-2 text-gray-500">
            Fill out the form to sign up to our service
          </p>

          <div className="mx-auto mt-4 h-1 w-full rounded-full bg-primary" />
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Name */}
          <div>
            <h3 className="mb-3 text-lg font-semibold text-gray-700">
              Name
            </h3>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={loading}
                  autoComplete="given-name"
                  placeholder="First Name"
                  className={`w-full rounded-lg border px-4 py-3 outline-none transition ${errors.firstName
                      ? "border-error"
                      : "border-gray-300"
                    } focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-gray-100`}
                />

                <p className="mt-1 text-sm text-gray-500">
                  First Name *
                </p>
              </div>

              <div>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={loading}
                  autoComplete="family-name"
                  placeholder="Last Name"
                  className={`w-full rounded-lg border px-4 py-3 outline-none transition ${errors.lastName
                      ? "border-error"
                      : "border-gray-300"
                    } focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-gray-100`}
                />

                <p className="mt-1 text-sm text-gray-500">
                  Last Name *
                </p>
              </div>
            </div>
          </div>

          {/* Email */}
          <div>
            <h3 className="mb-3 text-lg font-semibold text-gray-700">
              E-mail
            </h3>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              autoComplete="email"
              placeholder="example@example.com"
              className={`w-full rounded-lg border px-4 py-3 outline-none transition ${errors.email
                  ? "border-error"
                  : "border-gray-300"
                } focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-gray-100`}
            />

            <p className="mt-1 text-sm text-gray-500">
              example@example.com *
            </p>
          </div>

          {/* Phone */}
          <div>
            <h3 className="mb-3 text-lg font-semibold text-gray-700">
              Phone
            </h3>

            <PhoneInput
              international
              defaultCountry="SA"
              value={formData.phone}
              onChange={handlePhoneChange}
              disabled={loading}
              className={`w-full rounded-lg border px-4 py-3 outline-none transition ${errors.phone
                  ? "border-error"
                  : "border-gray-300"
                } focus:border-primary focus:ring-2 focus:ring-primary/20`}
            />

            <p className="mt-1 text-sm text-gray-500">
              Example: +966 5X XXX XXXX *
            </p>
          </div>

          {/* Password */}
          <div className="relative">
            <h3 className="mb-3 text-lg font-semibold text-gray-700">
              Password
            </h3>

            <div className="relative">
              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                autoComplete="new-password"
                placeholder="Password"
                className={`w-full rounded-lg border px-4 py-3 pr-14 outline-none transition ${errors.password
                    ? "border-error"
                    : "border-gray-300"
                  } focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-gray-100`}
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    (prev) => !prev
                  )
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

            <div className="mt-3 space-y-1 text-sm">
              <p
                className={
                  passwordRules.length
                    ? "text-green-600"
                    : "text-red-500"
                }
              >
                ✓ At least 8 characters
              </p>

              <p
                className={
                  passwordRules.uppercase
                    ? "text-green-600"
                    : "text-red-500"
                }
              >
                ✓ Uppercase letter
              </p>

              <p
                className={
                  passwordRules.lowercase
                    ? "text-green-600"
                    : "text-red-500"
                }
              >
                ✓ Lowercase letter
              </p>

              <p
                className={
                  passwordRules.number
                    ? "text-green-600"
                    : "text-red-500"
                }
              >
                ✓ Number
              </p>

              <p
                className={
                  passwordRules.special
                    ? "text-green-600"
                    : "text-red-500"
                }
              >
                ✓ Special character (!@#$%&)
              </p>
            </div>
          </div>

          {/* Address */}
          <div>
            <h3 className="mb-3 text-lg font-semibold text-gray-700">
              Address
            </h3>

            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              disabled={loading}
              autoComplete="street-address"
              placeholder="Street Address"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-gray-100"
            />

            <p className="mt-1 text-sm text-gray-500">
              Street Address *
            </p>

            <input
              type="text"
              name="address2"
              value={formData.address2}
              onChange={handleChange}
              disabled={loading}
              placeholder="Street Address Line 2"
              className="mt-4 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-gray-100"
            />

            <p className="mt-1 text-sm text-gray-500">
              Street Address Line 2 (Optional)
            </p>
          </div>

          {/* City & State */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                disabled={loading}
                autoComplete="address-level2"
                placeholder="City"
                className={`w-full rounded-lg border px-4 py-3 outline-none transition ${errors.city
                    ? "border-error"
                    : "border-gray-300"
                  } focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-gray-100`}
              />

              <p className="mt-1 text-sm text-gray-500">
                City *
              </p>
            </div>

            <div>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                disabled={loading}
                autoComplete="address-level1"
                placeholder="State / Province"
                className={`w-full rounded-lg border px-4 py-3 outline-none transition ${errors.state
                    ? "border-error"
                    : "border-gray-300"
                  } focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-gray-100`}
              />

              <p className="mt-1 text-sm text-gray-500">
                State / Province *
              </p>
            </div>
          </div>

          {/* Postal Code */}
          <div>
            <input
              type="text"
              name="postCode"
              value={formData.postCode}
              onChange={handleChange}
              disabled={loading}
              autoComplete="postal-code"
              placeholder="Postal / Zip Code"
              className={`w-full rounded-lg border px-4 py-3 outline-none transition ${errors.postCode
                  ? "border-error"
                  : "border-gray-300"
                } focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-gray-100`}
            />

            <p className="mt-1 text-sm text-gray-500">
              Postal / Zip Code *
            </p>
          </div>

          {/* Marketing Consent */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <h3 className="mb-3 font-semibold text-gray-700">
              May we send information about us to
              the mailing address that you
              provided?
            </h3>

            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                name="marketingConsent"
                checked={
                  formData.marketingConsent
                }
                onChange={handleChange}
                disabled={loading}
                className="mt-1 h-4 w-4 cursor-pointer accent-primary disabled:cursor-not-allowed"
              />

              <span className="text-sm text-gray-600">
                Send me news, offers, and
                product updates.
              </span>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="flex min-h-12 w-full cursor-pointer items-center justify-center rounded-lg bg-primary py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <LoadingSpinner
                text="Creating account..."
                size="small"
              />
            ) : (
              "Create Account"
            )}
          </button>
          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="font-semibold text-blue-600 hover:underline"
            >
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default SignUp;