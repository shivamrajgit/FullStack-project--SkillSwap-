import React, { use, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser, resetUserState } from '../../slice/userSlice';
// use /login to handle login logic backend
export default function LoginForm() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {loading, isLoggedIn, error, success} = useSelector((state) => state.user);

    const [formData, setFormData] = React.useState({
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
        dispatch(loginUser(formData));
    }

    useEffect(() => {
        if (isLoggedIn) {
            console.log(success);
            console.log("Redirecting to home page.....");
            dispatch(resetUserState());
            navigate('/');
        }
    }, [isLoggedIn, navigate]);

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
                    <h2 className='text-3xl mb-6 text-white font-bold'>Login</h2>
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
                        disabled={loading} 
                        className='bg-black text-white hover:bg-gray-800 font-bold py-3 px-6 rounded-full w-full m-2 border-2 border-black transition-colors duration-200'
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                </form>
            </div>
        </div>
    )
}