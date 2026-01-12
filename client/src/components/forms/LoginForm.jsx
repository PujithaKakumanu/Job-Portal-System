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
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { setProgress } from "@/redux/progress/progressSlice";
import { baseUrl } from "@/utils";
import { updateUser } from "@/redux/user/userSlice";

const formSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: z.string(),
});

const LoginForm = () => {
  const theme = useSelector((state) => state.theme.value);
  const dispatch = useDispatch();
  const [role, setRole] = React.useState("applicant");
  const [error, setError] = React.useState(null);
  const [passwordVisible, setPasswordVisible] = React.useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (role === "employer") {
      document.querySelector(".roles").classList.add("flip");
    }
  }, []);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (values) => {
    try {
      dispatch(setProgress(30));
      const res = await fetch(`${baseUrl}user/login`, {
        body: JSON.stringify({
          ...values,
          role: role.charAt(0).toUpperCase() + role.slice(1),
        }),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      dispatch(setProgress(60));
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userData", JSON.stringify(data.user));
        dispatch(updateUser(data.user));
        dispatch(setProgress(100));
        navigate("/dashboard");
      } else {
        dispatch(setProgress(100));
        setError(data.message);
      }
    } catch (error) {
      console.log("Error in handleLogin", error);
    }
  };

  const switchRoles = (e, role) => {
    e.preventDefault();
    setRole(role);
    document.querySelector(".roles").classList.toggle("flip");
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
    const passInput = document.getElementById("password");
    passInput.type = passInput.type === "password" ? "text" : "password";
  };

  return (
    <motion.div
      initial={{ y: "20px", opacity: 0.3 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ ease: "linear", duration: 0.5 }}
      className={`rounded-lg flex flex-col items-left md:px-12 px-6 py-4 shadow-[0_0_20px_gray] max-sm:mx-8 transition-all duration-500 bg-gradient-to-b max-w-[40vw] max-lg:min-w-fit mx-8 ${
        role === "employer" ? "from-slate-900/20" : "from-[#43cdef45]"
      } `}
    >
      <h1 className="text-2xl pt-4 font-bold">Welcome to Jobster</h1>
      <p className="font-light py-1">
        Enter your credentials and explore the limitless opportunities.
      </p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleLogin)}
          className="space-y-8 my-4 "
        >
          <FormField
            control={form.control}
            name="email"
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
                      Enter Your Email
                    </label>
                  </div>
                </FormControl>
                <FormMessage className="text-xs font-medium" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex flex-col gap-2 relative">
                    <input
                      type="password"
                      id="password"
                      name="password"
                      placeholder=" "
                      className={`block bg-transparent border-[1px] appearance-none rounded-md focus:outline-none p-2 focus:ring-0  ${
                        theme === "dark"
                          ? "focus:border-white/40"
                          : "focus:border-slate-900"
                      } peer `}
                      {...field}
                    />
                    <label
                      htmlFor="password"
                      className={`absolute bg-inherit backdrop-blur-md text-sm font-light z-[10] top-2 left-2 -translate-y-5 scale-75 duration-300 transform px-2 peer-focus:top-2 peer-focus:left-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:scale-75 peer-focus:-translate-y-5 start-1`}
                    >
                      Enter Your Password
                    </label>
                    {
                      <div
                        className="toggle absolute right-2 translate-y-[70%] font-extralight"
                        onClick={() => togglePasswordVisibility()}
                      >
                        {passwordVisible ? <IoIosEye /> : <IoIosEyeOff />}{" "}
                      </div>
                    }
                  </div>
                </FormControl>
                <FormMessage className="text-xs font-medium " />
              </FormItem>
            )}
          />

          <div className="flex justify-start w-full items-center gap-4 max-sm:gap-2 px-2">
            <p className="font-light max-sm:text-xs">Select Role :</p>
            <div
              className="roles font-light flex items-center justify-center w-fit transition-all duration-500 ease-in relative transform rounded-md border"
              style={{ transformStyle: "preserve-3d" }}
            >
              <button
                className={`role flex items-center px-8 text-sm py-1 z-[2] relative overflow-hidden  border border-gray-700 rounded-md`}
                onClick={(e) => switchRoles(e, "employer")}
                style={{ backfaceVisibility: "hidden" }}
              >
                Applicant
              </button>
              <button
                className={`role absolute top-0 left1/2 flex items-center justify-center px-8 text-sm py-1 z-[-1] overflow-hidden border border-gray-700 rounded-md`}
                onClick={(e) => switchRoles(e, "applicant")}
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                Employer
              </button>
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-600 italic w-full pl-4">{error}</p>
          )}

          <button type="submit" className="decoration-none auth-button w-full">
            Login
          </button>
        </form>
      </Form>
    </motion.div>
  );
};

export default LoginForm;
