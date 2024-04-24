import styles from './Header.module.scss'
import logo from '../../assets/logo.png'
import LoggedPanel from './LoggedPanel/LoggedPanel'
import { Link } from 'react-router-dom'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
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
        <div>
          <Link to="/login" className={styles.Element} onClick={() => {}}>
            <span>Zaloguj się</span>
          </Link>
        </div>
      )}
    </div>
  )
}

export default Header
