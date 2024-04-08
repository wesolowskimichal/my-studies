import React, { Dispatch, SetStateAction } from 'react'
import Dropdown, { MenuItem } from '../../../Dropdown/Dropdown'
import styles from './LoggedPanel.module.scss'
import { Link, useNavigate } from 'react-router-dom'
import ContentManagerService from '../../../../services/ContentManager/ContentManagerService'

function LoggedPanel() {
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
          className={`${styles.Element} ${
            ContentManagerService.getInstance().getRender() === 'all-courses' && styles.Current
          }`}
          onClick={() => ContentManagerService.getInstance().setRender('all-courses')}
        >
          <span>Kursy</span>
        </Link>
      </div>
      <div>
        <Link
          to="/"
          className={`${styles.Element} ${
            ContentManagerService.getInstance().getRender() === 'my-courses' && styles.Current
          }`}
          onClick={() => ContentManagerService.getInstance().setRender('my-courses')}
        >
          <span>Moje Kursy</span>
        </Link>
      </div>
      <Dropdown title="Profil" menuItems={menuItems}></Dropdown>
    </>
  )
}

export default LoggedPanel
