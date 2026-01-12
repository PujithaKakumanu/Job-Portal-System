import ApplicationCard from '@/components/cards/ApplicationCard';
import Pagination from '@/components/shared/Pagination';
import { setProgress } from '@/redux/progress/progressSlice';
import { baseUrl } from '@/utils';
import { motion } from 'framer-motion'
import React, { Suspense, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';
import { PacmanLoader } from 'react-spinners'

const Applications = () => {

  const [searchParams] = useSearchParams();

  const [results, setResults] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [ page, setPage ] = React.useState(parseInt(searchParams.get("page") || 1));

  const dispatch = useDispatch();

  const user = useSelector(state => state.user);
  const { id } = useParams();

  if( !user?.postedJobs?.includes(id) ) return <div className='w-full h-screen flex mt-[8vh] text-2xl font-bold'>You are not authorized to view this page.</div>

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        dispatch(setProgress(50));
        const res = await fetch(`${baseUrl}application/get?page=${page}`,{
          method : 'POST',
          body : JSON.stringify({ jobId : id }),
          headers : {
            'Content-Type' : 'application/json'
          }
        });
        const data = await res.json();
        if (data.success) {
          setResults(data);
          setLoading(false);
        }
        dispatch(setProgress(100));
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchApplications();
  },[page])
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
      <p className='profile-link'>Applications</p>
      <div className="applicationContainer grid grid-cols-1 mx-8 max-sm:mx-0 gap-6 min-h-[70vh]">
        {loading && <div className='w-full h-screen flex items-center justify-center'><PacmanLoader /></div>}
        {results && results.applications.map((application, index) => {
          return <ApplicationCard key={index} application={application} />
        })
      }

      <Pagination totalPages={results?.totalPages} setPage={setPage}/>
      </div>
    </motion.div>
    </Suspense>
  )
}

export default Applications
