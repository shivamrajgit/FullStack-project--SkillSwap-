import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { store } from './app/store.js'
import { Provider } from 'react-redux'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements} from 'react-router-dom'
import LoginForm from './components/Forms/LoginForm.jsx'
import SignUpForm from './components/Forms/SignUpForm.jsx'
import Explore from './components/Explore/Explore.jsx'
import Search from './components/Search/Search.jsx'
import UserProfile from './components/Profile/UserProfile.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index element={<Explore />} />
      <Route path='/login' element={<LoginForm />} />
      <Route path='/signup' element={<SignUpForm />} />
      <Route path='/search' element={<Search />} />
      <Route path='/my-profile/:id' element={<UserProfile editable={true}/>} />
      <Route path='/view-profile/:id' element={<UserProfile editable={false}/>} />
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
  </Provider>
)
