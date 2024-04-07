import React, { useEffect, useState } from 'react'
import Header from './Header/Header'
import AllCourses from '../AllCourses/AllCourses'
import styles from './MainPage.module.scss'
import { useNavigate } from 'react-router-dom'
import ApiService from '../../services/API/ApiService'

function MainPage() {
  const [currentElement, setCurrentElement] = useState('all-courses')
  const navigate = useNavigate()

  useEffect(() => {
    if (ApiService.getInstance().isTokenExpired()) {
      navigate('/login')
    }
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
