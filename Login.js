import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import validation from './LoginValidation';
import axios from 'axios'
import { Navigate } from 'react-router-dom';

function Login() {
    const [values, setValues] = useState({
        email: '',
        password: ''
    })
    const navigate = useNavigate();
    
    const [errors, setErrors] = useState({})
    const handleInput = (event) =>{
        setValues(prev => ({...prev, [event.target.name]: [event.target.value]}))
    }
    const handleSubmit =(event) => {
        event.preventDefault();
        setErrors(validation(values));
        if(errors.email === "" && errors.password === ""){
            axios.post('http://localhost:8081/login', values)
            .then(res => {
                if(res.data === "success"){
                    Navigate('/SchedulingPage');
                }else {
                    alert("No record existed");
                }
            })
            .catch(err => console.log(err));
        }
    }
  return (
    <div className='d-flex justify-content-center align-items-center bg-dark bg-primary vh-100'>
        <div className='bg-white p-3 rounded w-25'>
        <h2>Login</h2>
            <form action='' onSubmit={handleSubmit}>
                <div className='mb-3'>
                    <label htmlFor='email'><strong>Email</strong></label>
                    <input type='email' placeholder='Enter the Email' name='email' onChange={handleInput} className='form-control rounded-0'/>
                    <span>{errors.email && <span className='text-danger'>{ errors.email}</span>}</span>
                </div>
                
                <div className='mb-3'>
                    <label htmlFor='Password'><strong>Password</strong></label>
                    <input type='password' placeholder='Enter the Password'name='password' onChange={handleInput}  className='form-control rounded-0'/>
                    <span>{errors.password && <span className='text-danger'>{ errors.password}</span>}</span>
                </div>
                <button  type='submit' className='btn btn-success w-100 rounded-0'><strong>Log In</strong></button>
                <p>You are agree to our terms and conditions</p>
                <Link to='/signup' className='btn btn-default border w-100 bg-light rounded-0 text-decoration-none'><strong>Create Account</strong></Link>
            </form>
        </div>
    </div>
  )
}

export default Login