import styles from './Header.module.scss'
import logo from '../../../assets/logo.png'
import LoggedPanel from './LoggedPanel/LoggedPanel'
import { Link } from 'react-router-dom'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import ApiService from '../../../services/API/ApiService'

interface HeaderProps {
  currentElement: string
  setCurrentElement: Dispatch<SetStateAction<string>>
}

function Header({ currentElement, setCurrentElement }: HeaderProps) {
  const [isLogged, setIsLogged] = useState(false)

  useEffect(() => {
    if (!ApiService.getInstance().isTokenExpired()) {
      setIsLogged(true)
    }
  }, [])

  return (
    <div className={styles.Wrapper}>
      <div className={styles.ContentWrapper}>
        <img src={logo} alt="logo" />
        <div className={`${styles.Elements}`}>
          {isLogged ? (
            <LoggedPanel currentElement={currentElement} setCurrentElement={setCurrentElement} />
          ) : (
            <div>
              <Link to="/login" className={styles.Element} onClick={() => setCurrentElement('')}>
                <span>Zaloguj się</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Header
