import React from "react";

import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";
import { jobTitles } from "@/utils";

const Searchbar = ({setRefetch = ()=>{}}) => {
  const theme = useSelector((state) => state.theme.value);
  const navigate = useNavigate();

  const [jobTitle, setJobTitle] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [predictedJobs, setPredictedJobs] = React.useState([]);
  const [predictedLocations, setPredictedLocations] = React.useState([]);

  const handleSearchChange = (e) => {
    setJobTitle(e.target.value);
    setPredictedJobs([]);
    jobTitles.filter((title) => {
      if (predictedJobs.length > 4) return;
      if (title.toLowerCase().includes(e.target.value.toLowerCase())) {
        setPredictedJobs((prev) => [...prev, title]);
      }
    });
  };

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
    setPredictedLocations([]);
    const username = "armin1723";

    if (location.length < 2) return;
    fetch(
      `http://api.geonames.org/searchJSON?name_startsWith=${location}&maxRows=5&username=${username}&sort=population`
    )
      .then((response) => response.json())
      .then((data) => {
        const cities = data.geonames.map(
          (city) => `${city.name},${city?.countryCode}`
        );
        setPredictedLocations(cities);
      })
      .catch((error) => console.error("Error:", error));
  };

  return (
    <div
      className={`searchbar rounded-2xl flex border border-slate-500 z-[12] max-lg:flex-col items-start gap-1 p-2 px-4 max-lg:w-full ${
        theme === "dark" && "bg-slate-900/90"
      }`}
    >
      <div className="flex flex-col ">
        <input
          type="text"
          placeholder="Search for jobs"
          value={jobTitle}
          onChange={(e) => handleSearchChange(e)}
          className="bg-transparent outline-none w-full text-sm py-1 z-[12] focus:border-b border-blue-500"
        />
        <div className="flex flex-col bottom-0 left-0">
          {predictedJobs.length > 0 &&
            predictedJobs.slice(0, 4).map((job, index) => {
              return (
                <div
                  onClick={() => {
                    setJobTitle(job);
                    setPredictedJobs([]);
                  }}
                  key={index}
                  className="text-sm z-[12] rounded-md hover:bg-gray-300/40 hover:border-b border-teal-500 cursor-pointer"
                >
                  {job}
                </div>
              );
            })}
        </div>
      </div>
      <div className="flex items-start max-lg:gap-12 justify-between flex-1 max-lg:w-full gap-4 z-[12]">
        <div className="flex flex-col ">
          <input
            type="text"
            placeholder="Enter your location"
            value={location}
            onChange={(e) => handleLocationChange(e)}
            className="bg-transparent outline-none w-full text-sm py-1 z-[12] focus:border-b border-blue-500"
          />
          <div className="flex flex-col bottom-0 left-0">
            {predictedLocations.length > 0 &&
              predictedLocations.slice(0, 4).map((location, index) => {
                return (
                  <div
                    onClick={() => {
                      setLocation(location);
                      setPredictedLocations([]);
                    }}
                    key={index}
                    className="text-sm z-[12] rounded-md hover:bg-gray-300/40 hover:border-b border-teal-500 cursor-pointer"
                  >
                    {location}
                  </div>
                );
              })}
          </div>
        </div>
        <button
          disabled={jobTitle.length < 2 && location.length < 2}
          onClick={() => {
            setRefetch((prev) => !prev);
            const params = new URLSearchParams();
            if (jobTitle) params.append("jobTitle", jobTitle);
            if (location) params.append("location", location);
            return navigate(
              `/dashboard/search?${params.toString()}`,
            );
          }}
          className="p-2 rounded-full bg-gray-500/60 disabled:cursor-not-allowed"
        >
          <FaSearch />
        </button>
      </div>
    </div>
  );
};

export default Searchbar;
