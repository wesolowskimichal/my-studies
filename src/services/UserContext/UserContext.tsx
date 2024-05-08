// UserContextProvider.tsx
import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { User } from '../../components/interfaces'
import ApiService from '../API/ApiService'
import { usePopup } from '../../hooks/usePopup'
import { jwtDecode } from 'jwt-decode'
import router from '../../router'
import { ApiResponse } from '../API/ApiResponse'

interface ContextType {
  user: User | null
  setUser: React.Dispatch<React.SetStateAction<User | null>>
  title: string
  setTitle: React.Dispatch<React.SetStateAction<string>>
  startSession: () => void
}

const UserContext = createContext<ContextType>({
  user: null,
  setUser: () => {},
  title: 'My-Studies',
  setTitle: () => {},
  startSession: () => {}
})

type UserProviderProps = {
  children: React.ReactNode
}

const UserContextProvider = ({ children }: UserProviderProps) => {
  const closeAlert = (clearStorage = true) => {
    if (clearStorage) {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    }
  }

  const onClose = () => {
    router.navigate('/login', { state: { sessionTimeOut: true } })
    closeAlert()
  }

  const onRefresh = () => {
    const obtainToken = async () => {
      const newAccessToken = await ApiService.getInstance().getTokenFromRefresh()
      if (newAccessToken.responseCode === ApiResponse.POSITIVE) {
        localStorage.setItem('accessToken', newAccessToken.data?.access!)
        startSession()
      } else {
        setTime(8)
        setMessage(`Nie udało się odświeżyć sesji`)
        setPopupType('Warning')
        setTrigger(true)
      }
    }

    obtainToken()
  }

  const { setMessage, setTime, setPopupType, setTrigger, popup } = usePopup({
    onTimeOut: onClose,
    onRefresh: onRefresh,
    onClose: onClose
  })
  const [user, setUser] = useState<User | null>(null)
  const [title, setTitle] = useState('My-Studies')

  const intervalRef = useRef<number | null>(null)
  const [expiration, setExpiration] = useState<number | null>(null)
  const timeToRefresh = 120

  const isTokenExpired = () => {
    if (!expiration) return true
    const currentTime = Math.floor(Date.now() / 1000)
    const passed = expiration! - currentTime
    if (passed <= timeToRefresh) {
      setTime(passed)
      return true
    }
    return false
  }

  const startExpirationCheck = () => {
    intervalRef.current = setInterval(() => {
      if (isTokenExpired()) {
        clearInterval(intervalRef.current ?? undefined)
        setMessage('Token zaraz wygaśnie!')
        setPopupType('Token')
        setTrigger(true)
      } else if (!localStorage.getItem('accessToken')) {
        clearInterval(intervalRef.current ?? undefined)
      }
    }, 1000)
  }

  useEffect(() => {
    if (expiration) {
      startExpirationCheck()
    }
  }, [expiration])

  const startSession = () => {
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
      try {
        const decodedToken = jwtDecode(accessToken)
        setExpiration(decodedToken.exp!)
      } catch (error) {
        setTime(8)
        setMessage(`Niepoprawny token`)
        setPopupType('Warning')
        setTrigger(true)
      }
    }
  }

  useEffect(() => {
    const fetchUser = async () => {
      const response = await ApiService.getInstance().getUser()
      setUser(response.data)
    }

    startSession()
    fetchUser()
  }, [])

  return (
    <UserContext.Provider value={{ user, setUser, title, setTitle, startSession }}>
      {children}
      {popup}
    </UserContext.Provider>
  )
}

export const context = () => useContext(UserContext)

export default UserContextProvider
