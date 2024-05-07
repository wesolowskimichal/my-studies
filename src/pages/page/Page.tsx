import React, { useEffect } from 'react'
import Header from '../../components/Header/Header'
import { context } from '../../services/UserContext/UserContext'
import { useTitle } from '../../hooks/useTitle'
import { useNavigate } from 'react-router-dom'
import ApiService from '../../services/API/ApiService'

type PageProps = {
  name: string
  children: React.ReactNode
  teacherOnly?: boolean
}

const Page = ({ name, children, teacherOnly = false }: PageProps) => {
  const { title, user } = context()
  const navigate = useNavigate()
  useTitle(`${title} | ${name}`)
  useEffect(() => {
    if (teacherOnly) {
      if (user && user.user_type === 'Student') {
        navigate('/')
        // TODO: add info alert
      } else if (ApiService.getInstance().isTokenExpired()) {
        navigate('/')
        // TODO: add info alert
      }
    }
  }, [user])

  return (
    <>
      <Header />
      {children}
    </>
  )
}

export default Page
