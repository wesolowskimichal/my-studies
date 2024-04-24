import React, { useState, FormEvent } from 'react'
import styles from './Register.module.scss'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../assets/logo-long.png'

function Register() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const [fname, sname] = name.trim().split(' ')
    console.log(fname + ' ' + sname)
    if (fname === undefined || sname === undefined) {
      console.log('ERROR')
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
        <h1>Register</h1>
        <div key="login-page-wrapper" className={styles.Wrapper}>
          <div key="login-register-wrapper" className={styles.LoginRegisterWrapper}>
            <Link to="/login" className={styles.defaultButton}>
              Login
            </Link>
            <button className={`${styles.defaultButton} ${styles.selectedButton}`}>Register</button>
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
  )
}

export default Register
