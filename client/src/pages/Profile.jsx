import UserProfile from "@/components/UserProfile";
import { setProgress } from "@/redux/progress/progressSlice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = localStorage.getItem("token") || null;
  if (!token) navigate("/auth?redirect=true");
  const user = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(setProgress(100));
  }, []);

  return (
    <UserProfile user={user} />
  );
};

export default Profile;
