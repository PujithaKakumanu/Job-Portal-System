import { formatDate, getInitials } from "@/utils/services";
import { motion } from "framer-motion";
import React from "react";
import { useInView } from "react-intersection-observer";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const ApplicationCard = ({ application }) => {
  const theme = useSelector((state) => state.theme.value);
  const [ref, inView] = useInView();

  return (
    <motion.div ref={ref} className={`flex w-full `}>
      <div
        style={{
          transform: inView ? "none" : "translateY(30px)",
          scale: inView ? 1 : 0.5,
          opacity: inView ? 1 : 0,
          transition: "all 0.6s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s",
        }}
        className={`flex flex-col items-start justify-start relative shadow-[0_0_25px_gray] w-full mx-4 max-sm:mx-0 border border-gray-800/60 py-4 rounded-md ${
          theme === "dark" && "border-gray-400"
        }`}
      >
        <div className="applicant w-full flex flex-col gap-4">
          <p className="profile-link text-lg max-sm:text-md">
            Applicant Details
          </p>
          <Link
            to={`/users/${application.applicant._id}`}
            className="flex flex-col justify-start pl-4 gap-3 bg-blue-500/10 py-4 w-full"
          >
            <div className="flex w-full gap-4">
              {application.applicant.profilePhoto ? (
                <img
                  src={application.applicant.profilePhoto.url}
                  alt={application.applicant.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div
                  alt={application.applicant.name}
                  className="w-12 h-12 rounded-full bg-white/50 text-black shadow-[0_0_25px_gray] flex items-center justify-center"
                >
                  {getInitials(application.applicant.name)}
                </div>
              )}
              <div className="flex flex-col items-start">
                <p className="font-bold text-xl capitalize">
                  {application.applicant.name}
                </p>
                <p className="text-sm">ID : {application.applicant._id}</p>
                <p className="text-sm">{application.applicant.phone}</p>
              </div>
            </div>
            <div className="flex niches gap-4">
              {application.applicant.niches.map((niche, index) => {
                return (
                  <p
                    key={index}
                    className={`flex items-center rounded-xl px-2 py-[1px] z-[12] border shadow-[0_0_25px_gray] ${
                        theme === "dark"
                          ? "bg-slate-900/90 hover:bg-gray-800"
                          : "bg-gray-300 hover:bg-gray-500/50"
                      } cursor-pointer`}
                    >
                    {niche}
                  </p>
                );
              })}
            </div>
          </Link>
        </div>

        <div className="date pl-4 mt-2 text-sm italic">Applied On : {formatDate(application.appliedOn)}</div>

        <div className="coverLetter flex flex-col w-full gap-4 mt-2">
            <p className="profile-link text-lg max-sm:text-md px-4">Cover Letter</p>
            <Link to={`/users/${application.applicant._id}`} className="group text-justify px-4 hover-effect">
                <p className="">{application.coverLetter}</p>
                <p className="group-hover:text-blue-900/90">see more...</p>
            </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ApplicationCard;
