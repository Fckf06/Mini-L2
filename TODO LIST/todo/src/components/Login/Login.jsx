import authContext from '../../context';
import Styles from './Login.module.css'
import React from 'react'

export default function Login() {
  const ctx = React.useContext(authContext)

  function checkAuth(e) {
    e.preventDefault()
    const token = Math.floor(Math.random()*1000000)
    const date = Date.now()
    
    if (ctx.auth?.password === ctx.db?.password && ctx.auth?.login === ctx.auth.db?.login 
      && ctx.auth?.value === ctx.auth.db?.value && ctx.auth?.end > Date.now()) {

      ctx.setAuth(prev => {
        prev = {...prev, auth: true}
        localStorage.setItem('login', JSON.stringify(prev))
        return prev
      })

    } else if (ctx.auth?.password === ctx.auth.db?.password && ctx.auth?.login === ctx.auth.db?.login) {
      ctx.setAuth(prev => {
        prev = {...prev, auth: true, signup: false, value: token,
                db: {...prev.db, value: token, end: date + 60000}}
        localStorage.setItem('login', JSON.stringify(prev))
        return prev
      }) 
    }
  }
  return (
    <>
      <div className={Styles.Login}>
        <div>
          <h1>Login</h1>
          <span onClick={() => ctx.setAuth(prev => ({...prev, signup: true}))}>Signup</span>
          <form onSubmit={checkAuth}>
            <input
              placeholder="Enter a login"
              onChange={(e) => ctx.setAuth(prev => ({...prev, login: e.target.value}))}
            />
            <input
              placeholder="Enter a password"
              onChange={(e) => ctx.setAuth(prev => ({...prev, password: e.target.value}))}
            />
            <button>Log in</button>
          </form>
        </div>
      </div>
    </>
  )
}