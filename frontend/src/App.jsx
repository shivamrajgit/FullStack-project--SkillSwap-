import React, {useState} from 'react'
import Header from './components/Header/Header'
import { Outlet } from 'react-router-dom'
import { useLocation } from 'react-router-dom'


// the layout is Header at the top, SkillSwap title in the middle, Explore component below that and Search button below that, Footer at the bottom
// when search button is pressed skillswap should reduced in size and move to the top, Explore should vanish and Search component should take the full width below the SkillSwap title which contains a search bar and a checkbox for aligned search and below that should be the search results using SearchCard component
// if not logged in, LoginButtons component should be at the top right corner of the Header component ans search button should redirect to signup/login page

function App() {
  const location = useLocation();
  const isProfilePage = location.pathname.startsWith('/my-profile/') || location.pathname.startsWith('/view-profile/');
  
  return (
    <>
      <div className='align-center text-center mt-30 bg-black text-white min-h-screen'>
        <Header />
        {!isProfilePage && <h1 className='text-6xl text-white'>SkillSwap</h1>}
        <Outlet />
      </div>
    </>
  )
}

export default App