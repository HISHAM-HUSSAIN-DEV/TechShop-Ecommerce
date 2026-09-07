import React from "react";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";

const Sort = ({ sortValue, onSortChange }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="hidden items-center gap-2 text-sm font-medium text-gray-600 sm:flex">
        <HiOutlineAdjustmentsHorizontal className="text-xl" />
        <span>Sort by</span>
      </div>

      <select
        value={sortValue}
        onChange={(e) => onSortChange(e.target.value)}
        className="cursor-pointer rounded-xl border border-gray-200 bg-white px-4 py-2.5 pr-10 text-sm font-medium text-gray-700 shadow-sm outline-none transition hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        aria-label="Sort products"
      >
        <option value="">Featured</option>
        <option value="price-asc">
          Price: Low to High
        </option>
        <option value="price-desc">
          Price: High to Low
        </option>
        <option value="rating-desc">
          Highest Rated
        </option>
      </select>
    </div>
  );
};

export default Sort;