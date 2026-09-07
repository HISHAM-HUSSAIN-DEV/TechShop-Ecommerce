import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import SearchSuggestions from "./SearchSuggestions.jsx";

const API_URL = import.meta.env.VITE_API_URL;

const SearchBar = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleSelectProduct = (product) => {
    setSearch(product.name);
    setSuggestions([]);

    navigate(
      `/?search=${encodeURIComponent(product.name)}`
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const searchValue = search.trim();

    if (!searchValue) {
      setSuggestions([]);
      return;
    }

    setSuggestions([]);

    navigate(
      `/?search=${encodeURIComponent(searchValue)}`
    );
  };

  useEffect(() => {
    const searchValue = search.trim();

    if (!searchValue) {
      setSuggestions([]);
      return;
    }

    const controller = new AbortController();

    const fetchSuggestions = async () => {
      try {
        const res = await fetch(
          `${API_URL}/products?search=${encodeURIComponent(
            searchValue
          )}`,
          {
            signal: controller.signal,
          }
        );

        const data = await res.json();

        if (!res.ok) {
          setSuggestions([]);
          return;
        }

        setSuggestions(
          Array.isArray(data) ? data : []
        );
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error(
            "SEARCH SUGGESTIONS ERROR:",
            error
          );

          setSuggestions([]);
        }
      }
    };

    const timer = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [search]);

  return (
    <div className="relative w-full max-w-xl">
      <form
        onSubmit={handleSubmit}
        className="relative w-full"
      >
        <input
          type="search"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Search products..."
          aria-label="Search products"
          className="w-full rounded-full border border-slate-600 bg-white py-3 pl-5 pr-28 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
        />

        <button
          type="submit"
          className="absolute right-1 top-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-blue-600 px-5 py-2 font-medium text-white transition hover:bg-blue-500 active:scale-95"
        >
          Search
        </button>
      </form>

      <SearchSuggestions
        suggestions={suggestions}
        onSelect={handleSelectProduct}
      />
    </div>
  );
};

export default SearchBar;