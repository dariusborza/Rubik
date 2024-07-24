import React from 'react';
import './AvatarSelector.css'

const AvatarSelector = ({ currentAvatar, handleAvatarSelect }) => {
  const avatars = [
    'av1', 'av2', 'av3', 'av4', 'av5'
  ];

  return (
    <div className="modal-window">
      <h3>Select your avatar</h3>
      <div className="modal-window-img">
        {avatars.map((avatar, index) => (
          <img
            key={index}
            src={`http://localhost:8080/${avatar}.png`}
            alt={`Avatar ${index + 1}`}
            onClick={() => handleAvatarSelect(avatar)}

              className={`avatar-img ${currentAvatar === avatar ? 'selected' : ''}`}

          />
        ))}
      </div>
    </div>
  );
};

export default AvatarSelector;