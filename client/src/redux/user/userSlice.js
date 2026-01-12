import { createSlice } from '@reduxjs/toolkit'

const userData = JSON.parse(localStorage.getItem('userData'))

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    id: userData?._id || '',
    name: userData?.name || '',
    email: userData?.email || '',
    phone:  userData?.phone || '',
    niches: userData?.niches || [],
    profilePhoto: userData?.profilePhoto || '',
    resume: userData?.resume || '',
    role: userData?.role || 'Applicant',
    skills: userData?.skills || [],
    bio: userData?.bio || '',
    savedJobs: userData?.savedJobs || [],
    appliedJobs: userData?.appliedJobs || [],
    postedJobs: userData?.postedJobs || [],
    company: userData?.company || '',
  },
  reducers: {
      updateUser: (state, action) => {
          state.id = action.payload?._id;
          state.name = action.payload?.name;
          state.email = action.payload?.email;
          state.phone = action.payload?.phone;
          state.niches = action.payload?.niches;
          state.profilePhoto = action.payload?.profilePhoto;
          state.resume = action.payload?.resume;
          state.role = action.payload?.role;
          state.skills = action.payload?.skills;
          state.bio = action.payload?.bio;
          state.savedJobs = action.payload?.savedJobs;
          state.appliedJobs = action.payload?.appliedJobs;
          state.postedJobs = action.payload?.postedJobs;
          state.company = action.payload?.company;
      },
      logout: (state) => {
          state.id = '';
          state.name = '';
          state.email = '';
          state.phone = '';
          state.niches = [];
          state.profilePhoto = '';
          state.resume = '';
          state.role = '';
          state.skills = [];
          state.bio = '';
          state.savedJobs = [];
          state.appliedJobs = [];
          state.postedJobs = [];
          state.company = '';
      }
  }
})

export const { updateUser, logout } = userSlice.actions

export default userSlice.reducer