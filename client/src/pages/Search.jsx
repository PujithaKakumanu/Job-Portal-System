import JobCard from "@/components/cards/JobCard";
import Pagination from "@/components/shared/Pagination";
import Searchbar from "@/components/shared/Searchbar";
import { setProgress } from "@/redux/progress/progressSlice";
import { baseUrl } from "@/utils";
import { motion } from "framer-motion";
import React, { Suspense, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import { PacmanLoader } from "react-spinners";

const Search = () => {
  const [searchParams] = useSearchParams();
  const jobTitle = searchParams.get("jobTitle");
  const location = searchParams.get("location");
  const [ page, setPage ] = useState(parseInt(searchParams.get("page")) || 1);
  const [results, setResults] = useState(null);
  const [refetch, setRefetch] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const params = new URLSearchParams();
    if (jobTitle) params.append("niche", jobTitle);
    if (location) params.append("location", location);
    params.append("page", page);

    const fetchResults = async () => {
      try {
        dispatch(setProgress(50));
        const res = await fetch(`${baseUrl}job/getall?${params.toString()}`);
        const data = await res.json();
        if (data.success) {
          setResults(data);
        } else {
          setResults(null);
        }
        dispatch(setProgress(100));
      } catch (error) {
        console.log(error);
      }
    };
    fetchResults();
  }, [refetch, page]);

  return (
    <motion.div
      initial={{ y: "20px" }}
      animate={{ y: 0 }}
      exit={{ y: "20px" }}
      transition={{ ease: "linear", duration: 0.3 }}
      className="w-full pt-6 flex flex-col items-left gap-4 max-sm:px-4"
    >
      <div className="text-2xl font-bold">Your Search Results.</div>

      <div className="max-lg:w-full w-3/4 pt-2">
        <Searchbar setRefetch={setRefetch} />
      </div>

      {
        <div className="flex max-sm:flex-col justify-between">
         <p> Showing Search Results {jobTitle && `for ${jobTitle}`}{" "}
         {location && `in ${location}`}</p>
         <Link to='/dashboard/search' className="text-sm italic text-blue-500 hover:text-blue-700" onClick={()=>{
            setRefetch(prev => !prev);
         }}>Clear filters</Link>
        </div>
      }

      <div className="resultContainer relative w-full rounded-md min-h-[30vh] grid items-center gap-6 grid-cols-1 md:grid-cols-2">
        <Suspense
          fallback={
            <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full bg-gray-300/40 p-2 rounded-md animate-pulse">
              <PacmanLoader size={100} />
            </div>
          }
        >
          <>
            {" "}
            {results ? (
              <>
                {results.jobs.map((job, index) => {
                  return <JobCard key={index} job={job} />;
                })}
              </>
            ) : (
              <div className="absolute top-0 left-0 ml-2">
                No Results found. Try a different search.
              </div>
            )}
          </>
        </Suspense>
      </div>
      {results && <Pagination totalPages={results.totalPages} setPage={setPage}/>}
    </motion.div>
  );
};

export default Search;
