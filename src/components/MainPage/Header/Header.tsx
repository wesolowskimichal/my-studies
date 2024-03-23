import styles from './Header.module.scss'
import logo from '../../../assets/logo.png'
import LoggedPanel from './LoggedPanel/LoggedPanel'
import { Link } from 'react-router-dom'
import { Dispatch, SetStateAction } from 'react'

interface HeaderProps {
  currentElement: string
  setCurrentElement: Dispatch<SetStateAction<string>>
}

function Header({ currentElement, setCurrentElement }: HeaderProps) {
  const isLogged = true // zmienic na get from local storage
  return (
    <div className={styles.Wrapper}>
      <div className={styles.ContentWrapper}>
        <img src={logo} alt="logo" />
        <div className={`${styles.Elements}`}>
          <div>
            <Link
              to="/"
              className={`${styles.Element} ${currentElement == 'main-page' && styles.Current}`}
              onClick={() => setCurrentElement('main-page')}
            >
              <span>Strona Główna</span>
            </Link>
          </div>
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
