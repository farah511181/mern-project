import React from 'react';
import { Button } from './ui/button';
import { Bookmark } from 'lucide-react';
import { Avatar, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { useNavigate } from 'react-router-dom';

const Job = ({ job }) => {
    const navigate = useNavigate();
    const jobId = job?._id || 'defaultJobId';
    return (
        <div className='p-5 rounded-md shadow-xl bg-white border border-gray-100 
            hover:bg-red-100 hover:shadow-2xl transition-all duration-300'>
            <div className='flex items-center justify-between'>
                <p className='text-sm text-gray-600'>2 days ago</p>
                <Button variant='outline' className='rounded-full' size='icon'><Bookmark /></Button>
            </div>
            <div className='flex items-center gap-2 my-2'>
                <Button className='p-6' variant='outline' size='icon'>
                    <Avatar>
                        <AvatarImage src={job?.company?.logo} />
                    </Avatar>
                </Button>
                <div>
                    <h2 className='font-medium text-lg'>{job?.company?.name}</h2>
                    <p className='text-sm text-gray-500'>{job?.location}</p>
                </div>
            </div>
            <div>
                <h1 className='font-bold text-lg '>{job?.title}</h1>
                <p className='text-sm text-gray-600'>{job?.description}</p>
            </div>
            <div className='flex flex-wrap items-center gap-2 mt-4'>
                <Badge className='text-[#251e1d] font-bold' variant='ghost'>{job?.position} Positions</Badge>
                <Badge className='text-[#F83002] font-bold' variant='ghost'>{job?.jobType} Part Time</Badge>
                <Badge className='text-[#251e1d] font-bold' variant='ghost'>{job?.salary} LPA</Badge>
            </div>
            <div className='flex items-center gap-4 mt-4'>
                <Button
                    onClick={() => navigate(`/description/${job?._id}`)}variant='outline' className='hover:bg-black hover:text-white transition-all duration-300' >Details</Button>
                <Button className='bg-[#F83002] hover:bg-[black]'>Save For Later</Button>
            </div>
        </div>
    );
};

export default Job;
