import { useEffect, useState } from 'react'
import './rock.css'

const Rock = () => {
  const [userChoice, setUserChoice] = useState('rock')
  const [computerChoice, setComputerChoice] = useState('rock')
  const [userPoints, setUserPoints] = useState(0)
  const [computerPoints, setComputerPoints] = useState(0)
  const [turnResult, setTurnResult] = useState(null)
  const [result, setResult] = useState('Player vs Computer')
  const [gameOver, setGameOver] = useState(false)
  const choices = ['rock', 'paper', 'scissors']

  const userImgPath = require(`./images/${userChoice}.png`)
  const computerImgPath = require(`./images/${computerChoice}.png`)

  const [finalScore, setFinalScore] = useState(null);

  const handleClick = (value) => {
    setUserChoice(value)    
    generateComputerChoice()
  }

  const generateComputerChoice = () => {
    const randomChoice = choices[Math.floor(Math.random() * choices.length)]
    setComputerChoice(randomChoice)
  }

  const reset = () => {
    setUserChoice('rock');
    setComputerChoice('rock');
    setUserPoints(0);
    setComputerPoints(0);
    setTurnResult(null);
    setResult('Player vs Computer');
    setGameOver(false);
  }


  useEffect(() => {
    const storedFinalScore = localStorage.getItem('finalScore');
    if (storedFinalScore) {
      setFinalScore(parseInt(storedFinalScore));
    }
  }, []);

  useEffect(() => {
    const comboMoves = userChoice + computerChoice
    if (userPoints <= 4 && computerPoints <= 4) {
      if (comboMoves === 'scissorspaper' || comboMoves === 'rockscissors' || comboMoves === 'paperrock') {
        const updatedUserPoints = userPoints + 1
        setUserPoints(updatedUserPoints)
        setTurnResult('User gets the point!')
        if (updatedUserPoints === 5){
          setResult('User Wins')
          const newFinalScore = finalScore + (updatedUserPoints - computerPoints);
          setFinalScore(newFinalScore);
          const gameOff = true
          setGameOver(gameOff)
        }
      }

      if (comboMoves === 'paperscissors' || comboMoves === 'scissorsrock' || comboMoves === 'rockpaper') {
        const updatedComputerPoints = computerPoints + 1
        setComputerPoints(updatedComputerPoints)
        setTurnResult('Computer gets the point!')
        if (updatedComputerPoints === 5) {
          setResult('Computer Wins')
          const gameOff = true
          setGameOver(gameOff)
        }
      }

      if (comboMoves === 'paperpaper' || comboMoves === 'rockrock' || comboMoves === 'scissorsscissors') {
        setTurnResult('No one gets a point!')
      }
    }
  }, [computerChoice, userChoice])


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
            window.location.href =  '/game3';
        }
        const result = await response.json();
        console.log("Success:", result);
        localStorage.removeItem('finalScore');
        window.location.href =  '/game3';
    }
    catch(error) {
        console.error("Error:", error);
    }
    
}

  return (
    <div className="App" style={{zIndex:10}}>
      <h1 className='heading'>Rock-Paper-Scissors</h1>
      <div className='score'>
        <h1>User Points: {userPoints}</h1>
        <h1>Computer Points: {computerPoints}</h1>
      </div>

      <div className='choice'>
        <div className='choice-user'>
          <img className='user-hand' src={userImgPath} alt=''></img>
        </div>
        <div className='choice-computer'>
          <img className='computer-hand' src={computerImgPath} alt=''></img>
        </div>
      </div>
      
      <div className='button-div'>
        {choices.map((choice, index) =>
          <button className='button' key={index} onClick={() => handleClick(choice)} disabled={gameOver}>
            {choice} 
          </button>
        )}
      </div>
      
      <div className='result'>
        <h1>Turn Result: {turnResult}</h1>
        <h1>Final Result: {result}</h1>
      </div>
      <div style={{display: "flex", justifyContent:"space-around"}}>
      <div className='button-div'>
        {gameOver && 
          <button className='button' onClick={() => reset()}>Restart?</button>
        }
      </div >
      <div id='rock-exit-button'> 
          <button onClick={exitFunction} className="exit-button-game">
              Exit
          </button>
      </div>
      </div>
      <div style={{display:'flex', justifyContent: 'center'}}>
        <h2>Final Score: {finalScore}</h2>
      </div>
    </div>
  )
}

export default Rock