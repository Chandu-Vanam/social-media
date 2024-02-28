import React, { useContext } from 'react'
import { useRef } from 'react';
import './login.css';
import {loginCall} from '../../apiCalls';
import { AuthContext } from '../../context/authContext.jsx'
// import { CircularProgress } from '@mui/material'

const Login = () => {
  const email = useRef();
  const password = useRef();
  const {user, isFetching, error, dispatch} = useContext(AuthContext);

  const handleClick = (e) =>{
    e.preventDefault();
    loginCall({email:email.current.value,password:password.current.value},dispatch)
  };
  
  return (
    <div className='login'>
      <div className="loginWrapper">
        <div className="loginLeft">
            <h3 className="loginLogo">Lama</h3>
            <span className="loginDesc">this is the dec</span>
        </div>
        <div className="loginRight">
            <form className="loginBox" onSubmit={handleClick}>
                <input type="email" placeholder='Email' className="loginInput" ref={email} required/>
                <input type="password" placeholder='Password' minLength='6' className="loginInput" ref={password} required/>
                <button className="loginButton" type='submit' disabled={isFetching}>
                   {/* {isFetching ? <CircularProgress color='white' size="15px" />: "Login"} */}
                   Login
                   </button>
                <span className="loginForgot">Forgot Password?</span>
                <button className="loginRegisterButton">
                    {/* {isFetching ? <CircularProgress color='white' size="15px" />: "Create a New Account"} */}
                    Create account
                </button>
            </form>
        </div>
      </div>
    </div>
  )
}

export default Login
