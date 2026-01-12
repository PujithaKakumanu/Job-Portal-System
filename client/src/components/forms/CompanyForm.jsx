import { motion } from "framer-motion";
import React, { Suspense } from "react";
import { CiRollingSuitcase } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
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
import { baseUrl } from "@/utils";
import { setProgress } from "@/redux/progress/progressSlice";
import { useNavigate } from "react-router-dom";
import { updateUser } from "@/redux/user/userSlice";

const formSchema = z.object({
  companyEmail: z.string().email("Invalid email address."),
  companyName: z.string().min(3, {
    message: "Company Name must be at least 3 characters long.",
  }),
  companyPhone: z
    .string()
    .min(10, {
      message: "Phone number must exactly be 10 characters long.",
    })
    .max(10, {
      message: "Phone number must exactly be 10 characters long.",
    }),
  companyWebsite: z.string().url("Invalid URL"),
  companyAddress: z.string().min(10, {
    message: "Company Address must be at least 10 characters long.",
  }),
  companyDescription: z.string().min(100, {
    message: "Company Description must be at least 100 characters long.",
  }),
});

const CompanyForm = () => {
  const theme = useSelector((state) => state.theme.value);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  if (user.role !== "Employer" || user.company) navigate("/dashboard");

  const [error, setError] = React.useState(null);
  const [companyLogo, setCompanyLogo] = React.useState(null);

  //To update the profile photo in form.
  const handleImage = (e) => {
    e.preventDefault();
    const fileReader = new FileReader();
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      if (!file.type.includes("image")) return;

      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || "";
        setCompanyLogo(imageDataUrl);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyEmail: "",
      companyName: "",
      companyPhone: "",
      companyWebsite: "",
      companyAddress: "",
      companyDescription: "",
    },
  });

  const handleAddCompany = async (values) => {
    try {
      dispatch(setProgress(30));
      const formData = new FormData();

      // Append JSON data as a blob
      formData.append("email", values.companyEmail);
      formData.append("name", values.companyName);
      formData.append("phone", values.companyPhone);
      formData.append("website", values.companyWebsite);
      formData.append("address", values.companyAddress);
      formData.append("description", values.companyDescription);
      formData.append("admin", user.id);

      const companyLogo =
        document.getElementById("companyLogo").files[0] || null;
      if (companyLogo) {
        formData.append("logo", companyLogo);
      } else {
        dispatch(setProgress(100));
        setError("Please upload a company logo.");
        return;
      }

      const res = await fetch(`${baseUrl}company/add`, {
        body: formData,
        method: "POST",
      });
      dispatch(setProgress(60));
      const data = await res.json();
      if (data.success) {
        dispatch(setProgress(100));
        dispatch(updateUser(data.user));
        navigate("/dashboard");
      } else {
        dispatch(setProgress(100));
        setError(data.message);
      }
    } catch (error) {
      console.log("Error in adding company", error);
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
        className="w-full pt-6 flex flex-col max-lg:px-4"
      >
        <p className="text-3xl font-bold">Add Company Details</p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleAddCompany)}
            className="space-y-8 my-8 mx-4 "
          >
            <FormField
              control={form.control}
              name="companyEmail"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex flex-col gap-2 relative">
                      <input
                        type="email"
                        id="email"
                        placeholder=" "
                        className={`block bg-inherit border-[1px] appearance-none rounded-md focus:outline-none p-2 ${
                          theme === "dark"
                            ? "focus:border-white/40"
                            : "focus:border-slate-900"
                        } peer`}
                        {...field}
                      />
                      <label
                        htmlFor="email"
                        className={`absolute bg-inherit backdrop-blur-md text-sm font-light z-[10] top-2 left-2 -translate-y-5 scale-75 duration-300 transform px-2 peer-focus:top-2 peer-focus:left-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:scale-75 peer-focus:-translate-y-5 start-1`}
                      >
                        Enter Your Company Email
                      </label>
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs font-medium" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex flex-col gap-2 relative">
                      <input
                        type="text"
                        id="name"
                        placeholder=" "
                        className={`block bg-inherit border-[1px] appearance-none rounded-md focus:outline-none p-2 ${
                          theme === "dark"
                            ? "focus:border-white/40"
                            : "focus:border-slate-900"
                        } peer`}
                        {...field}
                      />
                      <label
                        htmlFor="name"
                        className={`absolute bg-inherit backdrop-blur-md text-sm font-light z-[10] top-2 left-2 -translate-y-5 scale-75 duration-300 transform px-2 peer-focus:top-2 peer-focus:left-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:scale-75 peer-focus:-translate-y-5 start-1`}
                      >
                        Company Name
                      </label>
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs font-medium" />
                </FormItem>
              )}
            />

            <div className="phone-web flex max-sm:flex-col gap-4 w-full justify-between">
              <FormField
                control={form.control}
                name="companyPhone"
                render={({ field }) => (
                  <FormItem className="md:w-1/2">
                    <FormControl>
                      <div className="flex flex-col gap-2 relative flex-1">
                        <input
                          type="number"
                          id="phone"
                          placeholder=" "
                          className={`block bg-inherit border-[1px] appearance-none rounded-md focus:outline-none p-2 ${
                            theme === "dark"
                              ? "focus:border-white/40"
                              : "focus:border-slate-900"
                          } peer`}
                          {...field}
                        />
                        <label
                          htmlFor="phone"
                          className={`absolute bg-inherit backdrop-blur-md text-sm font-light z-[10] top-2 left-2 -translate-y-5 scale-75 duration-300 transform px-2 peer-focus:top-2 peer-focus:left-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:scale-75 peer-focus:-translate-y-5 start-1`}
                        >
                          Mobile Number
                        </label>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs font-medium" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="companyWebsite"
                render={({ field }) => (
                  <FormItem className="md:w-1/2">
                    <FormControl>
                      <div className="flex flex-col relative">
                        <input
                          type="text"
                          id="website"
                          placeholder=" "
                          className={`block bg-inherit border-[1px] appearance-none rounded-md focus:outline-none p-2 ${
                            theme === "dark"
                              ? "focus:border-white/40"
                              : "focus:border-slate-900"
                          } peer`}
                          {...field}
                        />
                        <label
                          htmlFor="website"
                          className={`absolute bg-inherit backdrop-blur-md text-sm font-light z-[10] top-2 left-2 -translate-y-5 scale-75 duration-300 transform px-2 peer-focus:top-2 peer-focus:left-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:scale-75 peer-focus:-translate-y-5 start-1`}
                        >
                          Company Website
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
              name="companyAddress"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex flex-col relative">
                      <input
                        type="text"
                        id="address"
                        placeholder=" "
                        className={`block bg-inherit border-[1px] appearance-none rounded-md focus:outline-none p-2 ${
                          theme === "dark"
                            ? "focus:border-white/40"
                            : "focus:border-slate-900"
                        } peer`}
                        {...field}
                      />
                      <label
                        htmlFor="address"
                        className={`absolute bg-inherit backdrop-blur-md text-sm font-light z-[10] top-2 left-2 -translate-y-5 scale-75 duration-300 transform px-2 peer-focus:top-2 peer-focus:left-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:scale-75 peer-focus:-translate-y-5 start-1`}
                      >
                        Company Address
                      </label>
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs font-medium" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companyDescription"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex flex-col relative">
                      <textarea
                        type="text"
                        rows={5}
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
                        Company Description
                      </label>
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs font-medium" />
                </FormItem>
              )}
            />

            <div className="logo flex w-full items-center justify-start">
              <div className="label flex h-16 w-auto aspect-square items-center justify-center bg-[#000] rounded-full border-2 overflow-hidden shadow-[0_0_20px_gray] mx-2 !important">
                {companyLogo ? (
                  <img
                    src={companyLogo}
                    alt="company logo"
                    width={96}
                    height={96}
                    className="rounded-full object-cover h-full aspect-square"
                  />
                ) : (
                  <CiRollingSuitcase size={125} color="fff" />
                )}
              </div>

              <input
                type="file"
                accept="image/*"
                placeholder="Add profile photo"
                id="companyLogo"
                className="cursor-pointer text-white bg-transparent outline-none file:bg-transparent file:rounded-md !important"
                onChange={(e) => handleImage(e)}
              />
            </div>

            {error && (
              <p className="text-xs text-red-600 italic w-full pl-4">{error}</p>
            )}

            <button type="submit" className="auth-button w-full">
              Add Company
            </button>
          </form>
        </Form>
      </motion.div>
    </Suspense>
  );
};

export default CompanyForm;
