import React, { useEffect } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { JOB_API_END_POINT, APPLICATION_API_END_POINT } from '@/utils/constant';
import { useDispatch, useSelector } from 'react-redux';
import { setSingleJob } from '@/redux/jobSlice';
import { toast } from 'sonner';
import { useState } from 'react';

const JobDescription = () => {
    const { singleJob } = useSelector(store => store.job);
    const { user } = useSelector(store => store.auth);
    const isInitiallyApplied = singleJob?.applications?.some(application => application.applicant === user?._id) || false;
    const [isApplied, setIsApplied] =useState(isInitiallyApplied);
    const params = useParams();
    const jobId= params.id;
    const dispatch = useDispatch();

    const ApplyJobHandler = async () => {
        try {
            const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, { withCredentials: true });
            console.log(res.data);
            if (res.data.success){
                setIsApplied(true); // update tge local state
                const updateSingleJob = {...singleJob, applications: [...singleJob.applications, { applicant: user?._id }] };
                dispatch(setSingleJob(updateSingleJob)); // update the redux state
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Something went wrong");

        }
    }

    useEffect(() => {
        const fetchSingleJob = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setSingleJob(res.data.job));
                    setIsApplied(res.data.job.applications.some(application => application.applicant === user?._id)); // ensure your fetch data 
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchSingleJob();
    }, [jobId, dispatch]);

    return (
        <div className='max-w-7xl mx-auto my-10 px-4'>
            <div className='flex flex-col md:flex-row items-start md:items-center justify-between'>
                <div>
                    <h1 className='font-bold text-xl'>{singleJob?.title}</h1>
                    <div className='flex items-center gap-2 mt-4 flex-wrap'>
                        <Badge className='text-[#251e1d] font-bold' variant='ghost'>{singleJob?.positionsAvailable} Positions</Badge>
                        <Badge className='text-[#F83002] font-bold' variant='ghost'>{singleJob?.jobType}</Badge>
                        <Badge className='text-[#251e1d] font-bold' variant='ghost'>{singleJob?.salary} LPA</Badge>
                    </div>
                </div>
                <Button
                    onClick={isApplied ? null : ApplyJobHandler}
                    disabled={isApplied}
                    className={`rounded-lg ${isApplied ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#F83002] hover:bg-[#251e1d]'}`}>
                    {isApplied ? 'Already applied' : 'Apply Now'}
                </Button>
            </div>

            <div>
                <h2 className='border-b-2 border-b-gray-300 font-medium py-4'>Job Description</h2>
                <div className='my-4 space-y-2'>
                    <h2 className='font-bold'> Role: <span className='font-normal text-gray-800'>{singleJob?.title}</span> </h2>
                    <h2 className='font-bold'> Location: <span className='font-normal text-gray-800'>{singleJob?.location}</span> </h2>
                    <h2 className='font-bold'>Description: <span className='font-normal text-gray-800'>{singleJob?.description}</span></h2>
                    <h2 className='font-bold'> Experience: <span className='font-normal text-gray-800'>{singleJob?.experienceLevel} years</span> </h2>
                    <h2 className='font-bold'> Salary: <span className='font-normal text-gray-800'>{singleJob?.salary} LPA</span></h2>
                    <h2 className='font-bold'>Total Applicants: <span className='font-normal text-gray-800'>{singleJob?.applications?.length}</span> </h2>
                    <h2 className='font-bold'>Posted Date: <span className='font-normal text-gray-800'>{singleJob?.createdAt.split('T')[0]}</span></h2>
                </div>
            </div>
        </div>
    );
};

export default JobDescription;
