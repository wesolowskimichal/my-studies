import React, { useState, FormEvent } from 'react'
import styles from './LogIn.module.scss'
import { Link } from 'react-router-dom'

function LogIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('logging in: ' + email + ' ' + password)
  }

  return (
    <div key="login-page-vertical-wrapper" className={styles.VerticalWrapper}>
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
              type="email"
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
