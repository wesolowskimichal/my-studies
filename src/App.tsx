import { RouterProvider } from 'react-router-dom'
import ContentManagerService from './services/ContentManager/ContentManagerService'
import router from './router'
import UserContextProvider from './services/UserContext/UserContext'

function App() {
  ContentManagerService.getInstance()

  return (
    <UserContextProvider>
      <RouterProvider router={router} />
    </UserContextProvider>
  )
}

export default App
