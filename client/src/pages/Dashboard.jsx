import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import Navbar from "../components/shared/Navbar";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import LeftSidebar from "../components/navigation/LeftSidebar";
import RightSidebar from "../components/navigation/RightSidebar";
import UserAvatar from "@/components/shared/UserAvatar";
import { IoIosArrowForward } from "react-icons/io";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { links } from "@/utils";
import { jwtDecode } from "jwt-decode";

const Dashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token") || null;
  let user = null
  if(token) user = jwtDecode(token);

  useEffect(() => {
    if (!token) navigate("/auth?redirect=true");
  }, []);

  const theme = useSelector((state) => state.theme.value);
  
  return (
    <div
      className={` ${
        theme === "dark" && "bg-zinc-900 text-white"
      } w-screen min-h-screen bg-gradient-to-r from-transparent to-zinc-700/30 font-[inter] flex flex-col justify-between relative pb-24`}
    >
      <Sheet className="bg-transparent">
        <SheetTrigger className="fixed max-sm:flex hidden tracking-tighter z-[99] top-[50vh] left-0 translate-y-[-50%] rounded-r-xl shadow-gray-600 shadow-md py-4">
          <IoIosArrowForward />
        </SheetTrigger>
        <SheetContent
          side="left"
          className={`z-[99] ${
            theme === "dark"
              ? "bg-zinc-900 text-white"
              : "bg-gradient-to-r from-[#f0f8ff] to-slate-900/30"
          } backdrop-blur-lg bg-opacity-75 border-none shadow-[0_0_30px_gray] shadow-gray-500/40`}
        >
          <SheetHeader>
            <SheetTitle className="text-inherit text-2xl font-bold">
              <Link to="/">Jobster</Link>
            </SheetTitle>
            <SheetDescription className="text-inherit flex flex-col py-12 items-center gap-4">
              {links.map((link, index) => {
                const location = useLocation();
                const isActive = location.pathname === link.url;
                return (
                  <SheetClose key={index} asChild>
                    <Link
                      to={link.url}
                      className={` text-lg w-2/3 ${
                        isActive && "border-b border-slate-900 font-bold"
                      }`}
                    >
                      {link.name}
                    </Link>
                  </SheetClose>
                );
              })}
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>

      <Navbar otherClasses={"fixed top-0"}>
        <div
          to={"/"}
          className="rounded-full border border-slate-900 hover:shadow-xl cursor-pointer shadow-gray"
        ></div>
        <UserAvatar />
      </Navbar>
      <div
        className={`flex justify-center max-sm:justify-center max-lg:justify-end relative top-12`}
      >
        <LeftSidebar />
        <div
          className={`w-[65vw] max-lg:min-w-[75vw] max-lg:pr-4 max-xl:min-w-[55vw] max-sm:min-w-[100vw] md:-ml-[8vw] relative`}
        >
          <Outlet />
        </div>
        <RightSidebar />
      </div>
    </div>
  );
};

export default Dashboard;
