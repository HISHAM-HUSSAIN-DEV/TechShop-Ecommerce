import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import Logo from "../Logo.jsx";
import SearchBar from "../SearchBar/SearchBar";

import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

import { FaUserCircle } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { IoChevronDown } from "react-icons/io5";
import { FiUser, FiSettings, FiLogOut } from "react-icons/fi";
import { HiOutlineShoppingBag } from "react-icons/hi2";

const Header = () => {
  const menuRef = useRef(null);

  const {
    user,
    isAuthenticated,
    logout,
  } = useAuth();

  const { cartItems } = useCart();

  const [openMenu, setOpenMenu] = useState(false);

  const location = useLocation();

  const totalCartItems = cartItems.reduce(
    (total, item) =>
      total + Number(item.quantity || 0),
    0
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setOpenMenu(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const handleLogout = () => {
    setOpenMenu(false);
    logout();
  };

  return (
    <header className="bg-slate-950 shadow-md">
      <div className="container mx-auto grid grid-cols-[1fr_2fr_1fr] items-center gap-4 px-4 py-4">
        {/* Logo */}
        <div className="justify-self-start">
          <Logo />
        </div>

        {/* Search */}
        <div className="hidden w-full md:block">
          <SearchBar />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-self-end gap-3">
          {/* Cart */}
          <Link
            to="/cart"
            state={{
              from:
                location.pathname +
                location.search,
            }}
            aria-label={`Cart with ${totalCartItems} items`}
            className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-slate-200 transition hover:border-blue-500 hover:bg-slate-800 hover:text-white"
          >
            <FaCartShopping className="text-xl" />

            {totalCartItems > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold leading-none text-white shadow">
                {totalCartItems > 99
                  ? "99+"
                  : totalCartItems}
              </span>
            )}
          </Link>

          {/* User */}
          {isAuthenticated ? (
            <div
              ref={menuRef}
              className="relative"
            >
              <button
                type="button"
                onClick={() =>
                  setOpenMenu((prev) => !prev)
                }
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 transition hover:border-blue-500 hover:bg-slate-800"
              >
                <FaUserCircle className="text-3xl text-slate-200" />

                <div className="hidden text-left sm:block">
                  <p className="text-xs text-slate-400">
                    Welcome
                  </p>

                  <p className="max-w-28 truncate text-sm font-semibold text-white">
                    {user?.firstName}
                  </p>
                </div>

                <IoChevronDown
                  className={`text-slate-400 transition-transform duration-200 ${
                    openMenu
                      ? "rotate-180"
                      : ""
                  }`}
                />
              </button>

              {openMenu && (
                <div className="absolute right-0 z-50 mt-3 w-72 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
                  {/* User Info */}
                  <div className="border-b border-gray-100 bg-gray-50 p-4">
                    <div className="flex items-center gap-3">
                      <FaUserCircle className="text-4xl text-slate-700" />

                      <div className="min-w-0">
                        <p className="truncate font-semibold text-gray-900">
                          {user?.firstName}{" "}
                          {user?.lastName}
                        </p>

                        <p className="truncate text-sm text-gray-500">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu */}
                  <div className="p-2">
                    <Link
                      to="/profile/account"
                      onClick={() =>
                        setOpenMenu(false)
                      }
                      className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-gray-700 transition hover:bg-blue-50 hover:text-blue-700"
                    >
                      <FiUser className="text-lg" />
                      My Profile
                    </Link>

                    <Link
                      to="/profile/orders"
                      onClick={() =>
                        setOpenMenu(false)
                      }
                      className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-gray-700 transition hover:bg-blue-50 hover:text-blue-700"
                    >
                      <HiOutlineShoppingBag className="text-lg" />
                      My Orders
                    </Link>

                    <Link
                      to="/profile/settings"
                      onClick={() =>
                        setOpenMenu(false)
                      }
                      className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-gray-700 transition hover:bg-blue-50 hover:text-blue-700"
                    >
                      <FiSettings className="text-lg" />
                      Settings
                    </Link>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-gray-100 p-2">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                    >
                      <FiLogOut className="text-lg" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/signin"
              className="flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white transition hover:bg-blue-500"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Search */}
      <div className="container mx-auto px-4 pb-4 md:hidden">
        <SearchBar />
      </div>
    </header>
  );
};

export default Header;