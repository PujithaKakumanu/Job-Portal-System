import { motion } from "framer-motion";
import React from "react";
import { useSelector } from "react-redux";
import { Link, Outlet, useLocation } from "react-router-dom";

const Me = () => {
  const user = useSelector((state) => state.user);
  const theme = useSelector((state) => state.theme.value);

  return (
    <motion.div
      initial={{ y: "20px" }}
      animate={{ y: 0 }}
      transition={{ ease: "linear", duration: 0.3 }}
      className="pt-6 w-full flex flex-col items-left gap-4 max-sm:px-4"
    >
      <p className="text-2xl font-bold">Your Jobs</p>
      <div className="flex bg-gry-800/30 md:mx-4 lg:mx-2 px-2 rounded-md justify-between items-center font-bold">
        {[
          {
            url: "",
            value: "Saved Jobs",
            applicantVisibility: true,
          },
          {
            url: "appliedJobs",
            value: "Applied Jobs",
            applicantVisibility: true,
          },
          {
            url: "postedJobs",
            value: "Posted Jobs",
            applicantVisibility: false,
          },
        ].map((link, index) => {
          const location = useLocation();
          const isActive =
            (location.pathname.includes(link.url) && link.url !== "") ||
            (link.url === "" && location.pathname === "/dashboard/me");
          const visibility =  ( user.role === "Applicant" && link.url === 'postedJobs' ) || ( user.role === "Employer" && link.url === 'appliedJobs' ) ? false : true;
          return (
            <Link
              key={index}
              to={link.url}
              className={`w-1/2 flex justify-center hover-effect relative py-2 before:h-[1px] ${
                isActive && "before:w-full"
              } ${!visibility ? 'hidden' : 'block'} ${theme === 'dark' && 'before:bg-blue-600'}`}
            >
              {link.value}
            </Link>
          );
        })}
      </div>
      <Outlet />
    </motion.div>
  );
};

export default Me;
