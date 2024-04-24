import React, { useEffect, useState } from 'react'
import styles from './MainPage.module.scss'
import ContentManagerService from '../../services/ContentManager/ContentManagerService'
import AllCourses from '../Courses/AllCourses'
import MyCourses from '../Courses/MyCourses'
import Page from '../page/Page'

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
      default: {
        ContentManagerService.getInstance().setRender('all-courses')
        return <AllCourses />
      }
    }
  }

  return (
    <Page name="My-Studies | Main Page">
      <div className={styles.Wrapper}>{renderComponent()}</div>
    </Page>
  )
}

export default MainPage
