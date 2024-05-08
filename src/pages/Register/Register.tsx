import { useState, FormEvent, useEffect } from 'react'
import styles from './Register.module.scss'
import { Link, useNavigate } from 'react-router-dom'
import logo from '/logo.svg'
import ApiService from '../../services/API/ApiService'
import { ApiResponse } from '../../services/API/ApiResponse'
import { context } from '../../services/UserContext/UserContext'
import { useTitle } from '../../hooks/useTitle'
import { usePopup } from '../../hooks/usePopup'

function Register() {
  const [email, setEmail] = useState('')
  const [userName, setUserName] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const { setMessage, setTime, setPopupType, setTrigger, popup } = usePopup()
  const { setUser, title, startSession } = context()

  useTitle(`${title} | Register`)

  useEffect(() => {
    if (!ApiService.getInstance().isTokenExpired()) {
      navigate('/')
    }
  }, [])

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const [fname, sname] = name.trim().split(' ')
    if (fname === undefined || sname === undefined) {
      setTime(8)
      setMessage(`Niepoprawne imię i nazwisko`)
      setPopupType('Warning')
      setTrigger(true)
      return
    }
    const response = await ApiService.getInstance()
      .getTokenRegister(userName, email, fname, sname, password)
      .then(response => {
        if (response.responseCode === ApiResponse.POSITIVE) {
          localStorage.setItem('accessToken', response.data!.access)
          localStorage.setItem('refreshToken', response.data!.refresh)
          const fetchUser = async () => {
            const userResponse = await ApiService.getInstance().getUser()
            if (userResponse.responseCode === ApiResponse.POSITIVE) {
              setUser(userResponse.data)
            }
          }
          fetchUser()
          startSession()
          navigate('/')
        } else {
          setTime(8)
          setMessage(`Niepoprawne dane`)
          setPopupType('Warning')
          setTrigger(true)
        }
      })
  }

  return (
    <>
      <div key="login-page-vertical-wrapper" className={styles.VerticalWrapper}>
        <div className={styles.ParentHeaderWrapper}>
          <div className={styles.ContentWrapper}>
            <img src={logo} alt="logo" onClick={() => navigate('/')} />
          </div>
        </div>

        <div key="login-page-header-wrapper" className={styles.HeaderWrapper}>
          <h1>Register</h1>
          <div key="login-page-wrapper" className={styles.Wrapper}>
            <div key="login-register-wrapper" className={styles.LoginRegisterWrapper}>
              <Link to="/login" className={styles.defaultButton}>
                Login
              </Link>
              <button className={`${styles.defaultButton} ${styles.selectedButton}`}>Register</button>
            </div>
            <form onSubmit={handleRegister} key="login-page-form">
              <input
                type="email"
                name="email-input"
                id="email-input"
                placeholder="Email Address"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <input
                type="text"
                name="usernamename-input"
                id="username-input"
                placeholder="Username"
                value={userName}
                onChange={e => setUserName(e.target.value)}
              />
              <input
                type="text"
                name="name-input"
                id="name-input"
                placeholder="Name"
                value={name}
                onChange={e => setName(e.target.value)}
              />
              <input
                type="password"
                name="password-input"
                id="password-input"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <input type="submit" value="Register" />
            </form>
          </div>
        </div>
      </div>
      {popup}
    </>
  )
}

export default Register
