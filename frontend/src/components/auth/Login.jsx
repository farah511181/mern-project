import React, { useEffect } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '@radix-ui/react-label'
import { Input } from '../ui/input'
import { RadioGroup } from '../ui/radio-group'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux'
import { setLoading,setUser } from '@/redux/authSlice'
import { Loader2 } from 'lucide-react'


const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: "",
        role: "",
    });
    const [errors, setErrors] = useState({});

    const { loading, user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const validateLogin = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!input.email) newErrors.email = "Email is required";
        else if (!emailRegex.test(input.email)) newErrors.email = "Invalid email format";

        if (!input.password) {
            newErrors.password = "Password is required";
        } else if (input.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        if (!input.role) {
            newErrors.role = "Please select a role";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        const isValid = validateLogin();
        if (!isValid) return;

        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true,
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                navigate("/")
                toast.success(res.data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            dispatch(setLoading(false));
        }
    }
    useEffect(()=>{
        if (user) {
            navigate('/')
        }
    },[])
    return (
        <div>
            <Navbar />
            <div className='flex items-center justify-center max-w-7xl mx-auto'>
                <form onSubmit={submitHandler} className='w-full max-w-md border border-gray-500 rounded-md p-4 my-10 shadow-sm bg-white'>
                    <h1 className='font-bold text-xl mb-5'>Login</h1>
                    <div className='my-2'>
                        <Label>Email</Label>
                        <Input
                            type='email'
                            value={input.email}
                            name='email'
                            onChange={changeEventHandler}
                            placeholder=''
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                    </div>
                    <div className='my-2'>
                        <Label>Password</Label>
                        <Input
                            type='password'
                            value={input.password}
                            name='password'
                            onChange={changeEventHandler}
                            placeholder=''
                        />
                        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                    </div>
                    <div className='flex items-center justify-between'>
                        <RadioGroup className="flex items-center gap-4 my-5">
                            <div className="flex items-center space-x-2">
                                <Input
                                    type='radio'
                                    name='role'
                                    value='student'
                                    checked={input.role == 'student'}
                                    onChange={changeEventHandler}
                                    className='cursor-pointer'
                                />
                                <Label htmlFor="r1">Student</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Input
                                    type='radio'
                                    name='role'
                                    value='recruiter'
                                    checked={input.role == 'recruiter'}
                                    onChange={changeEventHandler}
                                    className='cursor-pointer'
                                />
                                <Label htmlFor="r2">Recruiter</Label>
                            </div>
                        </RadioGroup>
                    </div>
                    {
                        loading ?
                            <Button disabled className='w-full my-4'> <Loader2 className='mr-2 animate-spin' />
                                Please wait</Button> : <Button type='submit' className='w-full my-4'>Login</Button>
                    }
                    <span className='text-sm'>
                        Forgot your password?
                        <Link to='/forgetpassword' className='text-blue-600 ml-1'>Click here</Link>
                    </span>
                </form>
            </div>
        </div>
    )
}

export default Login
