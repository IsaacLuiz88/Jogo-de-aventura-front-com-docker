import React, { useState } from 'react';
import './AvatarSelection.css'; // Estilos para a tela de seleção

const AvatarSelection = ({ onAvatarSelect }) => {
    const [selectedAvatar, setSelectedAvatar] = useState(null);
    const [nickname, setNickname] = useState('');

    const handleSelect = (avatar) => {
        setSelectedAvatar(avatar);
    };

    const handleStartGame = () => {
        if (selectedAvatar) {
            onAvatarSelect({ avatar: selectedAvatar });
        }
    };

    return (
        <div className="avatar-selection">
            <h1>Select your Milta</h1>
            <div className="avatar-options">
                <div className="avatar" onClick={() => handleSelect('milta-todes')}>
                    <img 
                        src="/milta-todes.png" 
                        alt="Milta para todes" 
                        className={selectedAvatar === 'milta-todes' ? 'selected' : ''} 
                    />
                    <h2>Milta for everyone</h2>
                </div>
                <div className="avatar" onClick={() => handleSelect('milta-meninos')}>
                    <img 
                        src="/milta-meninos.png" 
                        alt="Milta para meninos" 
                        className={selectedAvatar === 'milta-meninos' ? 'selected' : ''} 
                    />
                    <h2>Milta for boys</h2>
                </div>
            </div>
            <button onClick={handleStartGame}>Enter</button>
        </div>
    );
};

export default AvatarSelection;
