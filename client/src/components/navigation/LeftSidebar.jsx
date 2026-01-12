import React from "react";
import { useSelector } from "react-redux";
import { links } from "../../utils";
import { Link, useLocation } from "react-router-dom";

const LeftSidebar = () => {
  const theme = useSelector((state) => state.theme.value);
  const location = useLocation();
  return (
    <div className={`py-12 px-12 h-full max-sm:hidden flex flex-col justify-start border-r fixed top-12 left-0`}>
        <div className="flex flex-col gap-4 flex-1 ">
          {links.map((link, index) => {
            const isActive = location.pathname == link.url || ( location.pathname.includes(link.url) && link.url !== '/dashboard');
            return (
              <Link
                to={link.url}
                key={index}
                className={` ${
                  theme === "dark" ? "auth-button-dark" : "auth-button"
                } ${isActive && 'auth-button-active bg-slate-900/90 text-white'} relative flex items-center justify-center gap-4 hover-effect overflow-hidden auth-button`}
              >
                {link.icon}
                <p>{link.name}</p>
              </Link>
            );
          })}
        </div>
    </div>
  );
};

export default LeftSidebar;
