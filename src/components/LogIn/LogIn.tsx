import React, { useState, FormEvent, Dispatch, SetStateAction, useEffect } from 'react'
import styles from './LogIn.module.scss'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import logo from '../../assets/logo-long.png'
import axios from 'axios'
import { getUserFromApi } from '../api/functions'

function LogIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const apiUser = await getUserFromApi()
        console.log(apiUser)
        navigate('/')
      } catch (error) {
        console.error(error)
      }
    }
    fetchUser()
  }, [])

  const getTokenFromAPI = async () => {
    try {
      const response = await axios.post(
        '/api/token/',
        {
          username: email,
          password: password
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      return response.data
    } catch (error) {
      throw error
    }
  }

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const token = await getTokenFromAPI()
      console.log(token)
      const access = token.access
      const refresh = token.refresh
      localStorage.setItem('accessToken', access)
      localStorage.setItem('refreshToken', refresh)
      navigate('/')
    } catch (error) {
      console.error('Error fetching user: ', error)
    }
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
