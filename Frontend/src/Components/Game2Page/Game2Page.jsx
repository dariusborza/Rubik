import React, {useEffect, useState} from "react";
import './Game2Page.css';
import Navbar from "../Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import snakeVid from '../Assets/snake2.mp4';

const Game2Page = () =>{

    const navigate = useNavigate();
    const handleClick = () =>{
        navigate('/game2/2');
    }

    const [reviews, setReviews] = useState([]);
    const [reviewText, setReviewText] = useState([]);
    const [scores, setScores] = useState([]);

    useEffect(() => {
        const gameId = localStorage.getItem('gameId');
        fetch(`https://localhost:7100/Review/get-all-reviews?gameId=${gameId}`)
        .then(response => response.json())
        .then(data => {
            setReviews(data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }, []);

    const fetchReviews = async () =>{
        const gameId = localStorage.getItem('gameId');
        fetch(`https://localhost:7100/Review/get-all-reviews?gameId=${gameId}`)
        .then(response => response.json())
        .then(data => {
            setReviews(data);

        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const addReview = async (event) =>{
        event.preventDefault();
        console.log(reviewText);
        const gameId = localStorage.getItem('gameId');
        const userId = localStorage.getItem('userId');

        try{
            
            const response = await fetch(`https://localhost:7100/Review/save-review?gameId=${gameId}&userId=${userId}&reviewText=${reviewText}`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify(reviewText),
            });
            if (!response.ok) {
                alert('You cannot add an empty review!');
                const result = await response.json();
                navigate('/game2');
                fetchReviews();
            }
            const result = await response.json();
            setReviewText('');
            navigate('/game2');
            fetchReviews();
        }
        catch(error) {
            console.error("Error:", error);
        }
        
    } 

    useEffect(() => {
        const gameId = localStorage.getItem('gameId');
        fetch(`https://localhost:7100/GameHighscore/get-highscore-top?gameId=${gameId}`)
        .then(response => response.json())
        .then(data => {
            setScores(data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }, []);

    const handleReviewChange = (event) => {
        setReviewText(event.target.value);
      };

    
    return(
        <div>
            <Navbar/>
        <div className="game2">
            <div className="box">
                <div className="game-desc">
                    <div className="trailer" id="trailer_game2">
                        <video src={snakeVid} autoPlay loop muted></video>
                    </div>
                    <div className="description">
                        <div className="game-info">
                        <p id="game2_paragraph">Snake game can be played using W, A, S, D to move towards the apple. Hitting the borders or biting yourself will end the game.</p>
                        </div>
                        <div className="start-buttons">
                            <button className="start-button" onClick={handleClick}>Start Game</button>
                        </div>
                    </div>
                </div>
                <div className="review">
                <div className="input-button">
                    <div className="textarea">
                            <textarea placeholder="Write a review... (Max. 250 characters.)"
                            value={reviewText}
                            onChange={handleReviewChange} />
                    </div>
                    <div className="review-buttons">
                        <button 
                        className="review-button" 
                        type="submit"
                        onClick={addReview}>Add review
                        </button>
                    </div>
                    </div>
                    <div className="review-area">
                        {
                            reviews.map((review, index) => (
                               <div className="reviewText" key={index}>
                                    <div className="reviewNickname">{review.nickname}:</div>
                                    <div className="reviewUserText">{review.review}</div>
                                </div> 
                            ))
                        }
                    </div>
                </div>
            </div>
            <div id="top_game2">
                <h2 className='top-header'>Highscore ~ Snake</h2>
                <div className='top-info'>
                    <h3>Player:</h3>
                    <h3>Highscore:</h3>
                </div>
                <div className="gamehighscore-users">
                {
                    scores.map((scoreTop, index) => (
                        <div className='users-score-details' key={index}>
                                <div>{scoreTop.nickname}</div>
                                <div>{scoreTop.score}</div>
                        </div>
                    ))
                }
                </div>
            </div>
        
        </div>
        </div>
    );
}


export default Game2Page;
