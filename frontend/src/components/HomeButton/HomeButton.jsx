import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function HomeButton() {
    const location = useLocation();
    const navigate = useNavigate();

    if (location.pathname === '/') {
        return null; // Don't render the button on the home page
    }
    else{
        return (
            <button
            className='top-5 left-5 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 flex items-center justify-center'
            onClick={() => navigate('/')}
            >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
            </button>
        )
    }
}

export default HomeButton