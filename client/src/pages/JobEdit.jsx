import JobForm from '@/components/forms/JobForm'
import { motion } from 'framer-motion'
import React, { Suspense } from 'react'
import { useParams } from 'react-router-dom'
import { PacmanLoader } from 'react-spinners'

const JobEdit = () => {
  const { id } = useParams()

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
      <JobForm purpose="Edit" jobId={id} />
    </motion.div>
    </Suspense>
  )
}

export default JobEdit
