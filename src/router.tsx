import { createBrowserRouter } from 'react-router-dom'
import JWTester from './components/JWTester/JWTester'
import Register from './pages/Register/Register'
import LogIn from './pages/LogIn/LogIn'
import MainPage from './pages/MainPage/MainPage'
import CourseDetails from './pages/CourseDetails/CourseDetails'
import Profile from './pages/User/Profile/Profile'

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainPage />
  },
  {
    path: '/login',
    element: <LogIn />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/course/:id',
    element: <CourseDetails />
  },
  {
    path: '/user/:id',
    element: <Profile />
  },
  {
    path: '/test_jwt',
    element: <JWTester />
  }
])

export default router
