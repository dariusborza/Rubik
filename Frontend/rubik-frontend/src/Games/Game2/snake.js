import React, { useState, useRef, useEffect } from "react";
import { useInterval } from "./useInterval";
import {
  CANVAS_SIZE,
  SNAKE_START,
  APPLE_START,
  SCALE,
  SPEED,
  DIRECTIONS
} from "./constants";



const Snake = () => {
    const canvasRef = useRef();
    const [snake, setSnake] = useState(SNAKE_START);
    const [apple, setApple] = useState(APPLE_START);
    const [dir, setDir] = useState([0, -1]);
    const [speed, setSpeed] = useState(null);
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [finalScore, setFinalScore] = useState(0);

    useInterval(() => gameLoop(), speed);

    const endGame = () => {
      setSpeed(null);
      setGameOver(true);
      setFinalScore(prev => prev + score); 
    localStorage.setItem('finalScore', finalScore + score);
    };

    const moveSnake = ({ keyCode }) =>
      keyCode >= 37 && keyCode <= 40 && setDir(DIRECTIONS[keyCode]);

    const createApple = () =>
      apple.map((_a, i) => Math.floor(Math.random() * (CANVAS_SIZE[i] / SCALE)));

    const checkCollision = (piece, snk = snake) => {
      if (
        piece[0] * SCALE >= CANVAS_SIZE[0] ||
        piece[0] < 0 ||
        piece[1] * SCALE >= CANVAS_SIZE[1] ||
        piece[1] < 0
      )
        return true;

      for (const segment of snk) {
        if (piece[0] === segment[0] && piece[1] === segment[1]) return true;
      }
      return false;
    };

    const checkAppleCollision = newSnake => {
      if (newSnake[0][0] === apple[0] && newSnake[0][1] === apple[1]) {
        let newApple = createApple();
        while (checkCollision(newApple, newSnake)) {
          newApple = createApple();
        }
        setApple(newApple);
        setScore(prev =>prev + 1);
        return true;
      }
      return false;
    };

    const gameLoop = () => {
      const snakeCopy = JSON.parse(JSON.stringify(snake));
      const newSnakeHead = [snakeCopy[0][0] + dir[0], snakeCopy[0][1] + dir[1]];
      snakeCopy.unshift(newSnakeHead);
      if (checkCollision(newSnakeHead)) endGame();
      if (!checkAppleCollision(snakeCopy)) snakeCopy.pop();
      setSnake(snakeCopy);
    };

    const startGame = () => {
      setSnake(SNAKE_START);
      setApple(APPLE_START);
      setDir([0, -1]);
      setSpeed(SPEED);
      setGameOver(false);
      setScore(0);
    };

    useEffect(() => {
      const storedFinalScore = localStorage.getItem('finalScore');
      if (storedFinalScore) {
        setFinalScore(parseInt(storedFinalScore));
      }
    window.addEventListener('keydown', moveSnake);
    return () => window.removeEventListener('keydown', moveSnake);
  }, []);

    useEffect(() => {
      const context = canvasRef.current.getContext("2d");
      context.setTransform(SCALE, 0, 0, SCALE, 0, 0);
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      context.fillStyle = "green";
      snake.forEach(([x, y]) => context.fillRect(x, y, 1, 1));
      context.fillStyle = "red";
      context.fillRect(apple[0], apple[1], 1, 1);
    }, [snake, apple, gameOver]);

    const exitFunction = async (event) =>{
      event.preventDefault();
      console.log(finalScore);
      const gameId = localStorage.getItem('gameId');
      const userId = localStorage.getItem('userId');
      try{
          
          const response = await fetch(`https://localhost:7100/GameHighscore/save-score?gameId=${gameId}&userId=${userId}&score=${finalScore}`, {
              headers: {
                  'Content-Type': 'application/json'
              },
              method: "POST",
              body: JSON.stringify(finalScore),
          });
          if (!response.ok) {
              localStorage.removeItem('finalScore');
              window.location.href =  '/game2';
  
          }
          const result = await response.json();
          console.log("Success:", result);
          localStorage.removeItem('finalScore');
          window.location.href =  '/game2';
      }
      catch(error) {
          console.error("Error:", error);
      }
      
  }

  return (
    <div role="button" tabIndex="0" onKeyDown={e => moveSnake(e)}
    style={{ backgroundColor: "lightgrey", display: "inline-block", zIndex:10 }}
    >
      <canvas
        style={{ border: "1px solid black" }}
        ref={canvasRef}
        width={`${CANVAS_SIZE[0]}px`}
        height={`${CANVAS_SIZE[1]}px`}
      />
      {gameOver && <div 
        style={{color: 'red', 
        fontWeight: 'bold',
        display:'flex',
        justifyContent:'center'
        }} >
        GAME OVER!
        </div>}
      <div style={{color: 'blue', fontWeight: 'bold'}}>Score: {score}</div>
      <div style={{color: 'blue', fontWeight: 'bold'}}>Final score: {finalScore}</div>
      <div style={{position: "relative", display: "flex", justifyContent:"space-around"}}>
        <button onClick={startGame}>Start Game</button>
        <button onClick={exitFunction} className="exit-button-game">Exit</button>
      </div>
    </div>
  );
};

export default Snake;
