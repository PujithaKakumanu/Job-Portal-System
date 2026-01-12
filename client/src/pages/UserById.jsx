import Navbar from "@/components/shared/Navbar";
import UserProfile from "@/components/UserProfile";
import { setProgress } from "@/redux/progress/progressSlice";
import { baseUrl } from "@/utils";
import React, { useEffect } from "react";
import { FaHome } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

const UserById = () => {
  const { userId } = useParams();
  const [user, setUser] = React.useState(null);

  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.value);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        dispatch(setProgress(100));
        const res = await fetch(`${baseUrl}user/${userId}`);
        const data = await res.json();
        if (data.success) setUser(data.user);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchUser();
  }, []);
  return (
    <div className={`flex justify-center items-start w-screen min-h-screen ${theme === 'dark' ? 'bg-zinc-900 text-white' : 'bg-gradient-to-r from-transparent to-gray-900/30'}`}>
        <Navbar otherClasses="fixed top-0">
            <Link to="/dashboard" className="flex items-center gap-2">
                <FaHome />
                Dashboard
            </Link>
        </Navbar>
      {user ? (
        <div className="flex md:max-w-[60%] mt-[8vh]"><UserProfile user={user} /></div>
      ) : (
        <p className="text-center">User not found</p>
      )}
    </div>
  );
};

export default UserById;
