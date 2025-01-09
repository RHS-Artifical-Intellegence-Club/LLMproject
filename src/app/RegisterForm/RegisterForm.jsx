import React, { useState } from 'react';
import './Register.css';
import { HiUserCircle } from "react-icons/hi2";
import { MdLock, MdEmail } from "react-icons/md";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";


const Register = () => {
  {
    return (
      <div className='wrapper'>
        <form action="">
          <h1>Sign Up</h1>
          <div className="input-box">
            <input type="Email" placeholder="Email" required/>
            <MdEmail className="icon"/>
  
          </div>
          <div className="input-box">
            <input type="text" placeholder="Username" required/>
            <HiUserCircle className="icon"/>
  
          </div>
          <div className="input-box">
            <input type="password" placeholder="Password" required/>
            <MdLock className="icon"/>
  
          </div>
          
  
      
          <button type = "submit">Register</button>
  
          <div className="register-link">
            <Link to="/login">Already have an account?</Link> 
          </div>
        </form> 
  
      </div>
    );
  }};

export default Register;