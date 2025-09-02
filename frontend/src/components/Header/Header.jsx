import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { logoutUser, resetUserState, setAvatar } from '../../slice/userSlice';
import axios from 'axios';
import pfpImage from '../../assets/pfp.jpg'
import HomeButton from '../HomeButton/HomeButton';
// right hand side current user pfp if logged in which when clicked goes to profile page where user can edit their details using /update profile and also /update-password
// if logged in logout button which when clicked logs out the user using /logout and redirects to / page
// left hand side time and date aesthetics
// minimalist design

export default function Header() {
    const {isLoggedIn, success, id, avatar} = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logoutUser());
    }

    const navigate = useNavigate();

    axios.defaults.baseURL = "http://localhost:8000/api/v1/users";

    const getAvatar = async () => {
        try {
            const response = await axios.get('/my-profile', { withCredentials: true });
            dispatch(setAvatar(response.data.data.avatar));
        } catch (error) {
            console.error("Error fetching avatar:", error);
        }
    }

    useEffect(() => {
        if (isLoggedIn && !avatar) {
            getAvatar();
        }
    }, [isLoggedIn, avatar]);

    useEffect(() => {
        if (!isLoggedIn && success) {
            console.log(success);
            console.log("Redirecting to home page.....");
            dispatch(resetUserState());
            navigate('/');
        }
    }, [isLoggedIn, navigate]);    

    return (
        <div className='w-[100%] h-[80px] flex justify-between items-center px-10 fixed top-0 left-0 z-10'>
            <div className='text-lg gap-4 flex items-center'>
                <HomeButton />
                {new Date().toLocaleTimeString()}
            </div>
            {isLoggedIn ? <div className='flex items-center gap-4'>
                <button
                className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-3xl'
                onClick={handleLogout}
                >
                    Logout
                </button>
                <button
                className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full w-12 h-12 flex justify-center items-center'
                onClick={() => navigate('/search')}>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                </button>
                <img 
                onClick={() => navigate(`/my-profile/${id}`)}
                src={avatar || pfpImage}
                alt="User Avatar"
                className='w-12 h-12 border-2 rounded-full mr-4 ml-2 cursor-pointer object-cover' 
                />
            </div> : <></>}
        </div>
    )
}