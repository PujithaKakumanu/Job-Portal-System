import React, { useEffect } from "react";

import { BrowserRouter, Link, Outlet, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Auth from "./pages/Auth";

import LoginForm from "./components/forms/LoginForm";
import RegisterForm from "./components/forms/RegisterForm";
import Dashboard from "./pages/Dashboard";
import LocomotiveScroll from "locomotive-scroll";
import Search from "./pages/Search";
import JobDetails from "./pages/JobDetails";
import Profile from "./pages/Profile";
import CompanyDetails from "./pages/CompanyDetails";
import HomeComponent from "./components/dashboard/HomeComponent";
import Me from "./components/dashboard/Me";
import LoadingBar from "react-top-loading-bar";
import { useDispatch, useSelector } from "react-redux";
import { setProgress } from "./redux/progress/progressSlice";
import SavedJobs from "./components/me/SavedJobs";
import PostedJobs from "./components/me/PostedJobs";
import AppliedJobs from "./components/me/AppliedJobs";
import JobForm from "./components/forms/JobForm";
import CompanyForm from "./components/forms/CompanyForm";
import UserById from "./pages/UserById";
import JobEdit from "./pages/JobEdit";
import JobApplication from "./pages/JobApplication";
import Applications from "./pages/Applications";
import EditProfilePage from "./pages/EditProfilePage";

const App = () => {
  const progress = useSelector((state) => state.progress.value);
  const dispatch = useDispatch();

  const locomotiveScroll = new LocomotiveScroll();
  return (
    <BrowserRouter>
      <LoadingBar
        color="#60629B"
        progress={progress}
        onLoaderFinished={() => dispatch(setProgress(0))}
      />
      <Routes>
        {/* Dashboard */}
        <Route path="/" element={<Home />} />

        {/* Auth Routes */}
        <Route path="/auth" element={<Auth />}>
          <Route path="/auth" element={<LoginForm />} />
          <Route path="register" element={<RegisterForm />} />
        </Route>

        {/* Dashboard Routes */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="/dashboard" element={<HomeComponent />} />
            <Route path="me" element={<Me />}>
              <Route path="" element={<SavedJobs />} />
              <Route path="postedJobs" element={<PostedJobs />} />
              <Route path="appliedJobs" element={<AppliedJobs />} />
            </Route>
            <Route path="profile" element={<Outlet />} >
              <Route path="" element={<Profile />} />
              <Route path="edit" element={<EditProfilePage />} />
            </Route>
            <Route path="search" element={<Search />} />
            <Route path="post-job" element={<JobForm />} />
            <Route path="add-company" element={<CompanyForm />} />
            <Route path= 'companies/:name' element={<CompanyDetails />} />
            <Route path="jobs/:id" element={<Outlet />} >
              <Route path="" element={<JobDetails />} /> 
              <Route path="edit" element={<JobEdit />} />
              <Route path="apply" element={<JobApplication />} />
              <Route path="applicants" element={<Applications />} />
            </Route>
        </Route>

        <Route path="/users/:userId" element={<UserById />} />

        {/* Not Found */}
        <Route path="*" element={<div>Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
