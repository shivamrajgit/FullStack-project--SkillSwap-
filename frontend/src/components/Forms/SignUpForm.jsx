import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { signupUser } from '../../slice/userSlice';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
// use /signup to handle signup logic backend
export default function SignUpForm() {
    const dispatch = useDispatch();
    const {success, error} = useSelector((state) => state.user);

    const [formData, setFormData] = React.useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        dispatch(signupUser(formData));
    }

    const navigate = useNavigate();

    useEffect(() => {
        if (success) {
            console.log(success);
            console.log("Redirecting to login page.....");
            navigate('/login');
        }
    }, [success, navigate]);        

    return (
        <div className='flex flex-col justify-center items-center mt-10'>
            <div 
                className='rounded-lg shadow-lg p-8 border-1 w-96'
                style={{ backgroundColor: '#171717' }}
            >
                <form 
                    className='flex flex-col justify-center items-center'
                    onSubmit={handleSubmit}
                >
                    <h2 className='text-3xl mb-6 text-white font-bold'>Sign Up</h2>
                    <input 
                        type="text"
                        name='firstName'
                        placeholder="First Name" 
                        className='w-full border-2 border-gray-300 bg-white text-black p-3 m-2 rounded-full focus:ring-2 focus:ring-blue-500 placeholder-gray-500'
                        required
                        onChange={handleChange}
                    />
                    <input 
                        type="text"
                        name='lastName'
                        placeholder="Last Name" 
                        className='w-full border-2 border-gray-300 bg-white text-black p-3 m-2 rounded-full focus:ring-2 focus:ring-blue-500 placeholder-gray-500'
                        onChange={handleChange}
                    />
                    <input 
                        type="email"
                        name='email'
                        placeholder="Email" 
                        className='w-full border-2 border-gray-300 bg-white text-black p-3 m-2 rounded-full focus:ring-2 focus:ring-blue-500 placeholder-gray-500'
                        required
                        onChange={handleChange}
                    />
                    <input
                        type="password"
                        name='password'
                        placeholder="Password"
                        className='w-full border-2 border-gray-300 bg-white text-black p-3 m-2 rounded-full focus:ring-2 focus:ring-blue-500 placeholder-gray-500'
                        required
                        onChange={handleChange}
                    />
                    <button
                        type='submit'
                        className='bg-black text-white hover:bg-gray-800 font-bold py-3 px-6 rounded-full w-full mt-4 mb-2 border-2 border-black transition-colors duration-200'
                    >
                        Sign Up
                    </button>
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                </form>
            </div>
        </div>
    )
}