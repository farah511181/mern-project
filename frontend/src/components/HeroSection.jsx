import React from 'react'
import { Button } from './ui/button'
import { Search } from 'lucide-react'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setSearchedQuery } from '@/redux/jobSlice'
import { useNavigate } from 'react-router-dom'

const HeroSection = () => {
  const [query, setQuery] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchedQuery = () => {
    dispatch(setSearchedQuery(query));
    navigate('/browse')

  }
  return (
    <div className='text-center'>
      <div className='flex flex-col gap-5 my-10'>
        <span className=' mx-auto px-4 py-2 rounded-full bg-gray-100 text-[#F83002] font-medium'>No. 1 Job Hunt Website</span>
        <h1 className='text-5xl font-bold'>Search, Apply & <br /> Get Your <span className=' text-[#F83002]'>Dream Jobs</span></h1>
        <p>Welcome to JobPortal, where we bridge the gap between ambition and opportunity. Our mission is to empower professionals by providing a seamless, intuitive, and efficient way to discover their next career milestone. Whether you are a fresh graduate looking for your first role or an experienced leader seeking a new challenge, we provide the tools and connections to help you succeed.</p>
        <div className='flex w-[40%] shadow-lg border-gray-200 pl-3 rounded-full items-center gap-4 mx-auto'>
          <input
            type='text'
            placeholder='Find your dream jobs'
            onChange={(e) => setQuery(e.target.value)}
            className='outline-none border-none w-full'
          />
          <Button onClick={searchedQuery}className='rounded-r-full bg-[#F83002]'>
            <Search className='h-5 w-5' />
          </Button>
        </div>
      </div>
    </div>
  )
}
export default HeroSection
