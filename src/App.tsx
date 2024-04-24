import { RouterProvider } from 'react-router-dom'
import TokenManagerServiceWrapper from './services/TokenManager/TokenManagerServiceWrapper'
import ContentManagerService from './services/ContentManager/ContentManagerService'
import router from './router'
import UserContextProvider from './services/UserContext/UserContext'

function App() {
  TokenManagerServiceWrapper.launch().setTokenManagerService()
  ContentManagerService.getInstance()

  return (
    <UserContextProvider>
      <RouterProvider router={router} />
    </UserContextProvider>
  )
}

export default App
