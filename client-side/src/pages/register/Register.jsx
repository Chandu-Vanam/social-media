import React, { useRef } from 'react'
import './register.css';
import axios from 'axios'
import { useNavigate } from 'react-router'
import {Link} from 'react-router-dom';

const Register = () => {

  const username = useRef();
  const email = useRef();
  const password = useRef();
  const passwordAgain = useRef();
  const history = useNavigate ();//redirect to previous page

  const handleclick = async (e) =>{
    e.preventDefault();

    if(passwordAgain.current.value !== password.current.value){
      passwordAgain.current.setCustomValidity("Password dont match");
    }
    else{
      const user = {
        username: username.current.value,
        email: email.current.value,
        password: password.current.value,
      }

      try{
        await axios.post('/auth/register', user)
        history.push('/login')
      }catch(err){
        console.log(err);
      }
    }
  }

  return (
    <div className='login'>
      <div className="loginWrapper">
        <div className="loginLeft">
            <h3 className="loginLogo">Lama</h3>
            <span className="loginDesc">this is the dec</span>
        </div>
        <div className="loginRight">
            <form className="loginBox" onSubmit={handleclick}>
                <input placeholder="Username" required ref={username} className="loginInput" />
                <input placeholder="Email" type='email' ref={email} required className="loginInput" />
                <input placeholder="Password" type='password' ref={password} required className="loginInput" min="6" />
                <input placeholder="Password Again" type='password' ref={passwordAgain} required className="loginInput" />
                <button className="loginButton" type='submit'>Sign Up</button>
                <button className="loginRegisterButton">
                  <Link to='/login' style={{textDecoration:"none",color:"white"}}>
                    Login
                  </Link>
                </button>
            </form>
        </div>
      </div>
    </div>
  )
}

export default Register
