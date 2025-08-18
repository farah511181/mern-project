import React from 'react'
import Job from './Job'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'

const LatestJobs = () => {
  const { allJobs } = useSelector((store) => store.job);

  const latestJobs = allJobs.slice(0, 6);

  return (
    <div className="max-w-7xl mx-auto my-10">
      <h2 className="text-2xl font-bold mb-6">Latest & Top Job Openings</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {latestJobs.map((job, index) => (
          <motion.div
            key={job._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 8px 20px rgba(0,0,0,0.15)"
            }}
            whileTap={{ scale: 0.98 }}
            className="rounded-lg overflow-hidden transition-colors duration-300"
          >
            <div className="bg-white hover:bg-red-100 transition-colors duration-300">
              <Job job={job} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default LatestJobs
