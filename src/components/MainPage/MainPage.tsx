import { useState } from 'react'
import Header from './Header/Header'

function MainPage() {
  const [currentElement, setCurrentElement] = useState('main-page')
  return <Header currentElement={currentElement} setCurrentElement={setCurrentElement} />
}

export default MainPage
