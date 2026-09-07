import React from "react";
import {
  NavLink,
  useLocation,
  useSearchParams,
} from "react-router-dom";

const Navbar = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const currentCategory =
    searchParams.get("category") || "";

  const isHomePage = location.pathname === "/";

  const getLinkClass = (category) => {
    const isActive =
      isHomePage &&
      currentCategory === category;

    return `whitespace-nowrap border-b-2 pb-1 font-semibold transition-colors duration-200 ${
      isActive
        ? "border-blue-400 text-blue-400"
        : "border-transparent text-slate-200 hover:border-blue-400 hover:text-white"
    }`;
  };

  return (
    <nav className="border-b border-slate-700 bg-slate-800 shadow-sm">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <ul className="flex w-max min-w-full items-center justify-start gap-7 py-4 sm:justify-center sm:gap-10">
            <li>
              <NavLink
                to="/"
                end
                className={getLinkClass("")}
              >
                Home
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/?category=Phones"
                className={getLinkClass("Phones")}
              >
                Phones
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/?category=Laptops"
                className={getLinkClass("Laptops")}
              >
                Laptops
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/?category=Gaming"
                className={getLinkClass("Gaming")}
              >
                Gaming
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/?category=Cameras"
                className={getLinkClass("Cameras")}
              >
                Cameras
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/?category=Accessories"
                className={getLinkClass("Accessories")}
              >
                Accessories
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;