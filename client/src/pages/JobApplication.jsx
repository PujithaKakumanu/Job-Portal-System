import { setProgress } from "@/redux/progress/progressSlice";
import { updateUser } from "@/redux/user/userSlice";
import { baseUrl } from "@/utils";
import { motion } from "framer-motion";
import React, { Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { PacmanLoader } from "react-spinners";

const JobApplication = () => {
  const [coverLetter, setCoverLetter] = React.useState("");
  const [error, setError] = React.useState("");
  const theme = useSelector((state) => state.theme.value);
  const userId = useSelector((state) => state.user.id);
  const user = useSelector((state) => state.user);
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

 useEffect(() => {
    if(user.appliedJobs.includes(id)) {
        alert("You have already applied for this job.");
        navigate(`/dashboard/jobs/${id}`);
        }
 },[])
    
 if(user.role === "Employer") {
    navigate(`/dashboard/jobs/${id}/applicants`);
 }

  const sendApplication = async (e) => {
    e.preventDefault();
    if (coverLetter.length < 100) {
      setError("Cover Letter must be at least 100 characters long.");
      return;
    }
    try {
      dispatch(setProgress(50));
      const res = await fetch(`${baseUrl}job/apply`, {
        method: "POST",
        body: JSON.stringify({ userId, jobId: id, coverLetter }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("userData", JSON.stringify(data.user));
        dispatch(updateUser(data.user));
        navigate(`/dashboard/jobs/${id}`);
      }
      dispatch(setProgress(100));
    } catch (error) {
      console.log(error.message);
    }
  };

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
        <p className="text-2xl font-bold">Job Application Form</p>

        <form>
          <div className="flex flex-col relative m-4">
            <textarea
              type="text"
              rows={6}
              id="coverLetter"
              placeholder="Describe how would you be a great fit for this role also include your experience and skills."
              className={`block bg-inherit border-[1px] appearance-none border-gray-500/40 rounded-md focus:outline-none p-2 ${
                theme === "dark"
                  ? "focus:border-gray-400/40"
                  : "focus:border-slate-900"
              } peer`}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
            />
            <label
              htmlFor="coverLetter"
              className={`absolute bg-inherit backdrop-blur-md text-sm font-light z-[10] top-2 left-2 -translate-y-5 scale-75 duration-300 transform px-2 peer-focus:top-2 peer-focus:left-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-0 peer-focus:scale-75 peer-focus:-translate-y-5 start-1`}
            >
              Write a Cover Letter.
            </label>
            {error && <p className="text-sm italic text-red-600">{error}</p>}
          </div>

            <button onClick={sendApplication} className="auth-button">Send Application</button>
        </form>
      </motion.div>
    </Suspense>
  );
};

export default JobApplication;
