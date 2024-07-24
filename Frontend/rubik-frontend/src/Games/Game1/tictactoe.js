import './tictactoe.css';
import Board from "./board";
import Square from "./square";
import {useState, useEffect} from 'react';

const defaultSquares = () => (new Array(9)).fill(null);

const lines = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6],
];

function Tictactoe() {
  const [squares, setSquares] = useState(defaultSquares());
  const [winner,setWinner] = useState(null);
  const [score, setScore] = useState(0);
  const [finalScore, setFinalScore] = useState(0);

  useEffect(() => {
    const storedFinalScore = localStorage.getItem('finalScore');
    if (storedFinalScore) {
      setFinalScore(parseInt(storedFinalScore));
    }
  }, []);

  useEffect(() => {
    if(winner){
      return;
    }

    const isComputerTurn = squares.filter(square => square !== null).length % 2 === 1;
    const linesThatAre = (a,b,c) => {
      return lines.filter(squareIndexes => {
        const squareValues = squareIndexes.map(index => squares[index]);
        return JSON.stringify([a,b,c].sort()) === JSON.stringify(squareValues.sort());
      });
    };


    const emptyIndexes = squares
      .map((square,index) => square === null ? index : null)
      .filter(val => val !== null);
    const playerWon = linesThatAre('x', 'x', 'x').length > 0;
    const computerWon = linesThatAre('o', 'o', 'o').length > 0;

    if (playerWon) {
      setWinner('x');
      setScore(score => score + 10);
      setFinalScore(finalScore => finalScore + 10);
      localStorage.setItem('finalScore', finalScore + 10);
    } else if (computerWon) {
      setWinner('o');
      setScore(score => Math.max(score-2, 0));
      setFinalScore(finalScore => Math.max(finalScore - 2, 0));
      localStorage.setItem('finalScore', Math.max(finalScore - 2, 0));
    } else if (emptyIndexes.length === 0) {
      setWinner('draw');
    }

    const putComputerAt = index => {
      let newSquares = squares;
      newSquares[index] = 'o';
      setSquares([...newSquares]);
    };

    
    if (isComputerTurn && !playerWon && !computerWon && emptyIndexes.length > 0) {

      const winingLines = linesThatAre('o', 'o', null);
      if (winingLines.length > 0) {
        const winIndex = winingLines[0].filter(index => squares[index] === null)[0];
        putComputerAt(winIndex);
        return;
      }

      const linesToBlock = linesThatAre('x', 'x', null);
      if (linesToBlock.length > 0) {
        const blockIndex = linesToBlock[0].filter(index => squares[index] === null)[0];
        putComputerAt(blockIndex);
        return;
      }

      const linesToContinue = linesThatAre('o', null, null);
      if (linesToContinue.length > 0) {
        putComputerAt(linesToContinue[0].filter(index => squares[index] === null)[0]);
        return;
      }

      const randomIndex = emptyIndexes[ Math.ceil(Math.random()*emptyIndexes.length) ];
      putComputerAt(randomIndex);
    }
  }, [squares, winner, finalScore]);



  function handleSquareClick(index) {
    const isPlayerTurn = squares.filter(square => square !== null).length % 2 === 0;
    if (isPlayerTurn && !squares[index] && !winner) {
      let newSquares = squares;
      newSquares[index] = 'x';
      setSquares([...newSquares]);
    }
  }

  function restartGame() {
    setSquares(defaultSquares());
    setWinner(null);
  }

  const exitGame = async (event) => {
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
              window.location.href =  '/game1';
  
          }
          const result = await response.json();
          console.log("Success:", result);
          localStorage.removeItem('finalScore');
          window.location.href =  '/game1';
      }
      catch(error) {
          console.error("Error:", error);
      }
  }

  return (
    <div style={{zIndex:10, backgroundColor: 'black'}}>
    <main>
      <Board>
        {squares.map((square,index) =>
          <Square
            x={square==='x'?1:0}
            o={square==='o'?1:0}
            onClick={() => handleSquareClick(index)} />
        )}
      </Board>
      {!!winner && winner === 'x' && (
        <div className="result green" style={{fontSize: '1em', display:"flex", justifyContent:'center'}}>
          You WON! + 10 points
        </div>
      )}
      {!!winner && winner === 'o' && (
        <div className="result red" style={{fontSize: '1em', display:"flex", justifyContent:'center'}}>
          You LOST! - 2 points
        </div>
      )}
      {!!winner && winner === 'draw' && (
          <div className="result blue" style={{fontSize: '1em', display:"flex", justifyContent:'center'}}>
            It's a match! - no points
          </div>
        )}
        <div className="score">
          <p>Player: {score}</p>
        </div>
        <div className='tic-buttons'>
          <button id='rest' onClick={restartGame}>Restart Game</button>
          <button id='ex' onClick={exitGame} className='exit-button-game'>Exit</button>
        </div>
    </main>
    </div>
  );
}

export default Tictactoe;