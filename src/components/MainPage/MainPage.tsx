import React, { useEffect, useState } from 'react'
import Header from './Header/Header'
import AllCourses from '../AllCourses/AllCourses'
import styles from './MainPage.module.scss'
import { useNavigate } from 'react-router-dom'
import { getUserFromApi } from '../api/functions'

function MainPage() {
  const [currentElement, setCurrentElement] = useState('all-courses')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const apiUser = await getUserFromApi()
        return apiUser
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
      <Header currentElement={currentElement} setCurrentElement={setCurrentElement} />
      <div className={styles.Wrapper}>{renderComponent()}</div>
    </div>
  )
}

export default MainPage
