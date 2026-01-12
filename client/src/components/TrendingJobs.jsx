import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { HiTrendingUp } from "react-icons/hi";
import { baseUrl, jobs } from '../utils';
import JobCard from './cards/JobCard';
import { setProgress } from '@/redux/progress/progressSlice';

const TrendingJobs = () => {
    const theme = useSelector((state) => state.theme.value)
    const [ results, setResults ] = React.useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchTrendingJobs = async () => {
            try {
                dispatch(setProgress(50))
                const res = await fetch(`${baseUrl}job/getAll`)
                const data = await res.json()
                if(data.success) {
                    setResults(data)
                } else {
                    setResults(null)
                }
                dispatch(setProgress(100))
            } catch (error) {
                console.log(error)
            }
        }
        fetchTrendingJobs()
    },[])
  return (
    <div id='trending' className={`${theme === 'dark' && 'bg-zinc-900 text-white' } bg-gradient-to-r from-slate-900/30 h-fit w-screen flex flex-col p-4 md:px-24 md:pt-20`}>
      <h3 className='relative flex font-bold w-fit items-center gap-2 text-3xl pb-1'>Trending Jobs <span><HiTrendingUp /></span></h3>
      <div className="jobCardsContainer grid md:grid-cols-2 grid-cols-1 gap-12 items-center place-items-center py-4">

        {results && results?.jobs.length > 0 && results.jobs.map((job, index) => {
            return(
                <JobCard key={index} job={job} />
            )
        })}
      </div>
    </div>
  )
}

export default TrendingJobs
