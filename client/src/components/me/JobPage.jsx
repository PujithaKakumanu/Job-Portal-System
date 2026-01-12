import { motion } from "framer-motion";
import React, { Suspense, useEffect, useState } from "react";
import { PacmanLoader } from "react-spinners";
import JobCard from "../cards/JobCard";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { setProgress } from "@/redux/progress/progressSlice";
import { baseUrl } from "@/utils";
import Pagination from "../shared/Pagination";

const JobPage = ({query, title}) => {
  const [ searchParams ] = useSearchParams()

  const [results, setResults] = useState(null);
  const userId = useSelector(state => state.user.id)

  const [ page, setPage ] = useState(searchParams.get("page") || 1);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchMyJobs = async () => {
      try {
        dispatch(setProgress(50));
        const res = await fetch(`${baseUrl}job/fetchMyJobs?type=${query}&userId=${userId}&page=${page}`);
        const data = await res.json();
        if (data.success) {
          setResults(data);
        } else {
          setResults(null);
        }
        dispatch(setProgress(100));
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchMyJobs();
  }, [page]);

  return (
    <motion.div
      initial={{ y: "20px", opacity: 0.3 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ ease: "linear", duration: 0.3 }}
      className="flex flex-col py-4"
    >
      <p className="text-2xl font-semibold tracking-tighter pb-4">Your {title}</p>
      {<p className="text-sm font-light">You have {title.split(' ')[0]} {(results?.jobs?.length + (( results?.totalPages > 1 && results?.totalPages -1 * 8 ))) || 0 } jobs</p>}

      <div className="jobCardContainer grid items-center grid-cols-1 md:grid-cols-2 max-lg:grid-cols-1 gap-6 my-4">
        <Suspense
          fallback={
            <div className="w-full h-full flex items-center justify-center ">
              <PacmanLoader />
            </div>
          }
        >
          {results?.jobs &&
            results.jobs.length > 0 &&
            results.jobs.map((job, index) => {
              return <JobCard key={index} job={job} />;
            })}
        </Suspense>
      </div>
      {results?.totalPages > 0 && <Pagination totalPages={results?.totalPages} setPage={setPage}/>}
    </motion.div>
  );
};

export default JobPage;
