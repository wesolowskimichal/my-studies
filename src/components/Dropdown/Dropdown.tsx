import React, { useEffect, useState } from 'react'
import styles from './Dropdown.module.scss'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../assets/logo-guest.png'
import ContentManagerService from '../../services/ContentManager/ContentManagerService'

export interface MenuItem {
  itemTitle: string
  itemOnClick: () => void
  redirect: string
}

interface DropdownProps {
  title: string
  menuItems: MenuItem[]
}

function Dropdown({ title, menuItems }: DropdownProps) {
  const [isOpen, setOpen] = useState(false)
  const [headerClass, setHeaderClass] = useState('')

  return (
    <div
      className={styles.Wrapper}
      onMouseLeave={() => {
        setOpen(false)
        setHeaderClass('')
      }}
    >
      <img
        src={logo}
        className={`${styles.Header} ${headerClass} ${
          ContentManagerService.getInstance().getRender() == 'profile' ? styles.Current : ' '
        }`}
        onClick={() => setOpen(!isOpen)}
        onMouseEnter={() => {
          setOpen(true)
          setHeaderClass(styles.Hover)
        }}
      />
      <div className={styles.Menu} style={{ visibility: isOpen ? 'visible' : 'hidden' }}>
        {menuItems.map(({ itemTitle, itemOnClick, redirect }, index) => (
          <div
            key={index}
            onClick={itemOnClick}
            className={`${styles.MenuItem} ${isOpen && styles.Show}`}
            style={{ transitionDelay: `${index / 10}s` }}
          >
            <Link to={redirect}>{itemTitle}</Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Dropdown
