import React, { Dispatch, SetStateAction } from 'react'
import Dropdown, { MenuItem } from '../../../Dropdown/Dropdown'
import styles from './LoggedPanel.module.scss'
import { Link, useNavigate } from 'react-router-dom'

interface LoggedPanelProps {
  currentElement: string
  setCurrentElement: Dispatch<SetStateAction<string>>
}

function LoggedPanel({ currentElement, setCurrentElement }: LoggedPanelProps) {
  const navigate = useNavigate()
  const menuItems: MenuItem[] = [
    { itemTitle: 'Profil', itemOnClick: () => console.log('Profil'), redirect: '/' },
    { itemTitle: 'Oceny', itemOnClick: () => console.log('Oceny'), redirect: '/' },
    { itemTitle: 'Wiadomości', itemOnClick: () => console.log('Wiadomości'), redirect: '/' },
    {
      itemTitle: 'Wyloguj',
      itemOnClick: () => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
      },
      redirect: '/login'
    }
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
