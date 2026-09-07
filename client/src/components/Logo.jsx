import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/TechShop.png";

const Logo = () => {
  return (
    <Link
      to="/"
      className="flex items-center gap-3"
    >
      <img
        src={logo}
        alt="TechStore Logo"
        className="h-16 w-20 rounded-xl object-cover"
      />

      <div className="hidden sm:block">
        <h1 className="text-2xl font-bold leading-tight">
          <span className="text-blue-500">Tech</span>
          <span className="text-cyan-300">Store</span>
        </h1>

        <p className="text-xs tracking-wide text-slate-400">
          Portfolio Online Shop
        </p>
      </div>
    </Link>
  );
};

export default Logo;