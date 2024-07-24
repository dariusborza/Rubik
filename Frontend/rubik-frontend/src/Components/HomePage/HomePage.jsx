import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import snake from '../Assets/snake3.png';
import rockPaperScissors from '../Assets/rockpaperscissors.png';
import flappy from '../Assets/jumpy.png';
import tictactoe from '../Assets/tictactoe.png';
import Navbar from '../Navbar/Navbar';

const HomePage = () => {

    const navigate = useNavigate();
    const handleClick1 = () => {
        localStorage.setItem('gameId', 'abc')
        navigate('/game1');
    }
    const handleClick2 = () => {
        localStorage.setItem('gameId', 'snk')
        navigate('/game2');
    }
    const handleClick3 = () => {
        localStorage.setItem('gameId', 'rock')
        navigate('/game3');
    }
    const handleClick4 = () => {
        localStorage.setItem('gameId', 'jumpy')
        navigate('/game4');
    }

    const [nickname, setNickname] = useState('');
    const [level, setLevel] = useState('');
    const [profilePicturePath, setProfilePicturePath] = useState('');
    
    useEffect(() => {
        const fetchProfile = async () => {
        try {
            const userId = localStorage.getItem('userId');
            const response = await fetch(`https://localhost:7100/Account/my-profile?id=${userId}`, {
                method: 'GET',
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            const data = await response.json();
            setNickname(data.nickname);
            setLevel(data.level);
            setProfilePicturePath(`http://localhost:8080/${data.profilePicturePath}.png`);
            console.log(data);
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
        };
    
        fetchProfile();
    }, []);

    const [topUsers, setTopUsers] = useState([]);

    useEffect(() => {
        fetch('https://localhost:7100/HomeTop/get-home-top')
        .then(response => response.json())
        .then(data => {
            setTopUsers(data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }, []);
    
    return(
        <div>

            <Navbar/>
        <div className='home'>
            <div className='profile'>
                <div className='photo'>
                    <img src={profilePicturePath} alt = 'Profile'/>
                </div>
                <div className='info'>
                    <label>Nickname: {nickname} </label>
                    <label>Level: {level}</label>
                </div>
                <div className='settings'>
                    <a href="/settings" >Account settings</a>
                </div>
            </div>
            <div className='top'>
                <h2 className='top-header'>Top players</h2>
                <div className='top-info'>
                    <h3>Player:</h3>
                    <h3>Level:</h3>
                </div>
                {
                    topUsers.map((user, index) => (
                        <div className='home-top' key={index}>
                            <div className='home-top-row'>
                                <div className='nick'>{user.nickname}</div>
                                <div className='lvl'>{user.level}</div>
                            </div>
                        </div>
                    ))
                }
            </div>
            <div className='games'>
                <div className='game' id='game1' onClick={handleClick1}>
                    <img className="image" src={tictactoe} alt = ''/>
                    <div className="middle">
                        <div className="game-text">Tic-Tac-Toe</div>
                     </div>
                </div>
                <div className='game' id='game2' onClick={handleClick2}>
                    <img className="image" src={snake} alt = ''/>
                    <div className="middle">
                        <div className="game-text">Snake game</div>
                    </div>
                </div>
                <div className='game' id='game3' onClick={handleClick3}>
                    <img className="image" src={rockPaperScissors} alt = ''/>
                    <div className="middle">
                        <div className="game-text">Rock-Paper-scissors</div>
                    </div>
                </div>
                <div className='game' id='game4' onClick={handleClick4}>
                    <img className="image" src={flappy} alt = ''/>
                    <div className="middle">
                        <div className="game-text">Jumpy game</div>
                    </div>
                </div>
            </div>

        </div>
        </div>
    );
}

export default HomePage;