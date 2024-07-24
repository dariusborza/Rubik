import React, {useState, useEffect} from "react";
import './SettingsPage.css';
import dogImage from '../Assets/dog.jpg';
import { useNavigate} from 'react-router-dom';
import Modal from 'react-modal';
import AvatarSelector from "../AvatarSelector/AvatarSelector";

Modal.setAppElement('#root');

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '520px', 
        height: '420px', 
      },
      overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.85)' 
      }
}


const SettingsPage = () => {

    const [changeButton, setChangeButton] = useState(false);
    const [isEditable, setIsEditable] = useState(false);
    const [previousNickname, setPreviousNickname] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);  
    const [selectedAvatar, setSelectedAvatar] = useState(dogImage);
    const [tempAvatar, setTempAvatar] = useState(selectedAvatar);
    
    const [isDivUnclickable, setIsDivUnclickable] = useState(false);

    const visibilityButton = () =>{
        if (!changeButton) {
            setPreviousNickname(nickname);
        } else {
            setNickname(previousNickname);
        }
        setChangeButton(!changeButton);
        setIsEditable(!isEditable);
        setIsDivUnclickable(!isDivUnclickable);
    };
    
    const navigate = useNavigate();
    const changePasswordButton = () =>{
        navigate('/change');
    };
    const cancelButtonClick = () =>{
        navigate('/home');
    };

    const [nickname, setNickname] = useState('');
    const [profilePicturePath, setProfilePicturePath] = useState('');

    const fetchNickname = async () =>{
        try {
            const userId = localStorage.getItem('userId');
            const response = await fetch(`https://localhost:7100/Account/get-user-settings?id=${userId}`, {
                method: 'GET',
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            const data = await response.json();
            setNickname(data.nickname);
            // setProfilePicturePath(data.profilePicturePath);
            setProfilePicturePath(`http://localhost:8080/${data.profilePicturePath}.png`);
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    useEffect(() => {
        fetchNickname();
    }, []);


    const openModal = () => {
        setTempAvatar(selectedAvatar); 
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        fetchNickname();
    };

    const handleAvatarSelect = (avatar) => {
        setTempAvatar(avatar); 
      };
    
    const saveAvatar = async (event) => {
        event.preventDefault();
        try{
            const userId = localStorage.getItem('userId');
            const response = await fetch(`https://localhost:7100/Account/update-profile-picture?userId=${userId}&picturePath=${tempAvatar}`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: "POST"
            });
            if (!response.ok) {
                closeModal();
            }
        }
        catch(error) {
            console.error("Error:", error);
        }
    };

    const saveNickname = async (event) =>{
        event.preventDefault();
        try{
            const userId = localStorage.getItem('userId');
            const response = await fetch(`https://localhost:7100/Account/update-nickname?userId=${userId}&nickname=${nickname}`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: "POST"
            });
            if (!response.ok) {
                visibilityButton();
                fetchNickname();
            }

        }
        catch(error) {
            console.error("Error:", error);
        }

        
    }



    return(
        <div className='wrapper-settings'>
            <form action="">
                <h1>Settings</h1>
                <div className="container">
                    <div className='photo' onClick={!isDivUnclickable ? openModal : null} 
                    style={{cursor: isDivUnclickable ? 'default' : 'pointer',
                        pointerEvents: isDivUnclickable ? 'none' : 'auto',
                        opacity: isDivUnclickable ? 0.5 : 1}}>
                        <img src ={profilePicturePath} alt='Avatar'/>
                        <span className="tooltip">Change pic</span>
                    </div>
                    <div className='input-box'>
                        <div className="div-input">
                            <input type="text" 
                            value={nickname} 
                            onChange={(e) => setNickname(e.target.value)}
                            disabled={!isEditable}
                            required/>
                            { changeButton && (
                            <button className="settings-submit" 
                            type="submit"
                            onClick={saveNickname}>Submit</button>
                            )}
                        </div>          
                    <div className="div-change-nick">
                        <div className="change-nickname">
                            <button onClick={visibilityButton} className="change-nick" type='button'>
                                {changeButton ? 'Nevermind!' : 'Change nickname'}
                            </button>
                        </div>
                     </div>
                     </div>
                     <div className="buttons-change">
                        <div className="div-change-pw">
                            <button className="change-pw" onClick={changePasswordButton}>Change password</button>
                            <span></span>
                        </div>
                        <div className="div-cancel">
                            <button className="b-cancel" onClick={cancelButtonClick}>Cancel</button>
                        </div>
                    </div>
                </div>
            </form>

            <Modal 
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Select Avatar"
                
            >
                <AvatarSelector 
                    userId="userId" 
                    currentAvatar={selectedAvatar} 
                    handleAvatarSelect={handleAvatarSelect} 
                />
                <div style={{display:'flex', justifyContent:'space-evenly', marginTop:'40px', width:'100%', height:'6vh'}}>
                    <div style={{height:'100%', width:'50%', display:'flex', justifyContent:'center'}}>
                        <button className="save-avatar" onClick={saveAvatar}>Save</button>
                        <span></span>
                    </div>
                    <div style={{height:'100%', width:'50%', display:'flex', justifyContent:'center'}}>
                        <button className="close-avatar" onClick={closeModal}>Close</button>
                    </div>
                </div>
            </Modal>


        </div>
    );
}


export default SettingsPage;