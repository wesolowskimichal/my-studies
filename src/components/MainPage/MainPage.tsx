import React, { useEffect, useState } from 'react'
import Header from './Header/Header'
import styles from './MainPage.module.scss'
import { useNavigate } from 'react-router-dom'
import ApiService from '../../services/API/ApiService'
import MyCourses from '../Courses/MyCourses'
import AllCourses from '../Courses/AllCourses'
import ContentManagerService from '../../services/ContentManager/ContentManagerService'

function MainPage() {
  const contentManager = ContentManagerService.getInstance()

  // to do: change navigation to my-courses
  const navigate = useNavigate()

  useEffect(() => {
    if (ApiService.getInstance().isTokenExpired()) {
      navigate('/login')
    }
  }, [])

  const renderComponent = () => {
    switch (contentManager.getRender()) {
      case 'all-courses':
        return <AllCourses />
      case 'my-courses':
        return <MyCourses />
      default:
        return null
    }
  }

  return (
    <div>
      <Header />
      <div className={styles.Wrapper}>{renderComponent()}</div>
    </div>
  )
}

export default MainPage
