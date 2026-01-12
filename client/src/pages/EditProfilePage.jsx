import { motion } from "framer-motion";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { useNavigate } from "react-router-dom";
import { setProgress } from "@/redux/progress/progressSlice";
import { baseUrl, jobTitles } from "@/utils";
import { logout, updateUser } from "@/redux/user/userSlice";
import { hasImageChanged } from "@/utils/services";

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Name must be at least 3 characters long.",
  }),
  niches: z.array(z.string()).optional(),
  phone: z
    .string()
    .min(10, {
      message: "Phone number must exactly be 10 characters long.",
    })
    .max(10, {
      message: "Phone number must exactly be 10 characters long.",
    }).refine((value) => {return !isNaN(value)}, {
        message: "Phone number must be a number."
    }),
  bio: z.string().optional(),
});

const EditProfilePage = () => {
  const user = useSelector((state) => state.user);
  const theme = useSelector((state) => state.theme.value);
  const dispatch = useDispatch();

  const [niches, setNiches] = React.useState(user.niches || []);
  const [predictedNiches, setPredictedNiches] = React.useState([]);
  const [error, setError] = React.useState(null);
  const [profilePhoto, setProfilePhoto] = React.useState(
    user.profilePhoto?.url || null
  );

  const navigate = useNavigate();

  //To predict and add niches in the form.
  const handleSearchChange = (e) => {
    setPredictedNiches(() => []);
    jobTitles.filter((title) => {
      if (predictedNiches.length > 4) return;
      if (title.toLowerCase().includes(e.target.value.toLowerCase())) {
        setPredictedNiches((prev) => [...prev, title]);
      }
    });
  };

  //To update the profile photo in form.
  const handleImage = (e) => {
    e.preventDefault();
    const fileReader = new FileReader();
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      if (!file.type.includes("image")) return;

      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || "";
        setProfilePhoto(imageDataUrl);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name || "",
      niches: user.niches || [],
      phone: user.phone || 0,
      bio: user.bio || "",
    },
  });

  const handleEditProfile = async (values) => {
    try {
      dispatch(setProgress(30));
      const formData = new FormData();

      // Append JSON data as a blob
      formData.append("name", values.name);
      formData.append("email", user.email);
      formData.append("phone", values.phone);
      formData.append("bio", values.bio);

      // append niches
      if (niches.length > 0) {
        niches.map((niche) => formData.append("niches", niche));
      }

      // Append the file
      if (user.role === "Applicant") {
        const resume = document.getElementById("resume").files[0] || null;
        if (resume) {
          formData.append("resume", resume);
        }
      }
      const profilePhoto =
        document.getElementById("profilePhoto").files[0] || null;
      if (profilePhoto && hasImageChanged(profilePhoto, user?.profilePhoto?.url || "")) {
        formData.append("profilePhoto", profilePhoto);
      }

      const res = await fetch(`${baseUrl}user/edit`, {
        body: formData,
        method: "POST",
      });
      dispatch(setProgress(60));
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("userData", JSON.stringify(data.user));
        dispatch(() => logout());
        dispatch(() => updateUser(data.user));
        dispatch(setProgress(100));
        navigate("/dashboard/profile");
      } else {
        dispatch(setProgress(100));
        setError(data.message);
      }
    } catch (error) {
      console.log("Error in editProfile", error);
    }
  };

  return (
    <motion.div
      initial={{ y: "20px", opacity: 0.3 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ ease: "linear", duration: 0.5 }}
      className={`mt-[8vh] w-full justify-center rounded-lg flex flex-col items-left md:px-12 px-6 py-4 shadow-[0_0_20px_gray] max-sm:mx-8 transition-all duration-500 bg-gradient-to-b max-w-[40vw] max-lg:min-w-fit mx-8 ${
        user.role === "Employer" ? "from-slate-900/20" : "from-[#43cdef45]"
      } `}
    >
      <p className="font-light py-1 text-2xl">Edit your details.</p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleEditProfile)}
          className="space-y-8 my-4 "
        >
          <FormField
            control={form.control}
            name="name"
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
                      Full Name
                    </label>
                  </div>
                </FormControl>
                <FormMessage className="text-xs font-medium" />
              </FormItem>
            )}
          />

          <div className="flex max-sm:flex-col gap-4 md:gap-8 w-full justify-between ">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <div className="flex flex-col gap-2 relative flex-1">
                      <input
                        type="text"
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

            {user.role === "Applicant" && (
              <div className="resume flex flex-col max-sm:w-full">
                <label htmlFor="resume" className="text-xs">
                  Upload Resume
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  id="resume"
                  className="text-sm file:bg-transparent file:rounded-md"
                />
              </div>
            )}
          </div>

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex flex-col gap-2 relative">
                    <textarea
                      rows={5}
                      id="bio"
                      placeholder="Enter an appealing bio. "
                      className={`block bg-inherit border-[1px] appearance-none rounded-md focus:outline-none p-2 ${
                        theme === "dark"
                          ? "focus:border-white/40"
                          : "focus:border-slate-900"
                      } peer`}
                      {...field}
                    />
                    <label
                      htmlFor="bio"
                      className={`absolute bg-inherit backdrop-blur-md text-sm font-light z-[10] top-2 left-2 -translate-y-5 scale-75 duration-300 transform px-2 peer-focus:top-2 peer-focus:left-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:left-2 peer-focus:scale-75 peer-focus:-translate-y-5 start-1`}
                    >
                      Bio
                    </label>
                  </div>
                </FormControl>
                <FormMessage className="text-xs font-medium" />
              </FormItem>
            )}
          />

          <div className="flex w-full items-center justify-start">
            <div className="label flex h-16 w-auto aspect-square items-center justify-center bg-[#000] rounded-full border-2 overflow-hidden shadow-[0_0_20px_gray] mx-2 !important">
              {profilePhoto ? (
                <img
                  src={profilePhoto}
                  alt="profile_icon"
                  width={96}
                  height={96}
                  className="rounded-full object-cover h-full aspect-square"
                />
              ) : (
                <img
                  src="https://github.com/shadcn.png"
                  alt="profile_icon"
                  width={24}
                  height={24}
                  className="object-cover rounded-full h-full w-full aspect-square"
                />
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              placeholder="Add profile photo"
              id="profilePhoto"
              className="cursor-pointer text-white bg-transparent outline-none file:bg-transparent file:rounded-md !important"
              onChange={(e) => handleImage(e)}
            />
          </div>

          {user.role === "Applicant" && (
            <div className="applicant-only flex flex-col font-light text-sm">
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
          )}

          {error && (
            <p className="text-xs text-red-600 italic w-full pl-4">{error}</p>
          )}

          <button type="submit" className="auth-button w-full">
            Update
          </button>
        </form>
      </Form>
    </motion.div>
  );
};

export default EditProfilePage;
