import React, { useEffect, useState } from 'react'
import LoginButtons from '../LoginButtons/LoginButtons'
import ExploreCard from '../Cards/ExploreCard'
import { useSelector } from 'react-redux';
import axios from 'axios';
// send req to backend /explore to get list of users
// display list of users using ExploreCard component
// it should be right below the SkillSwap and should be rotating left to right automatically

export default function Explore() {
    const { isLoggedIn } = useSelector((state) => state.user);
    axios.defaults.baseURL = "http://localhost:8000/api/v1/users";

    const [users, setUsers] = useState([]);

    const getExploreUsers = async () => {
        try {
            const response = await axios.get('/explore-top');
            setUsers(response.data.data || []);
        } catch (error) {
            console.error("Error fetching explore users:", error);
        }
    }


    useEffect(() => {
        getExploreUsers();
    },[])

    // Create enough duplicates to ensure seamless scrolling
    const filteredUsers = users.filter(user => user.techStack.length > 0);
    const renderCards = () => {
        if (filteredUsers.length === 0) return null;
        
        // Create multiple sets to ensure smooth infinite scroll
        const cardSets = [];
        for (let i = 0; i < 4; i++) {
            cardSets.push(
                ...filteredUsers.map((user) => (
                    <ExploreCard key={`set-${i}-${user._id}`} user={user} />
                ))
            );
        }
        return cardSets;
    }

    return (
        <div>
            <div className='w-[100%] mt-8 mb-10 flex flex-row justify-center items-center overflow-hidden relative'>
                <div className='flex flex-row animate-scroll-seamless'>
                    {renderCards()}
                </div>
            </div>
            {!isLoggedIn ? <LoginButtons /> : <></>}
        </div>
    )
}
