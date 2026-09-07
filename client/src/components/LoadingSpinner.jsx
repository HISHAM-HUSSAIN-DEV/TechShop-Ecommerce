import React from "react";

const LoadingSpinner = ({
  text = "Loading...",
  size = "default",
}) => {
  const isSmall = size === "small";

  if (isSmall) {
    return (
      <div className="flex items-center justify-center gap-2">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-current" />

        {text && (
          <span className="text-sm font-medium">
            {text}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex min-h-48 flex-col items-center justify-center gap-3">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

      {text && (
        <p className="text-sm font-medium text-gray-500">
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;