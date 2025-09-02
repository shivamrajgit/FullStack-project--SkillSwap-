import React from 'react'
import pfpImage from '../../assets/pfp.jpg'
import { useNavigate } from 'react-router-dom';

// use this in Search componrnt to display each user in search results

export default function SearchCard(user) {
    const firstName = user?.user?.firstName || 'John';
    const avatar = user?.user?.avatar || pfpImage;

    const navigate = useNavigate();

    return (
        <div
        className='flex flex-row items-center p-2 m-1 mt-2 w-150 rounded-4xl hover:bg-gray-300 cursor-pointer'
        style={{ backgroundColor: '#171717' }}
        onClick={() => navigate(`/view-profile/${user.user._id}`)}>
            <img 
            src={avatar}
            className='w-12 h-12 border-2 border-black rounded-full mr-4 ml-2' 
            />
            <p className='text-white'>{firstName}</p>
        </div>
    )
}