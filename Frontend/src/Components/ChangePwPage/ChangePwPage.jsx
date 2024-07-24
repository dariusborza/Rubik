import React, {useState} from "react";
import './ChangePwPage.css';
import { useNavigate } from "react-router-dom";
import { IoEyeOffSharp } from "react-icons/io5";
import { IoEyeOutline } from "react-icons/io5";


const ChangePwPage = () =>{

    const navigate = useNavigate();
    const cancelButtonClick = () =>{
        navigate('/settings');
    }; 
    const [errors, setErrors] = useState({});

    const [inputs, setInputs] = useState({
        oldPassword: '',
        newPassword: '',
        repeatNewPassword: ''
    });


    const [showPassword, setShowPassword] = useState({
        oldPassword: false,
        newPassword: false,
        repeatNewPassword: false
    });


    const validatePassword = (password) => {
        if (!password) return 'Password is required';
        let error = '';
        if (password.length < 5 || password.length > 15) {
            error = 'Password must be between 5 and 15 characters.';
        }
        return error;
    };

    const validateConfirmPassword = (confirmPassword) => {
        if (!confirmPassword) return 'Repeating password is required';
        let error = '';
        if (!(inputs.newPassword === confirmPassword)) {
            error = 'Passwords do not match';
        }
        return error;
    };




    const toggleShowPassword = (field) => {
        setShowPassword(prevState => ({
            ...prevState,
            [field]: !prevState[field]
        }));
    };


    

    const handleChange = (event) => {
        const {name, value }= event.target;
        setInputs(values => ({...values, [name]: value}))

        let error = '';
        if (name === 'newPassword') {
            error = validatePassword(value);
            setErrors(errors => ({ ...errors, newPassword: error, repeatNewPassword: validateConfirmPassword(inputs.repeatNewPassword) }));
        } else if (name === 'repeatNewPassword') {
            error = validateConfirmPassword(value);
            setErrors(errors => ({ ...errors, repeatNewPassword: error }));
        }

        setErrors(errors => ({ ...errors, [name]: error }));
        
    }

    const changePassword = async (event) =>{
        event.preventDefault();
        console.log(inputs);
        if (inputs.newPassword !== inputs.repeatNewPassword) {
            alert('New passwords do not match!');
            return;
        }
        try{
            const userId = localStorage.getItem('userId')
            const response = await fetch(`https://localhost:7100/Account/update-password?userId=${userId}&oldPassword=${inputs.oldPassword}&newPassword=${inputs.newPassword}`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: "POST"
            });
            if (!response.ok) {
                navigate('/settings');
            }
            alert('New password was set!');
            navigate('/settings');
        }
        catch(error) {
            console.error("Error:", error);
        }
        
    } 

    return(
        <div className="change-pw">
            <form action="">
                <h1>Change password</h1>
                <div className='input-box'>
                    <input 
                    // type="password" 
                    type={showPassword.oldPassword ? "text" : "password"}
                    placeholder='Old password'
                    name="oldPassword"
                    id="oldPassword"
                    value={inputs.oldPassword}
                    onChange={handleChange}
                    required/>
                    <div className='icon' onClick={() => toggleShowPassword('oldPassword')}>
                        {showPassword.oldPassword ? <IoEyeOutline /> : <IoEyeOffSharp />}
                    </div>
                </div>
                
                <div className='input-box'>
                    <input 
                    // type="password" 
                    type={showPassword.newPassword ? "text" : "password"}
                    placeholder='New password'
                    name="newPassword"
                    id="newPassword"
                    value={inputs.newPassword}
                    onChange={handleChange}
                    required/>
                    {errors.newPassword && <p style={{ color: 'red' }}>{errors.newPassword}</p>}
                    <div className='icon' onClick={() => toggleShowPassword('newPassword')}>
                        {showPassword.newPassword ? <IoEyeOutline /> : <IoEyeOffSharp />}
                    </div>
                </div>
                
                <div className='input-box'>
                    <input 
                    // type="password" 
                    type={showPassword.repeatNewPassword ? "text" : "password"}
                    placeholder='Repeat new password'
                    name="repeatNewPassword"
                    id="repeatNewPassword"
                    value={inputs.repeatNewPassword}
                    onChange={handleChange}
                    required/>
                    {errors.repeatNewPassword && <p style={{ color: 'red' }}>{errors.repeatNewPassword}</p>}
                     <div className='icon' onClick={() => toggleShowPassword('repeatNewPassword')}>
                        {showPassword.repeatNewPassword ? <IoEyeOutline /> : <IoEyeOffSharp />}
                    </div>
                </div>

                <div className="buttons-chpw">
                    <div className="reset-button">
                        <button className="b-reset" 
                        type='submit'
                        onClick={changePassword}>Reset password</button>
                        <span></span>
                    </div>
                    <div className="ch-chancel-button">
                        <button className="b-ch-cancel" type='button' onClick={cancelButtonClick}>Cancel</button>
                    </div>
                </div>
            </form>
        </div>
    );
}


export default ChangePwPage;