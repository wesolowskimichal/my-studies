import React, { useState, FormEvent, useEffect } from 'react'
import styles from './LogIn.module.scss'
import { Link, json, useLocation, useNavigate } from 'react-router-dom'
import logo from '/logo.svg'
import ApiService from '../../services/API/ApiService'
import TokenManagerServiceWrapper from '../../services/TokenManager/TokenManagerServiceWrapper'
import { ApiResponse } from '../../services/API/ApiResponse'
import { context } from '../../services/UserContext/UserContext'
import { useTitle } from '../../hooks/useTitle'

function LogIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const { state } = useLocation()
  const { sessionTimeOut } = state ? state : false
  const { setUser, title } = context()

  useTitle(`${title} | Login`)

  useEffect(() => {
    if (!ApiService.getInstance().isTokenExpired()) {
      navigate('/')
    }
  }, [])

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const response = await ApiService.getInstance()
      .getToken(email, password)
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
          TokenManagerServiceWrapper.launch().setTokenManagerService()
          navigate('/')
        } else {
          console.log('error while obtaining token')
        }
      })
  }

  return (
    <div className={styles.VerticalWrapper}>
      <div className={styles.ParentHeaderWrapper}>
        <div className={styles.ContentWrapper}>
          <img src={logo} alt="logo" onClick={() => navigate('/')} />
        </div>
      </div>

      <div className={styles.HeaderWrapper}>
        <h1>Login</h1>
        <div className={styles.Wrapper}>
          <div className={styles.LoginRegisterWrapper}>
            <button className={`${styles.defaultButton} ${styles.selectedButton}`}>Login</button>
            <Link to="/register" className={styles.defaultButton}>
              Register
            </Link>
          </div>
          <form onSubmit={handleLogin} key="login-page-form">
            <input
              type="text"
              name="email-input"
              id="email-input"
              placeholder="Email Address"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <input
              type="password"
              name="password-input"
              id="password-input"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <input type="submit" value="Login" />
          </form>
        </div>
      </div>
      {sessionTimeOut && (
        <div className={styles.SessionTimeOut}>
          <p>
            Twoja sesja wygasła! <br />
            Zaloguj się ponownie aby kontynuować
          </p>
        </div>
      )}
    </div>
  )
}

export default LogIn
