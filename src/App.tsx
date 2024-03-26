import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import LogIn from './components/LogIn/LogIn'
import Register from './components/Register/Register'
import MainPage from './components/MainPage/MainPage'

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
  }
])

function App() {
  return <RouterProvider router={router} />
}

export default App
