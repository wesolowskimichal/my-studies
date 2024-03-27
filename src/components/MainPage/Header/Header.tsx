import styles from './Header.module.scss'
import logo from '../../../assets/logo.png'
import LoggedPanel from './LoggedPanel/LoggedPanel'
import { Link } from 'react-router-dom'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { User } from '../../interfaces'
import { getUserFromApi } from '../../api/functions'

interface HeaderProps {
  currentElement: string
  setCurrentElement: Dispatch<SetStateAction<string>>
  user: User | undefined
}

function Header({ currentElement, setCurrentElement }: HeaderProps) {
  const [isLogged, setIsLogged] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const apiUser = await getUserFromApi()
        setIsLogged(true)
      } catch (error) {}
    }
    fetchUser()
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
