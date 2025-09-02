import React from 'react'
import pfpImage from '../../assets/pfp.jpg';
import { useNavigate } from 'react-router-dom';

// use this in Explore component to display each user in explore results
// it should have the user avatar big circular then name below it the links associated (comes from backend) with say github, linkedin, twitter icons
// tech stack below that
// the card should be clickable and take to that user's profile page (in backend logic)

export default function ExploreCard(user) {
    const avatar = user?.user?.avatar || pfpImage;
    const firstName = user.user.firstName;
    const lastName = user?.user?.lastName || "";
    const techStack = user?.user?.techStack || [];
    const navigate = useNavigate();

    return (
        <div 
            className='w-72 rounded-lg shadow-lg flex flex-col m-4 p-6 hover:scale-105 hover:shadow-xl transition-transform duration-300 flex-shrink-0 cursor-pointer'
            style={{ backgroundColor: '#171717', minHeight: '280px' }}
            onClick={() => navigate(`/view-profile/${user.user._id}`)}
        >
            {/* Avatar Section */}
            <div className='flex justify-center mb-4 mt-4'>
                <div className='w-50 h-50 rounded-full border-2 border-black overflow-hidden flex-shrink-0'>
                    <img 
                        src={avatar}
                        alt={`${firstName} ${lastName}`}
                        className='w-full h-full object-cover'
                    />
                </div>
            </div>

            {/* Name Section */}
            <div className='text-left mb-3 ml-1'>
                <h3 className='text-xl font-bold text-white ml-1'>
                    {firstName} {lastName}
                </h3>
            </div>

            {/* Tech Stack Section */}
            {techStack.length > 0 && (
                <div className='mb-3 ml-1 text-left ml-2 mb-4'>
                    <div className='flex flex-wrap items-center gap-2'>
                        <h4 className='text-sm font-medium text-white'>Tech Stack:</h4>
                        <div className='flex flex-wrap gap-1'>
                            {techStack.slice(0, 4).map((tech, i) => (
                                <span 
                                    key={i} 
                                    className='bg-black text-white px-2 py-1 rounded-full text-xs font-small border-2 border-black'
                                >
                                    {tech}
                                </span>
                            ))}
                            {techStack.length > 4 && (
                                <span className='bg-gray-600 text-white px-2 py-1 rounded-full text-xs'>
                                    +{techStack.length - 4} more
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}