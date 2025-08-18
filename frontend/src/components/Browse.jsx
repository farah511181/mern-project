import React, { useEffect } from 'react'
import Navbar from './shared/Navbar'
import Job from './job';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import { motion } from 'framer-motion';

const Browse = () => {
  useGetAllJobs();
  const { allJobs } = useSelector((store) => store.job);
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(setSearchedQuery(''));
    }
  }, []);

  return (
    <div>
      <Navbar />
      <div className='max-w-7xl mx-auto my-10'>
        <h1 className='font-bold text-xl my-10'>
          Search Results ({allJobs.length})
        </h1>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {allJobs.map((job) => (
            <motion.div
              key={job._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 8px 20px rgba(0,0,0,0.15)"
              }}
              whileTap={{ scale: 0.98 }}
              className="rounded-lg overflow-hidden bg-white"
            >
              <Job job={job} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Browse;
