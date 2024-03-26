import React, { useState } from 'react'
import Header from './Header/Header'
import AllCourses from '../AllCourses/AllCourses'
import styles from './MainPage.module.scss'

function MainPage() {
  const [currentElement, setCurrentElement] = useState('main-page')

  const renderComponent = () => {
    switch (currentElement) {
      case 'main-page':
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
