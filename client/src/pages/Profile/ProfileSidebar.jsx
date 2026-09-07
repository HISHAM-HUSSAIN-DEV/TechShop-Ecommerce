import React from "react";
import { NavLink } from "react-router-dom";
import { profileMenu } from "./ProfileMenu.js";

const ProfileSidebar = () => {
  return (
    <div className="py-2">
      {profileMenu.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) =>
              `flex w-full items-center gap-3 px-6 py-4 transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <Icon className="text-xl" />

            <span>
              {item.title}
            </span>
          </NavLink>
        );
      })}
    </div>
  );
};

export default ProfileSidebar;