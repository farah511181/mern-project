import React, { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '@radix-ui/react-label';
import Navbar from '../shared/Navbar';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';

const ForgetPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    try {
      const res = await axios.post(`${USER_API_END_POINT}/forgot-password`, { email }, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      });
      toast.success(res.data.message);
    } catch (error) {
        console.log("Error Response:", error.response);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div>
      <Navbar />
      <div className='flex items-center justify-center min-h-screen px-4'>
        <form onSubmit={handleSubmit} className='w-full max-w-md border border-gray-500 rounded-md p-6 shadow-sm bg-white'>
          <h1 className='font-bold text-2xl mb-5 text-center'>Forgot Password</h1>
          <div className='my-4'>
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your registered email"
            />
          </div>
          <Button type="submit" className='w-full'>Send Reset Link</Button>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;
