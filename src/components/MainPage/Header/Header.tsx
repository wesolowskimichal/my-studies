import styles from './Header.module.scss'
import logo from '../../../assets/logo.png'
import LoggedPanel from './LoggedPanel/LoggedPanel'
import { Link } from 'react-router-dom'
import { Dispatch, SetStateAction } from 'react'
import { User } from '../../interfaces'

interface HeaderProps {
  currentElement: string
  setCurrentElement: Dispatch<SetStateAction<string>>
  user: User | undefined
}

function Header({ currentElement, setCurrentElement, user }: HeaderProps) {
  console.log(user)
  const isLogged = user !== undefined
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
