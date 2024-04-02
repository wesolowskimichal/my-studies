import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import LogIn from './components/LogIn/LogIn'
import Register from './components/Register/Register'
import MainPage from './components/MainPage/MainPage'
import CourseDetails from './components/CourseDetails/CourseDetails'
import JWTester from './components/JWTester/JWTester'
import { useState } from 'react'
import { User } from './components/interfaces'

function App() {
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
  return <RouterProvider router={router} />
}

export default App
