import React, {useState} from "react";
import './ForgotForm.css';
import { FaUser } from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";
import {useNavigate} from 'react-router-dom';


const ForgotForm = () =>{

    const navigate = useNavigate();
    const cancelButtonClick = () =>{
        navigate('/');
    };

    const [inputs, setInputs] = useState({
        email: '',
        secretAnswer: ''
    });

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name]: value}))
    }

    const forgot = async (event) =>{
        event.preventDefault();
        console.log(inputs);
        try{
            const response = await fetch(`https://localhost:7100/Account/forgot-password`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify(inputs),
            });
            if (!response.ok) {
                alert('Email or secret answer incorrect!');

            }
            alert('Check your email for new password!');
            navigate('/');
            
        }
        catch(error) {
            console.error("Error:", error);
        }
        
  } 

    return(
        <div className="forgot-form">
            <form action="">
                <h1>Forgot password?</h1>
                <div className='input-box'>
                    <input type="text" 
                    placeholder='Email' 
                    name="email"
                    id="email"
                    value={inputs.email || ""} onChange={handleChange}
                    required/>
                    <FaUser className='icon'/>
                </div>
                <div className='input-box'>
                    <input type="password" 
                    placeholder='Secret answer' 
                    name='secretAnswer'
                    id="secretAnswer"
                    value={inputs.secretAnswer || ""} onChange={handleChange}
                    required/>
                    <RiLockPasswordLine className='icon'/>
                </div>
                <div className="buttons-forgot">
                    <div className="submit-b">
                        <button className="submit-button" type='submit' onClick={forgot}>Submit</button>
                        <span></span>
                    </div>
                    <div className="cancel-b">
                        <button className="cancel" onClick={cancelButtonClick}>Cancel</button>
                        <span></span>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default ForgotForm;