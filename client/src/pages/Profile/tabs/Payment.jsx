import React from "react";
import {
  MdOutlinePayment,
  MdOutlineCreditCard,
} from "react-icons/md";

const Payment = () => {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm sm:p-8">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Payment Methods
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Manage your payment methods.
        </p>
      </div>

      <hr className="mb-8" />

      {/* Demo Notice */}
      <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
        <div className="flex items-start gap-3">
          <MdOutlinePayment className="mt-0.5 text-2xl text-blue-600" />

          <div>
            <p className="font-medium text-blue-800">
              Demo Payment System
            </p>

            <p className="mt-1 text-sm text-blue-600">
              Payment methods are displayed for demonstration purposes only.
              No real payment information is stored or processed.
            </p>
          </div>
        </div>
      </div>

      {/* Saved Cards */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800">
          Saved Payment Methods
        </h3>

        <div className="mt-4 rounded-xl border border-gray-200 p-8 text-center">
          <MdOutlineCreditCard className="mx-auto text-5xl text-gray-300" />

          <h4 className="mt-4 font-semibold text-gray-800">
            No payment methods saved
          </h4>

          <p className="mt-2 text-sm text-gray-500">
            You don't have any saved payment methods yet.
          </p>

          <button
            type="button"
            disabled
            className="mt-6 cursor-not-allowed rounded-lg bg-gray-200 px-5 py-2.5 font-medium text-gray-500"
          >
            Add Payment Method
          </button>

          <p className="mt-2 text-xs text-gray-400">
            Available in demo only
          </p>
        </div>
      </div>

      {/* Demo Payment Options */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-800">
          Supported Payment Options
        </h3>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-200 p-5">
            <p className="font-semibold text-gray-800">
              Google Pay
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Demo payment option.
            </p>

            <span className="mt-3 inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
              Demo
            </span>
          </div>

          <div className="rounded-xl border border-gray-200 p-5">
            <p className="font-semibold text-gray-800">
              PayPal
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Demo payment option.
            </p>

            <span className="mt-3 inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
              Demo
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;