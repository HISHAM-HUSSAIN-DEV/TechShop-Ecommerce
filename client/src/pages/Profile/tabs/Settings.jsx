import React, { useState } from "react";
import {
  FiSettings,
  FiMoon,
  FiBell,
  FiGlobe,
  FiShield,
} from "react-icons/fi";

const Settings = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm sm:p-8">
      {/* Header */}
      <div className="mb-6 flex items-start gap-3">
        <div className="rounded-xl bg-gray-100 p-3">
          <FiSettings className="text-2xl text-gray-700" />
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Settings
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Manage your account preferences.
          </p>
        </div>
      </div>

      <hr className="mb-8 border-gray-200" />

      {/* Appearance */}
      <section className="mb-8">
        <div className="mb-4 flex items-center gap-2">
          <FiMoon className="text-xl text-gray-600" />

          <h3 className="text-lg font-semibold text-gray-800">
            Appearance
          </h3>
        </div>

        <div className="rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-medium text-gray-800">
                Theme
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Choose between light and dark mode.
              </p>
            </div>

            <button
              type="button"
              disabled
              className="cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-400"
            >
              Light
            </button>
          </div>

          <p className="mt-3 text-xs text-gray-400">
            Dark mode coming soon.
          </p>
        </div>
      </section>

      {/* Notifications */}
      <section className="mb-8">
        <div className="mb-4 flex items-center gap-2">
          <FiBell className="text-xl text-gray-600" />

          <h3 className="text-lg font-semibold text-gray-800">
            Notifications
          </h3>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 p-5">
            <div>
              <p className="font-medium text-gray-800">
                Email Notifications
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Receive promotions and account updates.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setEmailNotifications((prev) => !prev)
              }
              className={`relative h-7 w-12 cursor-pointer rounded-full transition ${
                emailNotifications
                  ? "bg-blue-600"
                  : "bg-gray-300"
              }`}
              aria-label="Toggle email notifications"
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${
                  emailNotifications
                    ? "left-6"
                    : "left-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 p-5">
            <div>
              <p className="font-medium text-gray-800">
                Order Updates
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Receive notifications about your order status.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setOrderUpdates((prev) => !prev)
              }
              className={`relative h-7 w-12 cursor-pointer rounded-full transition ${
                orderUpdates
                  ? "bg-blue-600"
                  : "bg-gray-300"
              }`}
              aria-label="Toggle order updates"
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${
                  orderUpdates
                    ? "left-6"
                    : "left-1"
                }`}
              />
            </button>
          </div>
        </div>

        <p className="mt-3 text-xs text-gray-400">
          Notification preferences are for demonstration purposes only.
        </p>
      </section>

      {/* Language */}
      <section className="mb-8">
        <div className="mb-4 flex items-center gap-2">
          <FiGlobe className="text-xl text-gray-600" />

          <h3 className="text-lg font-semibold text-gray-800">
            Language
          </h3>
        </div>

        <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 p-5">
          <div>
            <p className="font-medium text-gray-800">
              Website Language
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Choose your preferred language.
            </p>
          </div>

          <select
            disabled
            defaultValue="English"
            className="cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100 px-4 py-2 text-sm text-gray-500"
          >
            <option>English</option>
          </select>
        </div>

        <p className="mt-3 text-xs text-gray-400">
          Additional languages coming soon.
        </p>
      </section>

      {/* Privacy */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <FiShield className="text-xl text-gray-600" />

          <h3 className="text-lg font-semibold text-gray-800">
            Privacy & Security
          </h3>
        </div>

        <div className="rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-medium text-gray-800">
                Privacy Preferences
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Manage privacy and account security preferences.
              </p>
            </div>

            <button
              type="button"
              disabled
              className="cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-400"
            >
              Manage
            </button>
          </div>
        </div>
      </section>

      {/* Demo Notice */}
      <div className="mt-8 rounded-xl border border-blue-200 bg-blue-50 p-4">
        <p className="text-sm text-blue-700">
          Some settings on this page are displayed for demonstration purposes
          and are not connected to backend services.
        </p>
      </div>
    </div>
  );
};

export default Settings;