import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import JobPage from './JobPage'

const AppliedJobs = () => {
  const navigate = useNavigate()
  const userRole = useSelector(state => state.user.role)
  if(userRole !== 'Applicant') navigate('/dashboard/me')

  return (
    <JobPage query="appliedJobs" title='Applied Jobs'/>
  )
}

export default AppliedJobs
