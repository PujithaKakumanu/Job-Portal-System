import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { baseUrl } from "@/utils";
import { logout, updateUser } from "@/redux/user/userSlice";

const SaveButton = () => {
  const { id } = useParams();
  const user = useSelector((state) => state.user);
  const [saved, setSaved] = useState(user?.savedJobs?.includes(id));
  const dispatch = useDispatch();

  useEffect(() => {}, [saved]);

  const toggleSave = async () => {
    try {
      setSaved(!saved);
      const res = await fetch(`${baseUrl}job/toggleSave`, {
        method: "POST",
        body: JSON.stringify({ userId: user.id, jobId: id }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.success) {
        dispatch(logout());
        localStorage.setItem("userData", JSON.stringify(data.user));
        dispatch(updateUser(data.user));
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <>
      {saved ? (
        <FaBookmark
          onClick={() => toggleSave()}
          className="text-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
        />
      ) : (
        <FaRegBookmark
          onClick={() => toggleSave()}
          className="text-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
        />
      )}
    </>
  );
};

export default SaveButton;
