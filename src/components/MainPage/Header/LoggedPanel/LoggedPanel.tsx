import React, { Dispatch, SetStateAction } from 'react'
import Dropdown, { MenuItem } from '../../../Dropdown/Dropdown'
import styles from './LoggedPanel.module.scss'
import { Link } from 'react-router-dom'

interface LoggedPanelProps {
  currentElement: string
  setCurrentElement: Dispatch<SetStateAction<string>>
}

function LoggedPanel({ currentElement, setCurrentElement }: LoggedPanelProps) {
  const menuItems: MenuItem[] = [
    { itemTitle: 'Profil', itemOnClick: () => console.log('Profil') },
    { itemTitle: 'Oceny', itemOnClick: () => console.log('Oceny') },
    { itemTitle: 'Wiadomości', itemOnClick: () => console.log('Wiadomości') },
    { itemTitle: 'Wyloguj', itemOnClick: () => console.log('Wyloguj') }
  ]

  return (
    <>
      <div>
        <Link
          to="/"
          className={`${styles.Element} ${currentElement === 'all-courses' && styles.Current}`}
          onClick={() => setCurrentElement('all-courses')}
        >
          <span>Kursy</span>
        </Link>
      </div>
      <div>
        <Link
          to="/"
          className={`${styles.Element} ${currentElement === 'my-courses' && styles.Current}`}
          onClick={() => setCurrentElement('my-courses')}
        >
          <span>Moje Kursy</span>
        </Link>
      </div>
      <Dropdown title="Profil" menuItems={menuItems}></Dropdown>
    </>
  )
}

export default LoggedPanel
