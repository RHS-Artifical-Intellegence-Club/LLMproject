import React from "react";
import './LoginForm.css'
import { HiUserCircle } from "react-icons/hi2";
import { MdLock } from "react-icons/md";
import { Link } from "react-router-dom"; // Import Link component

const LoginForm = () => {
  return (
    <div className='wrapper'>
      <form action="">
        <h1>Login</h1>
        <div className="input-box">
          <input type="text" placeholder="Username" required/>
          <HiUserCircle className="icon"/>

        </div>
        <div className="input-box">
          <input type="password" placeholder="Password" required/>
          <MdLock className="icon"/>

        </div>

        <div className="remember-forgot">
          <label>
            <input type="checkbox"/>Remember Me
          </label>
          <Link to="/forgot-password">Forgot password?</Link> 
        </div>

        <button type = "submit">Login</button>

        <div className="register-link">
          <Link to="/register">Don't have an account?</Link>
        </div>
      </form> 

    </div>
  );
}
export default LoginForm;