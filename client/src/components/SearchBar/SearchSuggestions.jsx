import React from "react";

const SearchSuggestions = ({
  suggestions,
  onSelect,
}) => {
  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <div className="absolute left-0 top-full z-50 mt-2 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
      {suggestions.map((item) => (
        <button
          key={item._id}
          type="button"
          onClick={() => onSelect(item)}
          className="block w-full cursor-pointer px-4 py-3 text-left text-sm text-gray-700 transition hover:bg-gray-100"
        >
          {item.name}
        </button>
      ))}
    </div>
  );
};

export default SearchSuggestions;