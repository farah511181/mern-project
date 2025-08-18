import React from 'react';
import { Button } from './ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchedQuery } from '@/redux/jobSlice';

const category = [
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Data Scientist',
    'Machine Learning Engineer',
    'Graphic Designer',
    'UI/UX Designer',
    'Product Manager',
    'DevOps Engineer',
    'Mobile App Developer',
    'Cloud Engineer',
    'Cybersecurity Analyst',
    'Software Tester',
    'Database Administrator'
];

const CategoryCarousel = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = (query) => {
        dispatch(setSearchedQuery(query));
        navigate('/browse');
    };

    return (
        <div>
            <Carousel className='w-full max-w-xl mx-auto my-20'>
                <CarouselContent>
                    {category.map((cat, index) => (
                        <CarouselItem key={index} className='md:basis-1/2 lg-basis-1/3'>
                            <Button onClick={()=>searchJobHandler(cat)} variant='outline' className='rounded-full'>
                                {cat}
                            </Button>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    );
};

export default CategoryCarousel;
