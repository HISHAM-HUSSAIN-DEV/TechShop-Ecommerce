import React, { useState } from "react";
import LoadingSpinner from "../../../components/LoadingSpinner.jsx";

const ReturnRequestForm = ({
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [returnReason, setReturnReason] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    const reason = returnReason.trim();

    if (!reason) {
      setError("Please enter a return reason.");
      return;
    }

    setError("");

    onSubmit(reason);
  };

  const handleChange = (e) => {
    setReturnReason(e.target.value);

    if (error) {
      setError("");
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <h3 className="text-lg font-semibold text-gray-800">
        Return Request
      </h3>

      <p className="mt-1 text-sm text-gray-500">
        Tell us why you want to return this order.
      </p>

      <textarea
        value={returnReason}
        onChange={handleChange}
        rows={4}
        disabled={loading}
        placeholder="Enter return reason..."
        className={`mt-4 w-full resize-none rounded-lg border px-4 py-3 outline-none transition disabled:cursor-not-allowed disabled:bg-gray-100 ${
          error
            ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100"
            : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        }`}
      />

      {error && (
        <p className="mt-2 text-sm text-red-500">
          {error}
        </p>
      )}

      <div className="mt-4 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="cursor-pointer rounded-lg border border-gray-300 px-5 py-2.5 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="flex min-w-36 cursor-pointer items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <LoadingSpinner
              text="Submitting..."
              size="small"
            />
          ) : (
            "Submit Return"
          )}
        </button>
      </div>
    </div>
  );
};

export default ReturnRequestForm;