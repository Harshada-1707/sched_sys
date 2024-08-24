import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import validation from './SignupValidation';
import axios from 'axios';

function Signup() {
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleInput = (event) => {
        setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const validationErrors = validation(values);
        setErrors(validationErrors);

        if (Object.values(validationErrors).every(error => error === "")) {
            try {
                await axios.post('http://localhost:8081/signup', values);
                navigate('/');
            } catch (err) {
                console.error(err);
            }
        }
    };

    return (
        <div className='d-flex justify-content-center align-items-center bg-dark bg-primary vh-100'>
            <div className='bg-white p-3 rounded w-25'>
                <h2>Sign-Up</h2>
                <form onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor='name'><strong>Name</strong></label>
                        <input
                            type='text'
                            id='name'
                            name='name'
                            placeholder='Enter the Name'
                            onChange={handleInput}
                            className='form-control rounded-0'
                        />
                        <span>{errors.name && <span className='text-danger'>{errors.name}</span>}</span>
                    </div>
                    <div className='mb-3'>
                        <label htmlFor='email'><strong>Email</strong></label>
                        <input
                            type='email'
                            id='email'
                            name='email'
                            placeholder='Enter the Email'
                            onChange={handleInput}
                            className='form-control rounded-0'
                        />
                        <span>{errors.email && <span className='text-danger'>{errors.email}</span>}</span>
                    </div>
                    <div className='mb-3'>
                        <label htmlFor='password'><strong>Password</strong></label>
                        <input
                            type='password'
                            id='password'
                            name='password'
                            placeholder='Enter the Password'
                            onChange={handleInput}
                            className='form-control rounded-0'
                        />
                        <span>{errors.password && <span className='text-danger'>{errors.password}</span>}</span>
                    </div>
                    <button type='submit' className='btn btn-success w-100 rounded-0'><strong>Sign up</strong></button>
                    <p>You agree to our terms and conditions</p>
                    <Link to='/' className='btn btn-default border w-100 bg-light rounded-0 text-decoration-none'><strong>Log In</strong></Link>
                </form>
            </div>
        </div>
    );
}

export default Signup;
