import { motion } from "framer-motion";
import React, { Suspense, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import { PacmanLoader } from "react-spinners";
import { baseUrl } from "@/utils";
import { useSelector } from "react-redux";
import { formatDate } from "@/utils/services";

const UserProfile = ({ user }) => {
  const [company, setCompany] = React.useState(null);
  const theme = useSelector((state) => state.theme.value);

  const userData = useSelector((state) => state.user)

  const ID = user._id || user.id
  let isSelfProfile = false

  isSelfProfile = userData?.id === ID

  useEffect(() => {
    if(user.role === 'Employer') {
      const fetchCompany = async () => {
        try {
          const res = await fetch(`${baseUrl}company/${user.company}`);
          const data = await res.json();
          if (data.success) setCompany(data.company);
        } catch (error) {
          console.log(error.message);
        }
      };
      fetchCompany();
    }
  }, []);
  return (
    <Suspense
      fallback={
        <div className="w-screen h-screen flex items-center justify-center">
          <PacmanLoader />
        </div>
      }
    >
      <motion.div
        initial={{ y: "20px" }}
        animate={{ y: 0 }}
        exit={{ y: "20px" }}
        transition={{ ease: "linear", duration: 0.3 }}
        className="w-full pt-6 flex flex-col max-lg:px-4 gap-4"
      >
        <div className="header">
          <img
            src="/images/header.png"
            alt="header"
            className="w-full aspect-[16/5] object-cover"
          />
          <div className="details flex max-sm:items-center items-end gap-4 h-fit ">
            {user?.profilePhoto ? (
              <img
                src={user?.profilePhoto.url}
                alt={user?.name}
                className="w-[20%] aspect-square rounded-full overflow-hidden border-2 z-[22] md:-mt-[10%] h-[120%] shadow-[0_0_20px_gray]"
              />
            ) : (
              <img
                src="https://github.com/shadcn.png"
                alt={user?.name}
                className="w-[20%] aspect-square rounded-full overflow-hidden border-2 z-[22] md:-mt-[10%] h-[120%] shadow-[0_0_20px_gray]"
              />
            )}
            <div className="flex justify-between items-center flex-1">
              <div className="creds flex flex-col justify-end pb-2 h-full">
                <div className="flex max-lg:flex-col items-start">
                  <p className="font-bold text-xl capitalize mb-1">
                    {user.name}{" "}
                  </p>
                  <p
                    className={`text-sm flex w-fit md:mx-2 px-2 py-1 rounded-lg ${
                      user.role === "Applicant"
                        ? "bg-blue-700/70"
                        : "bg-purple-700"
                    } shadow-[0_0_25px_gray]`}
                  >
                    {user.role}
                  </p>
                </div>
                <p>
                  Id :{" "}
                  <Link to={`/users/${user._id ? user._id : user.id}`}>
                    {user._id ? user._id : user.id}
                  </Link>
                </p>
              </div>
              {isSelfProfile && (
                <Link
                  to="/dashboard/profile/edit"
                  className="auth-button flex items-center gap-2"
                >
                  <span className="max-sm:hidden">Edit</span> <FaEdit />
                </Link>
              )}
            </div>
          </div>
        </div>

        <p className="text-xs italic">Joined on: {user.createdAt && formatDate(user.createdAt)}</p>

        {user.role === 'Applicant' ? <p>Applied for {user?.appliedJobs?.length || 0} jobs</p> : <p>Posted {user?.postedJobs?.length || 0} jobs.</p>}

        <div className="bio flex flex-col w-full ">
          <p className="profile-link">Bio</p>
          <p>{user.bio ? user.bio : "No Bio added."}</p>
        </div>

        {user.role === "Applicant" && (
          <div className="resume w-full flex flex-col ">
            <p className="profile-link">Resume</p>
            {user.resume ? (
              <Link
                to={user.resume.url}
                target="_blank"
                className="hover-effect relative"
              >
                {/* <iframe src={user.resume.url} width="100%" height="600px" type="application/pdf" ></iframe> */}
                <embed src={user.resume.url} width="100%" height="600px" type="application/pdf" />


              </Link>
            ) : (
              <p>No resume added.</p>
            )}
          </div>
        )}

        {user.role === "Employer" && (
          <div className="company flex flex-col w-full rounded-md bg-blue-600/10 py-6">
            <p className="profile-link">Company</p>
            <div className="px-3 flex flex-col">
              {company ? (
                <>
                  <Link
                    to={`/dashboard/companies/${company.name}`}
                    className="flex items-center gap-4"
                  >
                    <img
                      src={company.logo.url}
                      alt={company.name}
                      className="w-12 h-12 rounded-full object-cover border-2 hover:shadow-[0_0_25px_gray]"
                    />
                    <div className="text-xl text-wrap font-bold hover-effect relative w-fit mb-2 pr-8 pb-2 before:h-[1px]">
                      {company.name}
                    </div>
                  </Link>
                  <p className="flex flex-wrap max-w-full text-wrap">{company.description}</p>
                </>
              ) : (
                "No company added."
              )}
            </div>
          </div>
        )}

        <div className="niches flex flex-col w-full ">
          <p className="profile-link">Niches</p>
          <div className="flex flex-wrap gap-2">
            {user.niches.length > 0 ? (
              user.niches.map((niche, index) => (
                <p key={index} className={`flex items-center rounded-xl px-2 py-[1px] z-[12] border ${
                    theme === "dark"
                      ? "bg-slate-900/90 hover:bg-gray-800"
                      : "bg-gray-300 hover:bg-gray-500"
                  } cursor-pointer`}>
                  {niche}
                </p>
              ))
            ) : (
              <p>No niches added.</p>
            )}
          </div>
        </div>

        <div className="skills flex flex-col w-full ">
          <p className="profile-link">Skills</p>
          <div className="flex flex-wrap gap-2">
            {user.skills.length > 0 ? (
              user.skills.map((skills, index) => (
                <p key={index} className={`flex items-center rounded-xl px-2 py-[1px] z-[12] border ${
                    theme === "dark"
                      ? "bg-slate-900/90 hover:bg-gray-800"
                      : "bg-gray-300 hover:bg-gray-500"
                  } cursor-pointer`}>
                  {skills}
                </p>
              ))
            ) : (
              <p>No skills showcased.</p>
            )}
          </div>
        </div>
      </motion.div>
    </Suspense>
  );
};

export default UserProfile;
