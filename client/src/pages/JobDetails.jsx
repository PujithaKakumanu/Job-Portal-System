import SaveButton from "@/components/shared/SaveButton";
import { setProgress } from "@/redux/progress/progressSlice";
import { baseUrl } from "@/utils";
import { motion } from "framer-motion";
import React, { useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { PacmanLoader } from "react-spinners";

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  let matchingNiches = 0;

  const user = useSelector((state) => state.user);
  const theme = useSelector((state) => state.theme.value);

  const dispatch = useDispatch();

  const isAuthor = user.id.toString() === job?.postedBy

  useEffect(() => {
    dispatch(setProgress(50));
    const fetchJob = async () => {
      try {
        const res = await fetch(`${baseUrl}job/get/${id}`);
        dispatch(setProgress(70));
        const data = await res.json();
        if (data.success) {
          setJob(data.job);
          setLoading(false);
        }
        dispatch(setProgress(100));
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchJob();
  }, []);

  return (
    <motion.div
      initial={{ y: "20px" }}
      animate={{ y: 0 }}
      exit={{ y: "20px" }}
      transition={{ ease: "linear", duration: 0.3 }}
      className="w-full pt-6 flex flex-col items-left gap-4 max-sm:px-4"
    >
      {loading ? (
        <div className="h-screen w-full flex items-center justify-center">
          <PacmanLoader />
        </div>
      ) : (
        <div className="jobDetails flex flex-col w-full items-left gap-4">
          <div className="flex justify-between py-3 items-center">
            <h1 className="text-2xl font-bold drop-shadow-lg shadow-gray-500">
              {job.title}
            </h1>
            {user.role === "Applicant" ? (
              <SaveButton />
            ) : (
              user?.id === job?.postedBy && (
                <Link
                  to={`/dashboard/jobs/${job._id}/edit`}
                  className="hover:shadow-[0_0_25px_gray] border px-3 rounded-md flex items-center justify-center gap-2"
                >
                  <FaEdit /> Edit
                </Link>
              )
            )}
          </div>
          <div className="companyDetails flex flex-col w-full gap-2 py-2 rounded-md bg-blue-500/10">
            <Link
              to={`/dashboard/companies/${job.company.name}`}
              className="logo profile-link flex items-center "
            >
              <img
                src={job.company.logo.url}
                alt={job.company.name}
                className={`w-20 h-10 rounded-full object-contain flex items-center hover:shadow-[0_0_25px_gray] mr-4 ${
                  theme === "dark" && "hover-effect-dark"
                }`}
              />
              <p className="">{job.company.name}</p>
            </Link>
            <Link
              to={`/dashboard/companies/${job.company.name}`}
              className={`group hover-effect text-sm py-1 ${
                theme === "dark" && "hover-effect-dark"
              }`}
            >
              {job.company.description}

              <span className="group-hover:text-blue-900/70"> ...see more</span>
            </Link>
          </div>
          <div className="jobDescription flex w-full flex-col gap-4">
            <p className="profile-link">Job Description</p>
            <p className=" text-justify">{job.description}</p>
          </div>

          <div className="niches flex w-full flex-col gap-4">
            <p className="profile-link">Niches</p>
            <div className="flex gap-4">
              {job.niches.map((niche, index) => {
                const hasNiche =
                  user.role === "Applicant" && user?.niches.includes(niche);
                hasNiche && (matchingNiches = matchingNiches + 1);
                return (
                  <p
                    key={index}
                    className={`bg-blue-700/10 rounded-lg border px-2 py-1 ${
                      hasNiche && "bg-green-400/70"
                    }`}
                  >
                    {niche}
                  </p>
                );
              })}
            </div>
            {user.role === "Applicant" && (
              <p>
                You have {matchingNiches} niches matching out of{" "}
                {job?.niches?.length || 0} niches.
              </p>
            )}
          </div>

          <div className="location flex w-full flex-col gap-4">
            <p className="profile-link">Location</p>
            <p className=" text-justify">
              {job.location || job.company.location || "Not Provided"}
            </p>
          </div>

          <div className="salary flex w-full flex-col gap-4">
            <p className="profile-link">Salary Range</p>
            <p className=" text-justify">{job.salary + " INR"}</p>
          </div>

            {isAuthor && <div className="applications flex w-full flex-col gap-4">
            <p className="profile-link">Applications</p>
            <p className=" text-justify">{job.applications.length || 0} applications recieved till now.</p>
            <Link to={`/dashboard/jobs/${job._id}/applicants`} className="auth-button w-fit flex px-6 py-2 shadow-[0_0_25px_gray]">View Applications</Link>
              </div>}

          {user.role === "Applicant" && !user.appliedJobs.includes(job._id) && (
            <Link
              to={`/dashboard/jobs/${job._id}/apply`}
              className="py-2 px-8 rounded-md flex w-fit auth-button"
            >
              Apply <span className="max-sm:hidden">&nbsp;to this job</span>
            </Link>
          )}

          {user?.appliedJobs.includes(job._id) && <p className="text-sm italic">Already applied to this job.</p>}
        </div>
      )}
    </motion.div>
  );
};

export default JobDetails;
