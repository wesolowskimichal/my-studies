import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '../../components/interfaces'

interface ContextType {
  user: User | null
  setUser: React.Dispatch<React.SetStateAction<User | null>>
  title: string
  setTitle: React.Dispatch<React.SetStateAction<string>>
}

const initUser = (): User | null => {
  const userLocalJson = localStorage.getItem('user-data')
  const userLocal: User | null = userLocalJson ? JSON.parse(userLocalJson) : null
  return userLocal
}

const UserContext = createContext<ContextType>({
  user: initUser(),
  setUser: () => {},
  title: 'My-Studies',
  setTitle: () => {}
})

type UserProviderProps = {
  children: React.ReactNode
}

const UserContextProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [title, setTitle] = useState('My-Studies')

  useEffect(() => {
    setUser(initUser())
  }, [])

  return <UserContext.Provider value={{ user, setUser, title, setTitle }}>{children}</UserContext.Provider>
}

export const context = () => useContext(UserContext)

export default UserContextProvider
