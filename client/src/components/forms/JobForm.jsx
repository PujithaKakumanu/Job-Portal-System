import { setProgress } from "@/redux/progress/progressSlice";
import { motion } from "framer-motion";
import React, { Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { PacmanLoader } from "react-spinners";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { baseUrl, jobTitles } from "@/utils";
import { updateUser } from "@/redux/user/userSlice";

const formSchema = z.object({
  jobTitle: z.string().min(3, {
    message: "Job Title must be at least 3 characters long.",
  }),
  noOfOpenings: z.any(),
  jobLocation: z.string().optional(),
  salary: z.string().optional(),
  jobDescription: z.string().min(100, {
    message: "Job Description must be at least 100 characters long.",
  }),
});

const JobForm = ({  purpose = "Post", jobId = "" }) => {
  const theme = useSelector((state) => state.theme.value);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const { id } = useParams();

  const [error, setError] = React.useState(null);
  const [niches, setNiches] = React.useState([]);
  const [predictedNiches, setPredictedNiches] = React.useState([]);

  const [defaultJobFormValues, setDefaultJobFormValues] = useState({
    jobTitle: "",
    jobLocation: "",
    noOfOpenings: "",
    salary: "",
    jobDescription: "",
  });

  //To predict and add niches in the form.
  const handleSearchChange = (e) => {
    setPredictedNiches([]);
    jobTitles.filter((title) => {
      if (predictedNiches.length > 4) return;
      if (title.toLowerCase().includes(e.target.value.toLowerCase())) {
        setPredictedNiches((prev) => [...prev, title]);
      }
    });
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: defaultJobFormValues,
  });

  const handlePostJob = async (values) => {
    try {
      dispatch(setProgress(30));
      const formData = new FormData();

      formData.append("title", values.jobTitle);
      formData.append("noOfOpenings", values.noOfOpenings);
      formData.append("salary", values.salary);
      formData.append("description", values.jobDescription);
      formData.append("location", values.jobLocation);
      formData.append("company", user.company);
      formData.append("postedBy", user.id);
      formData.append("jobId", jobId);

      // append niches
      if (niches.length > 0) {
        niches.map((niche) => formData.append("niches", niche));
      }

      const res = await fetch(`${baseUrl}job/post`, {
        body: formData,
        method: "POST",
      });
      dispatch(setProgress(60));
      const data = await res.json();
      if (data.success) {
        dispatch(setProgress(100));
        dispatch(updateUser(data.user));
        navigate(`/dashboard/jobs/${data.job._id}`);
      } else {
        dispatch(setProgress(100));
        setError(data.message);
      }
    } catch (error) {
      console.log("Error in adding company", error);
    }
  };

  useEffect(() => {
    dispatch(setProgress(50));
    if (user.role !== "Employer") navigate("/dashboard");
    if (purpose === "Post" && !user.company) navigate("/dashboard/add-company");

    if (purpose === "Edit") {
      const fetchJob = async () => {
        try {
          dispatch(setProgress(50));
          const res = await fetch(`${baseUrl}job/get/${id}`);
          const data = await res.json();
          if (data.success) {
            form.reset({
              jobTitle: data.job.title,
              jobDescription: data.job.description,
              jobLocation: data.job.location || "",
              salary: data.job.salary,
              noOfOpenings: data.job.noOfOpenings,
            });
            setNiches(data.job.niches);
          }
          dispatch(setProgress(100));
        } catch (error) {
          console.log(error);
        }
      };
      fetchJob();
    }
    dispatch(setProgress(100));
  }, [form.reset]);

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
        className="w-full pt-6 flex flex-col max-lg:px-4"
      >
        <p className="text-3xl font-bold">{purpose} Job</p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handlePostJob)}
            className="space-y-8 my-8 mx-4 "
          >
            <FormField
              control={form.control}
              name="jobTitle"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex flex-col gap-2 relative">
                      <input
                        type="text"
                        id="title"
                        placeholder=" "
                        className={`block bg-inherit border-[1px] appearance-none rounded-md focus:outline-none p-2 ${
                          theme === "dark"
                            ? "focus:border-white/40"
                            : "focus:border-slate-900"
                        } peer`}
                        {...field}
                      />
                      <label
                        htmlFor="title"
                        className={`absolute bg-inherit backdrop-blur-md text-sm font-light z-[10] top-2 left-2 -translate-y-5 scale-75 duration-300 transform px-2 peer-focus:top-2 peer-focus:left-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:scale-75 peer-focus:-translate-y-5 start-1`}
                      >
                        Job Title
                      </label>
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs font-medium" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="jobLocation"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex flex-col gap-2 relative">
                      <input
                        type="text"
                        id="location"
                        placeholder=" "
                        className={`block bg-inherit border-[1px] appearance-none rounded-md focus:outline-none p-2 ${
                          theme === "dark"
                            ? "focus:border-white/40"
                            : "focus:border-slate-900"
                        } peer`}
                        {...field}
                      />
                      <label
                        htmlFor="location"
                        className={`absolute bg-inherit backdrop-blur-md text-sm font-light z-[10] top-2 left-2 -translate-y-5 scale-75 duration-300 transform px-2 peer-focus:top-2 peer-focus:left-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:scale-75 peer-focus:-translate-y-5 start-1`}
                      >
                        Job Location
                      </label>
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs font-medium" />
                </FormItem>
              )}
            />

            <div className="number-salary flex max-sm:flex-col gap-4 w-full justify-between">
              <FormField
                control={form.control}
                name="noOfOpenings"
                render={({ field }) => (
                  <FormItem className="md:w-1/2">
                    <FormControl>
                      <div className="flex flex-col gap-2 relative flex-1">
                        <input
                          type="number"
                          id="noOfOpenings"
                          placeholder=" "
                          className={`block bg-inherit border-[1px] appearance-none rounded-md focus:outline-none p-2 ${
                            theme === "dark"
                              ? "focus:border-white/40"
                              : "focus:border-slate-900"
                          } peer`}
                          {...field}
                        />
                        <label
                          htmlFor="noOfOpenings"
                          className={`absolute bg-inherit backdrop-blur-md text-sm font-light z-[10] top-2 left-2 -translate-y-5 scale-75 duration-300 transform px-2 peer-focus:top-2 peer-focus:left-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:scale-75 peer-focus:-translate-y-5 start-1`}
                        >
                          Number of Openings
                        </label>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs font-medium" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="salary"
                render={({ field }) => (
                  <FormItem className="md:w-1/2">
                    <FormControl>
                      <div className="flex flex-col relative">
                        <input
                          type="text"
                          id="salary"
                          placeholder=" "
                          className={`block bg-inherit border-[1px] appearance-none rounded-md focus:outline-none p-2 ${
                            theme === "dark"
                              ? "focus:border-white/40"
                              : "focus:border-slate-900"
                          } peer`}
                          {...field}
                        />
                        <label
                          htmlFor="salary"
                          className={`absolute bg-inherit backdrop-blur-md text-sm font-light z-[10] top-2 left-2 -translate-y-5 scale-75 duration-300 transform px-2 peer-focus:top-2 peer-focus:left-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:scale-75 peer-focus:-translate-y-5 start-1`}
                        >
                          Salary Offered (₹)
                        </label>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs font-medium" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="jobDescription"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex flex-col relative">
                      <textarea
                        type="text"
                        rows={9}
                        id="description"
                        placeholder=" "
                        className={`block bg-inherit border-[1px] appearance-none rounded-md focus:outline-none p-2 ${
                          theme === "dark"
                            ? "focus:border-white/40"
                            : "focus:border-slate-900"
                        } peer`}
                        {...field}
                      />
                      <label
                        htmlFor="description"
                        className={`absolute bg-inherit backdrop-blur-md text-sm font-light z-[10] top-2 left-2 -translate-y-5 scale-75 duration-300 transform px-2 peer-focus:top-2 peer-focus:left-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:scale-75 peer-focus:-translate-y-5 start-1`}
                      >
                        Job Description
                      </label>
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs font-medium" />
                </FormItem>
              )}
            />

            <div className="niches flex flex-col font-light text-sm">
              <div className="flex gap-2 pb-4">
                {niches.map((niche, idx) => {
                  return (
                    <div
                      key={idx}
                      onClick={(e) => {
                        const niche = e.target.innerText;
                        const newNiches = niches.filter((nic) => nic !== niche);
                        setNiches(newNiches);
                      }}
                      className={`flex items-center rounded-xl px-2 py-[1px] text-xs border ${
                        theme === "dark"
                          ? "bg-slate-900/90 hover:bg-gray-600"
                          : "bg-gray-300 hover:bg-gray-400"
                      } cursor-pointer`}
                    >
                      {niche}
                    </div>
                  );
                })}
              </div>
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  id="nicheInput"
                  placeholder="Search for niches"
                  onChange={(e) => handleSearchChange(e)}
                  className="bg-transparent outline-none w-full text-sm py-1 z-[12] focus:border-b border-blue-500"
                />
                <div className="flex flex-col bottom-0 left-0">
                  {predictedNiches.length > 0 &&
                    predictedNiches.slice(0, 4).map((niche, index) => {
                      return (
                        <div
                          onClick={() => {
                            setNiches([...niches, niche]);
                            setPredictedNiches([]);
                            document.getElementById("nicheInput").value = "";
                          }}
                          key={index}
                          className="text-sm z-[12] rounded-md hover:bg-gray-300/40 hover:border-b border-teal-500 cursor-pointer"
                        >
                          {niche}
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-600 italic w-full pl-4">{error}</p>
            )}

            <button type="submit" className="auth-button w-full">
              {purpose} Job
            </button>
          </form>
        </Form>
      </motion.div>
    </Suspense>
  );
};

export default JobForm;
