import { createBrowserRouter } from 'react-router-dom'
import JWTester from './components/JWTester/JWTester'
import Register from './pages/Register/Register'
import LogIn from './pages/LogIn/LogIn'
import MainPage from './pages/MainPage/MainPage'
import CourseDetails from './pages/CourseDetails/CourseDetails'
import Profile from './pages/User/Profile/Profile'
import { CoursePost } from './pages/CoursePost/CoursePost'
import { EditCourse } from './pages/EditCourse/EditCourse'
import { Task } from './pages/Task/Task'
import { CreateCoursePage } from './pages/CreateCourse/CreateCourse'

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
    path: '/course/:id/edit',
    element: <EditCourse />
  },
  {
    path: '/user/:id',
    element: <Profile />
  },
  {
    path: '/course/:courseId/post/:postId?',
    element: <CoursePost />
  },
  {
    path: '/course/:courseId/task/:taskId',
    element: <Task />
  },
  {
    path: '/course/create',
    element: <CreateCoursePage />
  },
  {
    path: '/test_jwt',
    element: <JWTester />
  }
])

export default router
