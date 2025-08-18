import React, { use, useState } from 'react'
import Navbar from './shared/Navbar'
import { Avatar, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Contact, Mail, Pen } from 'lucide-react'
import { Badge } from './ui/badge'
import { Label } from '@radix-ui/react-label'

import AppliedJobTable from './AppliedJobTable'
import UpdateProfileDialog from './UpdateProfileDialog'
import { useSelector } from 'react-redux'
import useGetApplidJobs from '@/hooks/useGetAppliedJobs'


//const skills = ['html', 'css', 'javascript', 'react', 'nodejs', 'expressjs', 'mongodb']//
const isResume = true;

const Profile = () => {
  useGetApplidJobs();
  const [open, setOpen] = useState(false);
  const {user} = useSelector(store=>store.auth);
  
  return (
    <div>
      <Navbar />
      <div className='max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <Avatar className='w-24 h-24'>
              <AvatarImage src='https://i.pinimg.com/originals/3c/28/db/3c28dbb63168df7e095f6f739622e1f6.jpg' />
            </Avatar>
            <div>
              <h1 className='font-medium text-xl'>{user?.fullname}</h1>
              <p>{user?.profile?.bio}</p>
            </div>
          </div>
          <Button onClick= {() => setOpen(true) } className='text-right' variant='outline'><Pen /></Button>
        </div>
        <div className='my-5'>
          <div className='flex items-center gap-4 my-2'>
            <Mail />
            <span>{user?.email}</span>
          </div>
          <div className='flex items-center gap-4 my-2'>
            <Contact />
            <span>{user?.phoneNumber}</span>
          </div>
        </div>
        <div className='my-5'>
          <h2>Skills</h2>
          <div className='flex items-center gap-4 my-2'>
            {
              user?.profile?.skills.length !== 0 ? user?.profile?.skills.map((item, index) => <Badge key={index}>{item}</Badge>) : <span>NA</span>

            }
          </div>
        </div>
        <div className='grid w-full max-w-sm items-center gap-1.5'>
          <Label className='text-md font-bold'>Resume</Label>
          {
            isResume ? <a target='_blank' href={user?.profile?.resume} className='text-red-600 w-full hover:underline cursor-pointer'>{user?.profile?.resumeOriginalName}</a> : <span className='text-gray-500'>No Resume Uploaded</span>
          }
        </div>
      </div>
      <div className='max-w-4xl mx-auto bg-white rounded-2xl'>
        <h2 className='font-bold text-lg my-5'>Applied Job</h2>

        <AppliedJobTable />
      </div>
      <UpdateProfileDialog open={open} setOpen={setOpen} />
    </div>
  )
}

export default Profile