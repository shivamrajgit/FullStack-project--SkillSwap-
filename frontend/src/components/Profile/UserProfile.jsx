import React, { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { updateAvatar } from '../../slice/userSlice'
import axios from 'axios'
import githubIcon from '../../assets/github.svg'
import linkedinIcon from '../../assets/linkedin.svg'
import discordIcon from '../../assets/discord.svg'

export default function UserProfile({ editable }){
    const { id } = useParams()
    const dispatch = useDispatch()
    const fileInputRef = useRef(null)
    
    const [userDetails, setUserDetails] = useState({
        firstName: '',
        lastName: '',
        bio: '',
        techStack: [],
        lookingToLearn: [],
        githubURL: '',
        linkedinURL: '',
        discordID: '',
        avatar: ''
    });
    
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [newTechSkill, setNewTechSkill] = useState('');
    const [newLearnSkill, setNewLearnSkill] = useState('');

    axios.defaults.baseURL = "http://localhost:8000/api/v1/users";

    const fetchUserDetails = async() => {
        try {
            setLoading(true);
            let response;
            if(editable){
                console.log('Fetching my profile...');
                response = await axios.get('/my-profile', {withCredentials: true});
            } else {
                console.log('Fetching user profile for ID:', id);
                response = await axios.get(`/c/${id}`, {withCredentials: true});
            }
            setUserDetails(response.data.data || {});
        } catch (error) {
            console.error('Error fetching user details:', error);
            console.error('Error response:', error.response);
        } finally {
            setLoading(false);
        }
    }

    const handleInputChange = (field, value) => {
        setUserDetails(prev => ({
            ...prev,
            [field]: value
        }));
    }

    const handleArrayAdd = (field, value, setter) => {
        if (value.trim()) {
            setUserDetails(prev => ({
                ...prev,
                [field]: [...prev[field], value.trim()]
            }));
            setter('');
        }
    }

    const handleArrayRemove = (field, index) => {
        setUserDetails(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    }

    const handleAvatarChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('avatar', file);
            
            try {
                setLoading(true);
                console.log('Updating avatar...');
                const result = await dispatch(updateAvatar(formData));
                console.log('Avatar updated successfully');
                if (result.payload && result.payload.data) {
                    setUserDetails(prev => ({
                        ...prev,
                        avatar: result.payload.data.avatar
                    }));
                }
            } catch (error) {
                console.error('Error updating avatar:', error);
            } finally {
                setLoading(false);
            }
        }
    }

    const handleSave = async () => {
        try {
            setLoading(true);
            const updateData = {
                firstName: userDetails.firstName,
                lastName: userDetails.lastName,
                bio: userDetails.bio,
                techStack: userDetails.techStack,
                lookingToLearn: userDetails.lookingToLearn,
                githubURL: userDetails.githubURL,
                linkedinURL: userDetails.linkedinURL,
                discordID: userDetails.discordID
            };
            console.log('Updating profile with data:', updateData);
            await axios.post('/update-profile', updateData, {withCredentials: true});
            console.log('Profile updated successfully');
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            console.error('Error response:', error.response);
        } finally {
            setLoading(false);
        }
    }

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            alert('Discord ID copied to clipboard!');
        }).catch(() => {
            alert('Failed to copy to clipboard');
        });
    }

    useEffect(() => {
        fetchUserDetails();
    }, [editable, id]);

    if (loading) {
        return <div className="flex justify-center items-center h-64">Loading...</div>;
    }

    return (
        <div className="mx-auto p-6 border-1 rounded-lg shadow-lg" style={{ backgroundColor: '#171717', width: '500px' }}>
            {isEditing ? (
                // Edit Mode Layout
                <div className="space-y-6">
                    {/* Avatar Section - Edit Mode */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="relative">
                            <img 
                                src={userDetails.avatar || '/default-avatar.png'} 
                                alt="User Avatar" 
                                className="w-40 h-40 rounded-full object-cover border-4 border-gray-200"
                            />
                            {editable && (
                                <button 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.379-8.379-2.828-2.828z"/>
                                    </svg>
                                </button>
                            )}
                            <input 
                                ref={fileInputRef}
                                type="file" 
                                accept="image/*" 
                                onChange={handleAvatarChange}
                                className="hidden"
                            />
                        </div>
                    </div>

                    {/* Name Fields - Edit Mode */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
                            <input 
                                type="text"
                                value={userDetails.firstName || ''}
                                onChange={(e) => handleInputChange('firstName', e.target.value)}
                                className="w-full p-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
                            <input 
                                type="text"
                                value={userDetails.lastName || ''}
                                onChange={(e) => handleInputChange('lastName', e.target.value)}
                                className="w-full p-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Bio - Edit Mode */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                        <textarea 
                            value={userDetails.bio || ''}
                            onChange={(e) => handleInputChange('bio', e.target.value)}
                            rows={4}
                            className="w-full p-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Tech Stack - Edit Mode */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Tech Stack</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {userDetails.techStack?.map((skill, index) => (
                                <span key={index} className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm flex items-center" style={{ border: '2px solid black' }}>
                                    {skill}
                                    <button 
                                        onClick={() => handleArrayRemove('techStack', index)}
                                        className="ml-2 text-red-300 hover:text-red-500"
                                    >
                                        x
                                    </button>
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input 
                                type="text"
                                value={newTechSkill}
                                onChange={(e) => setNewTechSkill(e.target.value)}
                                placeholder="Add tech skill"
                                className="flex-1 p-2 border border-gray-600 bg-gray-700 text-white rounded-lg"
                                onKeyDown={(e) => e.key === 'Enter' && handleArrayAdd('techStack', newTechSkill, setNewTechSkill)}
                            />
                            <button 
                                onClick={() => handleArrayAdd('techStack', newTechSkill, setNewTechSkill)}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            >
                                Add
                            </button>
                        </div>
                    </div>

                    {/* Looking to Learn - Edit Mode */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Looking to Learn</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {userDetails.lookingToLearn?.map((skill, index) => (
                                <span key={index} className="bg-green-600 text-white px-3 py-1 rounded-full text-sm flex items-center" style={{ border: '2px solid black' }}>
                                    {skill}
                                    <button 
                                        onClick={() => handleArrayRemove('lookingToLearn', index)}
                                        className="ml-2 text-red-300 hover:text-red-500"
                                    >
                                        x
                                    </button>
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input 
                                type="text"
                                value={newLearnSkill}
                                onChange={(e) => setNewLearnSkill(e.target.value)}
                                placeholder="Add skill to learn"
                                className="flex-1 p-2 border border-gray-600 bg-gray-700 text-white rounded-lg"
                                onKeyDown={(e) => e.key === 'Enter' && handleArrayAdd('lookingToLearn', newLearnSkill, setNewLearnSkill)}
                            />
                            <button 
                                onClick={() => handleArrayAdd('lookingToLearn', newLearnSkill, setNewLearnSkill)}
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                            >
                                Add
                            </button>
                        </div>
                    </div>

                    {/* Social Links - Edit Mode */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">GitHub URL</label>
                            <input 
                                type="url"
                                value={userDetails.githubURL || ''}
                                onChange={(e) => handleInputChange('githubURL', e.target.value)}
                                className="w-full p-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">LinkedIn URL</label>
                            <input 
                                type="url"
                                value={userDetails.linkedinURL || ''}
                                onChange={(e) => handleInputChange('linkedinURL', e.target.value)}
                                className="w-full p-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Discord ID</label>
                            <input 
                                type="text"
                                value={userDetails.discordID || ''}
                                onChange={(e) => handleInputChange('discordID', e.target.value)}
                                className="w-full p-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Edit/Save Button */}
                    {editable && (
                        <div className="flex justify-end">
                            <div className="space-x-4">
                                <button 
                                    onClick={() => setIsEditing(false)}
                                    className="px-6 py-2 border border-gray-500 text-gray-300 rounded-lg hover:bg-gray-700"
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleSave}
                                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                                    disabled={loading}
                                >
                                    {loading ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                // View Mode Layout
                <div>
                    {/* Main Profile Section */}
                    <div className='flex flex-col mb-4 ml-9 mt-5'>
                        <div className="flex space-x-6 mb-8 items-end">
                            {/* Avatar */}
                            <div className="relative flex-shrink-0">
                                <img 
                                    src={userDetails.avatar || '/default-avatar.png'} 
                                    alt="User Avatar" 
                                    className="w-50 h-50 rounded-full object-cover border-4 border-black"
                                />
                                {editable && (
                                    <button 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute bottom-1 right-3 bg-black text-white p-2 rounded-full hover:bg-white hover:text-black transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.379-8.379-2.828-2.828z"/>
                                        </svg>
                                    </button>
                                )}
                                <input 
                                    ref={fileInputRef}
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleAvatarChange}
                                    className="hidden"
                                />
                            </div>

                            {/* Name and Bio */}
                            <div className="flex-1 text-left mb-7">
                                <h1 className="text-3xl font-bold text-white mb-2">
                                    {userDetails.firstName} {userDetails.lastName}
                                </h1>
                                <p className="text-gray-300 text-lg leading-relaxed">
                                    {userDetails.bio || 'No bio available'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Tech Stack */}
                    <div className="mb-2 text-left ml-12">
                        <h2 className="text-l font-medium text-white mb-3 inline-block mr-4">Tech Stack :</h2>
                        <div className="inline-flex flex-wrap gap-2">
                            {userDetails.techStack?.length > 0 ? (
                                userDetails.techStack.map((skill, index) => (
                                    <span key={index} className="bg-black text-white px-3 py-1 rounded-full text-xs font-small" style={{ border: '2px solid black' }}>
                                        {skill}
                                    </span>
                                ))
                            ) : (
                                <span className="text-gray-400">No tech stack specified</span>
                            )}
                        </div>
                    </div>

                    {/* Looking to Learn */}
                    <div className="mb-12 text-left ml-12">
                        <h2 className="text-l font-medium text-white mb-3 inline-block mr-4">Looking to Learn :</h2>
                        <div className="inline-flex flex-wrap gap-2">
                            {userDetails.lookingToLearn?.length > 0 ? (
                                userDetails.lookingToLearn.map((skill, index) => (
                                    <span key={index} className="bg-black text-white px-3 py-1 rounded-full text-xs font-small" style={{ border: '2px solid black' }}>
                                        {skill}
                                    </span>
                                ))
                            ) : (
                                <span className="text-gray-400">No learning goals specified</span>
                            )}
                        </div>
                    </div>
                    <div className='flex flex-row justify-between'>
                    {/* Social Links */}
                    <div className="flex space-x-6 mb-6 ml-10">
                        {/* GitHub */}
                        {userDetails.githubURL && (
                            <a 
                                href={userDetails.githubURL} 
                                target="_blank" 
                                rel="noopener noreferrer"
                            >
                                <img src={githubIcon} alt="GitHub" className="w-10 h-10 cursor-pointer hover:border-1 hover:rounded-full" style={{ filter: 'brightness(0) invert(1)' }} />
                            </a>
                        )}

                        {/* LinkedIn */}
                        {userDetails.linkedinURL && (
                            <a 
                                href={userDetails.linkedinURL} 
                                target="_blank" 
                                rel="noopener noreferrer"
                            >
                                <img src={linkedinIcon} alt="LinkedIn" className="w-10 h-10 cursor-pointer hover:border-1 hover:rounded-full" style={{ filter: 'brightness(0) invert(1)' }} />
                            </a>
                        )}

                        {/* Discord */}
                        {userDetails.discordID && (
                            <img 
                                src={discordIcon} 
                                alt="Discord" 
                                onClick={() => copyToClipboard(userDetails.discordID)}
                                className="w-10 h-10 cursor-pointer hover:border-1 hover:rounded-full"
                                style={{ filter: 'brightness(0) invert(1)' }}
                                title="Click to copy Discord ID"
                            />
                        )}
                    </div>

                    {/* Edit Button */}
                    {editable && (
                        <div className='mr-9'>
                            <button 
                                onClick={() => setIsEditing(true)}
                                className="px-6 py-2 bg-black text-white rounded-lg hover:bg-red-600"
                            >
                                Edit
                            </button>
                        </div>
                    )}
                    </div>
                </div>
            )}
        </div>
    )
}