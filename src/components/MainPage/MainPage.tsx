import React, { useEffect, useState } from 'react'
import Header from './Header/Header'
import AllCourses from '../AllCourses/AllCourses'
import styles from './MainPage.module.scss'
import { User } from '../interfaces'
import { useNavigate } from 'react-router-dom'
import { getUserFromApi } from '../api/functions'

function MainPage() {
  const [currentElement, setCurrentElement] = useState('all-courses')
  const [user, setUser] = useState<User | undefined>()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const apiUser = await getUserFromApi()
        setUser(apiUser)
      } catch (error) {
        console.log(error)
        navigate('/login')
      }
    }
    fetchUser()
  }, [])

  const renderComponent = () => {
    switch (currentElement) {
      case 'all-courses':
        return <AllCourses />
      default:
        return null
    }
  }

  return (
    <div>
      <Header currentElement={currentElement} setCurrentElement={setCurrentElement} user={user} />
      <div className={styles.Wrapper}>{renderComponent()}</div>
    </div>
  )
}

export default MainPage
