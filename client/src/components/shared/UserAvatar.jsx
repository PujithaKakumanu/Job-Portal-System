import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDispatch, useSelector } from "react-redux";
import { HiLogout } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { getInitials } from "@/utils/services";
import { setProgress } from "@/redux/progress/progressSlice";
import { PopoverClose } from "@radix-ui/react-popover";
import { baseUrl } from "@/utils";
import { logout } from "@/redux/user/userSlice";

const UserAvatar = () => {
  const profilePhoto = useSelector((state) => state.user.profilePhoto);
  const theme = useSelector((state) => state.theme.value);
  const token = localStorage.getItem("token");
  if (!token) return null;
  const user = jwtDecode(token);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async() => {
    try{
      dispatch(setProgress(30));
      dispatch(setProgress(70));
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      dispatch(logout());
      dispatch(setProgress(100));
      navigate('/')
    }catch(error){
      console.error(error.message)
    }
  }

  useEffect(()=>{
    dispatch(setProgress(100))
  },[])

  return (
    <Popover sideOffset={5}>
      <PopoverTrigger>
        <Avatar className={`${theme === 'dark' && 'text-black'} hover:shadow-[0_0_25px_gray]`}>
          <AvatarImage src={profilePhoto?.url ? profilePhoto.url : null} />
          <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent className={`z-[99] ${theme === "dark" ? "bg-zinc-900 text-white" : "bg-inherit backdrop-blur-lg"} hover:shadow-[0_0_20px_gray] shadow-gray-700 flex flex-col justify-between`}>
        <PopoverClose asChild><Link to={`/dashboard/profile`} className='w-full py-2 flex items-center justify-center hover:text-slate-600'>View Profile</Link></PopoverClose>
        <PopoverClose asChild><div onClick={()=>handleLogout()} className='w-full py-2 flex items-center justify-center gap-4 border-t hover:text-slate-600'>
            <HiLogout />
            <span>Logout</span>
        </div>
        </PopoverClose>
      </PopoverContent>
    </Popover>
  );
};

export default UserAvatar;
