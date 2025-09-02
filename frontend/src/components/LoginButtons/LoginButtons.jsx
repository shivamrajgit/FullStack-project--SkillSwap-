import React, { use } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// these two buttons define the login/signup page the should be below skillswap title when redirected to skillswap login/signup page
// with them redirecting to /login and /signup respectively forms which further handle the login/signup logic using backend

export default function LoginButtons() {
    const navigate = useNavigate();
    
    return (
        <div className='flex justify-center gap-10 mt-10 mb-10'>
            <button 
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-3xl w-25'
            onClick={() => navigate('/login')}
            >
                Login
            </button>
            <button 
            className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-3xl w-25'
            onClick={() => navigate('/signup')}
            >
                Sign Up
            </button>
        </div>
    )
}