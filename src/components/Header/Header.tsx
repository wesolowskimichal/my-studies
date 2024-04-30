import styles from './Header.module.scss'
import logo from '/logo.svg'
import LoggedPanel from './LoggedPanel/LoggedPanel'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import ApiService from '../../services/API/ApiService'

function Header() {
  const [isLogged, setIsLogged] = useState(false)

  useEffect(() => {
    if (!ApiService.getInstance().isTokenExpired()) {
      setIsLogged(true)
    }
  }, [])

  return (
    <div className={styles.Wrapper}>
      <img src={logo} alt="logo" />
      {isLogged ? (
        <LoggedPanel />
      ) : (
        <div className={styles.ElementWrapper}>
          <Link to="/login" className={`${styles.Element} ${styles.Current}`} onClick={() => {}}>
            <span>Zaloguj się</span>
          </Link>
        </div>
      )}
    </div>
  )
}

export default Header
