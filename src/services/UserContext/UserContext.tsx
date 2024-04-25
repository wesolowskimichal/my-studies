import React, { createContext, useContext, useState } from 'react'
import { User } from '../../components/interfaces'

interface UserContextType {
  user: User | null
  setUser: React.Dispatch<React.SetStateAction<User | null>>
}

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {}
})

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserContextProvider')
  }
  return context
}

type UserProviderProps = {
  children: React.ReactNode
}

const UserContextProvider = ({ children }: UserProviderProps) => {
  const userLocalJson = localStorage.getItem('user-data')
  const userLocal: User | null = userLocalJson ? JSON.parse(userLocalJson) : null
  const [user, setUser] = useState<User | null>(userLocal)
  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>
}

export const context = () => useContext(UserContext)

export default UserContextProvider
