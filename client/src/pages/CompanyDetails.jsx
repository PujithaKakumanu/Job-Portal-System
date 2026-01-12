import { setProgress } from "@/redux/progress/progressSlice";
import { baseUrl } from "@/utils";
import { motion } from "framer-motion";
import React, { Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PacmanLoader } from "react-spinners";

const Company = () => {
  const { name } = useParams();
  const navigate = useNavigate();

  const [company, setCompany] = React.useState(null);

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) navigate("/auth");
    const fetchCompany = async () => {
      try {
        dispatch(setProgress(50));
        const res = await fetch(`${baseUrl}company/name/${name}`);
        const data = await res.json();
        if (data.success) setCompany(data.company[0]);
        else setCompany({ error: true });
        dispatch(setProgress(100));
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchCompany();
  }, []);

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
        {!company && <div className="text-center w-full h-screen flex items-center justify-center"><PacmanLoader/></div>}

        {company?.error && <p className="text-center">Company Not found</p>}

        {company && (
          <div className="companyCard flex flex-col gap-4">
            <div className="header">
              <img
                src="/images/header.png"
                alt="header"
                className="w-full aspect-[16/5] object-cover"
              />
              <div className="details flex items-end gap-4 h-fit ">
                {company?.logo ? (
                  <img
                    src={company?.logo.url}
                    alt={company?.name}
                    className="w-[20%] aspect-square rounded-full overflow-hidden border-2 z-[22] -mt-[10%] h-[120%] shadow-[0_0_20px_gray]"
                  />
                ) : (
                  <img
                    src="/images/placeholder-job.png"
                    alt={company?.name}
                    className="w-[20%] aspect-square rounded-full overflow-hidden border-2 z-[22] -mt-[10%] h-[120%] shadow-[0_0_20px_gray]"
                  />
                )}
                <div className="flex flex-col justify-between items-start pl-2 flex-1">
                  <p className="font-bold text-2xl capitalize mb-1">
                    {company.name}{" "}
                  </p>
                  <div>
                    Id :{" "}
                    <Link to={`/dashboard/companies/${company.name}`}>
                      {company._id}
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full flex flex-col">
              <p className="profile-link">Description</p>
              <p className="text-md overflow-hidden">{company.description || 'Nothing to sbhow'}</p>
            </div>

            <div className="admin-details flex flex-col py-4 bg-blue-600/10 rounded-md">
              <p className="profile-link">Admin</p>
              <div className="flex items-center gap-4 px-6">
                {company?.admin?.profilePhoto ? (
                  <img
                    src={company?.admin?.profilePhoto.url}
                    alt={company?.admin?.name}
                    className="w-[10%] aspect-square rounded-full border shadow-[0_0_25px_gray]"
                  />
                ) : (
                  <img
                    src="/images/placeholder-job.png"
                    alt={company?.admin?.name}
                    className="w-[10%]"
                  />
                )}
                <div className="flex flex-col justify-center items-start pl-2 flex-1">
                  <p className="font-bold text-xl capitalize mb-1">
                    {company.admin.name}{" "}
                  </p>
                  <div>
                    Id :{" "}
                    <Link to={`/users/${company.admin._id}`}>
                      {company.admin._id}
                    </Link>
                  </div>
                  <div className="text-sm italic">{company.admin.email}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </Suspense>
  );
};

export default Company;
