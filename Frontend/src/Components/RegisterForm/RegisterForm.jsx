import React, { useState, useEffect } from "react";
import './RegisterForm.css';
import { FaUser } from "react-icons/fa";
import { IoEyeOffSharp } from "react-icons/io5";
import { IoEyeOutline } from "react-icons/io5";
import {useNavigate} from 'react-router-dom';

const RegisterForm = () => {
    const navigate = useNavigate();
    const cancelButtonClick = () =>{
        navigate('/');
    };
    
    const [inputs, setInputs] = useState({
        email: '',
        nickname: '',
        password: '',
        confirmPassword: '',
        secretAnswer: '',
        profilePicturePath: ''
    });


    const [errors, setErrors] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        const nicknameValid = !validateNickname(inputs.nickname);
        const passwordValid = !validatePassword(inputs.password);
        const confirmPasswordValid = !validateConfirmPassword(inputs.password);
        const secretAnswerValid = !validateSecretAnswer(inputs.secretAnswer);
        setIsFormValid(nicknameValid && passwordValid && confirmPasswordValid && secretAnswerValid);
    }, [inputs, errors]);


    const validateNickname = (nickname) => {
        if (!nickname) return 'Nickname is required';
        let error = '';
        if (nickname.length < 5 || nickname.length > 10) {
            error = 'Nickname must be between 5 and 10 characters.';
        } else if (!/^[a-zA-Z0-9]+$/.test(nickname)) {
            error = 'Nickname can only contain letters and numbers.';
    }
    return error;
    }

    const validatePassword = (password) => {
        if (!password) return 'Password is required';
        let error = '';
        if (password.length < 5 || password.length > 15) {
          error = 'Password must be between 5 and 15 characters.';
        }
        return error;
    }

    const validateEmail = (email) => {
        if (!email) return 'E-mail is required';
        let error = '';
        const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if(!email.match(mailformat)) {
            error = 'Email must have an email format.';
        } 
        return error;
    }

    const validateConfirmPassword = (confirmPassword) =>{
        if(!confirmPassword) return 'Repeating password is required';
        let error='';
        if(!(inputs.password === confirmPassword)){
            error = 'Passwords do not match';
        }
        return error;
    }

    const validateSecretAnswer = (secretAnswer) =>{
        if(!secretAnswer) return 'Secret answer is required';
        let error = '';
        if(secretAnswer.length < 3 || secretAnswer > 10){
            error = 'Secret answer must be between 3 and 10 characters.';
        } else if (!/^[a-zA-Z0-9]+$/.test(secretAnswer)) {
            error = 'Nickname can only contain letters and numbers.';
        }
        return error;
    }




    const handleChange = (event) => {
        const{name, value} = event.target;
        setInputs(values => ({...values, [name]: value}))

        let error = '';
        if (name === 'nickname') {
            error = validateNickname(value);
            setErrors((errors) => ({ ...errors, nickname: error}));
        } else if (name === 'password') {
            error = validatePassword(value);
            setErrors((errors) => ({ ...errors, password: error, confirmPassword: validateConfirmPassword(inputs.confirmPassword)}));
        }else if (name ==='email'){
            error = validateEmail(value);
            setErrors((errors) => ({ ...errors, email: error}));
        }else if (name === 'confirmPassword') {
            error = validateConfirmPassword(value);
            setErrors((errors) => ({ ...errors, confirmPassword: error}));
        }else if (name ==='secretAnswer'){
            error = validateSecretAnswer(value);
            setErrors((errors) => ({ ...errors, secretAnswer: error}))
        }

        setErrors(errors => ({...errors, [name]: error}));

    }

    const register = async (event) =>{
        event.preventDefault();
        console.log(inputs);
        inputs.profilePicturePath = 'profile';
        
        try{
           
            const response = await fetch(`https://localhost:7100/Account/register?email=${inputs.email}&nickname=${inputs.nickname}&secretAnswer=${inputs.secretAnswer}&password=${inputs.password}&profilePic=${inputs.profilePicturePath}`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: "POST"
                
            });
            if (!response.ok) {
                const result = await response.json();
                console.log(result);
                navigate('/');
                alert('Nickname already in use!')
            }
            const result = await response.json();
            navigate('/');

        }
        catch(error) {
            console.error("Error:", error);
        }
        
  } 

    const [showPassword, setShowPassword] = useState(false);
    const toggleShowPassword = (field) => {
        setShowPassword({
            ...showPassword,
            [field]: !showPassword[field]
        });
    };

    return(
        <div className="register-form">
            <form action="">
                <h1>Register</h1>

                <div className='input-box'>
                    <input type="email" placeholder='Email' name="email" value={inputs.email || ""} onChange={handleChange} required/>
                    {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
                    <FaUser className='icon'/>
                </div>
                
                <div className='input-box'>
                    <input type="text" placeholder='Nickname' name="nickname" value={inputs.nickname || ""} onChange={handleChange} required/>
                    {errors.nickname && <p style={{ color: 'red' }}>{errors.nickname}</p>}
                    <FaUser className='icon'/>
                </div>

                <div className='input-box'>
                    <input
                        type={showPassword.password ? "text" : "password"}
                        placeholder='Password'
                        name="password"
                        id="password"
                        value={inputs.password || ""}
                        onChange={handleChange}
                        required
                    />
                    {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
                    <div className='icon' onClick={() => toggleShowPassword('password')}>
                        {showPassword.password ? <IoEyeOutline /> : <IoEyeOffSharp />}
                    </div>
                </div>
                <div className='input-box'>
                    <input
                        type={showPassword.confirmPassword ? "text" : "password"}
                        placeholder='Repeat password'
                        id='confirmPassword'
                        name="confirmPassword"
                        value={inputs.confirmPassword || ""}
                        onChange={handleChange}
                        required
                    />
                    {errors.confirmPassword && <p style={{ color: 'red' }}>{errors.confirmPassword}</p>}
                    <div className='icon' onClick={() => toggleShowPassword('confirmPassword')}>
                        {showPassword.confirmPassword ? <IoEyeOutline /> : <IoEyeOffSharp />}
                    </div>
                </div>
                
                <div className='dropdown' required>
                    <select>
                        <option value="default" disabled selected>Choose a secret question</option>
                        <option>What is/was your first pet name?</option>
                        <option>What is your second name?</option>
                    </select>
                </div>


                <div className='input-box'>
                    <input type={showPassword.secretAnswer ? "text" : "password"} 
                    placeholder='Secret answer' 
                    name="secretAnswer" 
                    id="secretAnswer"
                    value={inputs.secretAnswer || ""} 
                    onChange={handleChange} 
                    required/>
                    {errors.secretAnswer && <p style={{ color: 'red' }}>{errors.secretAnswer}</p>}
                    <div className='icon' onClick={() => toggleShowPassword('secretAnswer')}>
                        {
                            showPassword.secretAnswer ? <IoEyeOutline/> : <IoEyeOffSharp/>
                        }
                    </div>
                </div>


                <div className="buttons-register">
                    <div className="register-button">
                        <button className="b-register" type='submit' onClick={register} disabled={!isFormValid} >Register</button>
                        <span></span>
                    </div>
                    <div className="cancel-button">
                        <button className="b-cancel" onClick={cancelButtonClick} >Cancel</button>
                    </div>
                    
                </div>
            </form>
        </div>
    );
}
export default RegisterForm;