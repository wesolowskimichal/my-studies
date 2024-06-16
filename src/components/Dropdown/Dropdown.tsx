import React, { useEffect, useRef, useState } from 'react'
import styles from './Dropdown.module.scss'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../assets/logo-guest.png'
import ContentManagerService from '../../services/ContentManager/ContentManagerService'
import { useSize } from '../../hooks/useSize'

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
  const windowSize = useSize()
  const [isOpen, setOpen] = useState(false)
  const [init, setInit] = useState(false)
  const [headerClass, setHeaderClass] = useState('')
  const [wrapperWidth, setWrapperWidth] = useState('fit-content')
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (menuRef.current) {
      if (init) {
        if (isOpen) {
          menuRef.current.style.display = 'block'
          setWrapperWidth(`${menuRef.current.offsetWidth}px`)
        } else {
          menuRef.current.style.display = 'none'
        }
      } else {
        menuRef.current.style.display = 'block'
        setWrapperWidth(`${menuRef.current.offsetWidth}px`)
        setInit(true)
      }
    }
  }, [windowSize, isOpen])

  return (
    <div
      className={styles.Wrapper}
      style={{ flexBasis: `${wrapperWidth}` }}
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
      <div className={styles.Menu} style={{ visibility: isOpen ? 'visible' : 'hidden' }} ref={menuRef}>
        {menuItems.map(({ itemTitle, itemOnClick, redirect }, index) => (
          <div
            key={index}
            onClick={itemOnClick}
            className={`${styles.MenuItem} ${isOpen ? styles.Show : styles.Hide}`}
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
