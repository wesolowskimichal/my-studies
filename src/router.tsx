import { createBrowserRouter } from 'react-router-dom'
import MainPage from './components/MainPage/MainPage'
import LogIn from './components/LogIn/LogIn'
import Register from './components/Register/Register'
import CourseDetails from './components/CourseDetails/CourseDetails'
import JWTester from './components/JWTester/JWTester'

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
    path: '/test_jwt',
    element: <JWTester />
  }
])

export default router
