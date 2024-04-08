import React, { useEffect, useState } from 'react'
import Header from './Header/Header'
import styles from './MainPage.module.scss'
import MyCourses from '../Courses/MyCourses'
import AllCourses from '../Courses/AllCourses'
import ContentManagerService from '../../services/ContentManager/ContentManagerService'

function MainPage() {
  const [currentRender, setCurrentRender] = useState(ContentManagerService.getInstance().getRender())

  useEffect(() => {
    const updateRender = () => {
      setCurrentRender(ContentManagerService.getInstance().getRender())
    }

    ContentManagerService.getInstance().setRenderCallback(updateRender)

    return () => {
      ContentManagerService.getInstance().removeRenderCallback(updateRender)
    }
  }, [])

  const renderComponent = () => {
    switch (currentRender) {
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
