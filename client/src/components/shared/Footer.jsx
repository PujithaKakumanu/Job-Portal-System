import React from "react";
import { useSelector } from "react-redux";

const Footer = () => {
  const theme = useSelector((state) => state.theme.value);
  return (
    <footer
      className={` ${
        theme === "dark" && "bg-zinc-900 text-white"
      } w-screen bg-gradient-to-r from-zinc-900/30 flex  flex-col px-4 md:px-24 pb-4`}
    >
      <div className="flex justify-between max-lg:flex-col">
        <div className="info flex flex-col gap-2 max-lg:border-b border-slate-900 max-lg:mb-2 max-lg:pb-2">
          <p className="text-2xl font-bold">Jobster</p>
          <p className="text-sm ">
           Address: India, 221002
          </p>
          <a href="/" className="text-sm">
            +91 1234567890
          </a>
        </div>
        <div className="links flex items-right flex-col justify-start font-medium">
          <a href="#home" className="relative hover-effect before:h-[1px] flex">
            Home
          </a>
          <a
            href="#clients"
            className="relative hover-effect before:h-[1px] flex"
          >
            Clients
          </a>
          <a
            href="#trending"
            className="relative hover-effect before:h-[1px] flex"
          >
            Trending Jobs
          </a>
          <a
            href="#testimonials"
            className="relative hover-effect before:h-[1px] flex"
          >
            Testimonials
          </a>
        </div>
      </div>
      <p className="text-xs py-2">©, 2024 Pvt. Ltd. All Rights Reserved.</p>
    </footer>
  );
};

export default Footer;
