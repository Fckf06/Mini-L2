import React from 'react';
import authContext from '../../context';
import Styles from './Signup.module.css'

export default function Signup({}) {

  const ctx = React.useContext(authContext)

  function createLogin(e) {
    e.preventDefault()
    const token = Math.floor(Math.random()*1000000)
    const date = Date.now()

    if (ctx.auth.password && ctx.auth.login) {

      ctx.setAuth(prev => {

       prev = {...prev, auth: true, signup: false, value: token,
          db: {login: ctx.auth.login, password: ctx.auth.password, value: token, end: date + 60000}
        }
      localStorage.setItem('login', JSON.stringify(prev))
      return prev
      })
    }
  }

  return (
    <>
      <div className={Styles.Signup}>
        <div>
          <h1>Signup</h1>
          <span onClick={() => ctx.setAuth(prev => ({...prev, signup: false}))}>Login</span>
          <form onSubmit={createLogin}>
            <input
              placeholder="Enter a login"
              onChange={(e) => ctx.setAuth(prev => ({...prev, login: e.target.value}))}
            />
            <input
              placeholder="Enter a password"
              onChange={(e) => ctx.setAuth(prev => ({...prev, password: e.target.value}))}
            />
            <button>Sign up</button>
          </form>
        </div>
      </div>
    </>
  )
}