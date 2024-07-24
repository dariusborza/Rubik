/* eslint-disable react/style-prop-object */
import React, {useState} from 'react';
import './LoginForm.css';
import { FaUser } from "react-icons/fa";
import { IoEyeOffSharp } from "react-icons/io5";
import { IoEyeOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';


const LoginForm = () => {

    const navigate = useNavigate();

    const [inputs, setInputs] = useState({});

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name]: value}))
    }

    const [showPassword, setShowPassword] = useState(false);
    const toggleShowPassword = (field) => {
        setShowPassword({
            ...showPassword,
            [field]: !showPassword[field]
        });
    };


    
    const login = async (event) =>{
        event.preventDefault();
        console.log(inputs);
        try{
            
            const response = await fetch("https://localhost:7100/Login/login", {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify(inputs),
            });
            if (!response.ok) {
                alert('Nickname or password incorrect!');

            }
            const result = await response.json();
            localStorage.setItem('userId', result.userId);
            console.log("Success:", result);
            navigate('/home');
        }
        catch(error) {
            console.error("Error:", error);
        }
        
    } 


    return (
        <div className='login'>
            <form action="">
                <h1>Login</h1>
                <div className='input-box'>
                    <input type="text" placeholder='Nickname' name='nickname' value={inputs.nickname || ""} onChange={handleChange} required/>
                    <FaUser className='icon'/>
                </div>
                <div className='input-box'>
                    <input placeholder='Password' 
                        id='password'
                        type={showPassword.password ? "text" : "password"}
                        name='password'
                        value={inputs.password || ""}
                        onChange={handleChange}
                        required/>
                    <div className='icon' onClick={() => toggleShowPassword('password')}>
                        {
                            showPassword.password ? <IoEyeOutline/> : <IoEyeOffSharp/>
                        }
                    
                    </div>
                </div>
                <div className='login-button' onClick={login}>
                    <button>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        Submit
                    </button>
                </div>
                <div className='forgot-password'>
                    <p><a href = "/forgot">Forgot password?</a></p>
                </div>
                <div className='register-link'>
                    <p>Don't have an account?<a href="/register"> Register!</a></p>
                </div>
            </form>
        </div>
    );
}


export default LoginForm;