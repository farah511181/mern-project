import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '@radix-ui/react-label';
import { Input } from '../ui/input';
import { RadioGroup } from '../ui/radio-group';
import { Button } from '../ui/button';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '@/redux/authSlice';
import { Loader2 } from 'lucide-react';

const Signup = () => {
    const [input, setInput] = useState({
        fullname: '',
        email: '',
        phoneNumber: '',
        password: '',
        role: '',
        file: ''
    });

    const { loading, user } = useSelector((store) => store.auth);
    const [errors, setErrors] = useState({});
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        const { name, value } = e.target;
        setInput({ ...input, [name]: value });
    };

    const changeFileHandler = (e) => {
        setInput({ ...input, file: e.target.files?.[0] });
    };

    const validate = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9]{10}$/;

        if (!input.fullname) newErrors.fullname = 'Full name is required';
        if (!input.email) newErrors.email = 'Email is required';
        else if (!emailRegex.test(input.email)) newErrors.email = 'Invalid email format';

        if (!input.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
        else if (!phoneRegex.test(input.phoneNumber))
            newErrors.phoneNumber = 'Phone number must be 10 digits';

        if (!input.password) {
            newErrors.password = 'Password is required';
        } else if (input.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        const formData = new FormData();
        formData.append('fullname', input.fullname);
        formData.append('email', input.email);
        formData.append('phoneNumber', input.phoneNumber);
        formData.append('password', input.password);
        formData.append('role', input.role);
        if (input.file) {
            console.log("✅ input.file:", input.file); // 👈 Ye line add karo
            formData.append('file', input.file);
        } else {
        }

        for (let pair of formData.entries()) {
        }

        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });


            if (res.data.success) {
                toast.success(res.data.message || 'Registered successfully!');
                navigate('/login');
            }
        } catch (error) {
            const errorMsg = error?.response?.data?.message || 'Something went wrong. Please try again.';
            toast.error(errorMsg);
        } finally {
            dispatch(setLoading(false));
        }
    };
    useEffect(()=>{
            if (user) {
                navigate('/')
            }
        },[])

    return (
        <div>
            <Navbar />
            <div className='flex items-center justify-center min-h-screen px-4'>
                <form
                    onSubmit={submitHandler}
                    className='w-full max-w-xl border border-gray-500 rounded-md p-6 my-10 shadow-sm bg-white'
                >
                    <h1 className='font-bold text-2xl mb-5 text-center'>Signup</h1>

                    <div className='my-2'>
                        <Label>Full Name</Label>
                        <Input type='text'
                            name='fullname'
                            value={input.fullname}
                            onChange={changeEventHandler} />
                    </div>

                    <div className='my-2'>
                        <Label>Email</Label>
                        <Input type='email' value={input.email} name='email' onChange={changeEventHandler} />
                        {errors.email && <p className='text-red-500 text-sm'>{errors.email}</p>}
                    </div>

                    <div className='my-2'>
                        <Label>PhoneNumber</Label>
                        <Input
                            type='text'
                            value={input.phoneNumber}
                            name='phoneNumber'
                            onChange={changeEventHandler}
                        />
                        {errors.phoneNumber && <p className='text-red-500 text-sm'>{errors.phoneNumber}</p>}
                    </div>

                    <div className='my-2'>
                        <Label>Password</Label>
                        <Input
                            type='password'
                            value={input.password}
                            name='password'
                            onChange={changeEventHandler}
                        />
                    </div>

                    <div className='flex items-center justify-between'>
                        <RadioGroup className='flex items-center gap-4 my-5'>
                            <div className='flex items-center space-x-2'>
                                <Input
                                    type='radio'
                                    name='role'
                                    value='student'
                                    checked={input.role === 'student'}
                                    onChange={changeEventHandler}
                                    className='cursor-pointer'
                                />
                                <Label htmlFor='r1'>Student</Label>
                            </div>
                            <div className='flex items-center space-x-2'>
                                <Input
                                    type='radio'
                                    name='role'
                                    value='recruiter'
                                    checked={input.role === 'recruiter'}
                                    onChange={changeEventHandler}
                                    className='cursor-pointer'
                                />
                                <Label htmlFor='r2'>Recruiter</Label>
                            </div>
                        </RadioGroup>

                        <div className='flex items-center space gap-2 ml-20'>
                            <Label>Profile</Label>
                            <Input
                                accept='image/*'
                                type='file'
                                name='file'
                                onChange={changeFileHandler}
                                className='cursor-pointer'
                            />
                        </div>
                    </div>

                    {loading ? (
                        <Button className='w-full my-4'>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            Please wait
                        </Button>
                    ) : (
                        <Button type='submit' className='w-full my-4'>
                            Signup
                        </Button>
                    )}

                    <span className='text-sm'>
                        Already have an account?{' '}
                        <Link to='/login' className='text-blue-600'>
                            Login
                        </Link>
                    </span>
                </form>
            </div>
        </div>
    );
};

export default Signup;
