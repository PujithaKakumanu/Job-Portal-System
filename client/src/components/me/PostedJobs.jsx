import React, { useEffect } from "react";
import JobPage from "./JobPage";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PostedJobs = () => {
  
  const navigate = useNavigate();
  const userRole = useSelector((state) => state.user.role);
  
  useEffect(() => {
    if (userRole !== "Employer") navigate("/dashboard/me");
  }, []);

  return <JobPage query="postedJobs" title="Posted Jobs" />;
};

export default PostedJobs;
