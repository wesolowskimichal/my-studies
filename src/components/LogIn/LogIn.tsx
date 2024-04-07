import React, { useState, FormEvent, Dispatch, SetStateAction, useEffect } from 'react'
import styles from './LogIn.module.scss'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import logo from '../../assets/logo-long.png'
import ApiService from '../../services/API/ApiService'
import { ApiResponse } from '../../services/API/ApiResponse'

function LogIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

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
        console.log(response)
        if (response.responseCode === ApiResponse.POSITIVE) {
          localStorage.setItem('accessToken', response.data!.access)
          localStorage.setItem('refreshToken', response.data!.refresh)
          navigate('/')
        } else {
          console.log('error while obtaining token')
        }
      })
  }

  return (
    <div key="login-page-vertical-wrapper" className={styles.VerticalWrapper}>
      <div className={styles.ParentHeaderWrapper}>
        <div className={styles.ContentWrapper}>
          <img src={logo} alt="logo" onClick={() => navigate('/')} />
        </div>
      </div>

      <div key="login-page-header-wrapper" className={styles.HeaderWrapper}>
        <h1>Login</h1>
        <div key="login-page-wrapper" className={styles.Wrapper}>
          <div key="login-register-wrapper" className={styles.LoginRegisterWrapper}>
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
    </div>
  )
}

export default LogIn
