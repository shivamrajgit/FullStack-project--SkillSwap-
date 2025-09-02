import React, { useState, useEffect} from 'react'
import SearchCard from '../Cards/SearchCard';
import searchIcon from '../../assets/search.svg';
import axios from 'axios';
// use search bar to send req to backend /search to get list of users
// a checkbox for aligned search that then sends to /search/a 
// display list of users using SearchCard component

export default function Search() {

    const [query, setQuery] = useState('');
    const [isAligned, setIsAligned] = useState(false);
    const [users, setUsers] = useState([]);

    const handleChange = (e) => {
        setQuery(e.target.value)
    }

    axios.defaults.baseURL = "http://localhost:8000/api/v1/users";

    const getSearchResults = async () => {
        if (!query.trim()) {
            setUsers([]);
            return;
        }
        
        try {
            console.log('Searching for:', query, 'Aligned:', isAligned);
            if(isAligned) {
                const response = await axios.get(`/search/a?query=${query}`, {withCredentials: true});
                console.log('Aligned search response:', response.data);
                setUsers(response.data.data || []);
            } 
            else {    
                const response = await axios.get(`/search/s?query=${query}`, {withCredentials: true});
                console.log('Simple search response:', response.data);
                setUsers(response.data.data || []);
            }
        } catch (error) {
            console.error('Search error:', error);
            setUsers([]);
        }
    }

    const handleSearch = () => {
        getSearchResults();
    }

    // Re-search when aligned checkbox changes
    useEffect(() => {
        if (query.trim()) {
            getSearchResults();
        }
    }, [isAligned]);

    return (
        <div
        className='flex flex-col justify-center items-center mt-10'>
            <div className='flex flex-row items-center'>
                <input 
                type="text"
                placeholder="Search skills to Learn..."
                className='w-150 border-2 border-black p-2 pl-5 m-2 rounded-3xl bg-white placeholder-gray-800 text-black'
                value={query}
                onChange={handleChange}
                />
                <button
                onClick={handleSearch}
                className='hover:bg-gray-800 p-3 m-2 rounded-full border-2 transition-colors duration-200'
                style={{ backgroundColor: '#171717', borderColor: '#171717' }}
                >
                    <img 
                    src={searchIcon} 
                    alt="Search" 
                    className="w-5 h-5"
                    style={{ filter: 'brightness(0) invert(1)' }}
                    />
                </button>
            </div>
            <div id='aligned-search' className='flex flex-row justify-center items-center'>
                <input 
                type="checkbox"
                name='isAligned'
                className='m-2'
                onChange={(e) => setIsAligned(e.target.checked)}/>
                <p>Aligned Search</p>
            </div>
            {users.map((user) => (
                <SearchCard key={user._id} user={user} />
            ))}
        </div>
    )
}