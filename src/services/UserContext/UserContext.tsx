import React, { createContext, useContext, useState } from 'react'
import { User } from '../../components/interfaces'
import ApiService from '../API/ApiService'

interface UserContextType {
  user: User | undefined
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserContextProvider')
  }
  return context
}

const UserContextProvider: React.FC = ({ children }: any) => {
  const [user, setUser] = useState<User | undefined>()

  const fetchUser = async (): Promise<void> => {
    try {
      const userData = await ApiService.getInstance().getUser()
      setUser(userData.data!)
    } catch (error) {
      console.error('Error fetching user:', error)
    }
  }

  React.useEffect(() => {
    fetchUser()
  }, []) // Fetch user on component mount

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>
}

export default UserContextProvider
