import { RouterProvider } from 'react-router-dom'
import TokenManagerServiceWrapper from './services/TokenManager/TokenManagerServiceWrapper'
import ContentManagerService from './services/ContentManager/ContentManagerService'
import router from './router'

function App() {
  TokenManagerServiceWrapper.launch().setTokenManagerService()
  ContentManagerService.getInstance()

  return <RouterProvider router={router} />
}

export default App
