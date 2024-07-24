import './images/jumpy.css';
import { useEffect, useState } from "react";


const BIRD_HEIGHT = 28;
const BIRD_WIDTH = 33;
const WALL_HEIGHT = 600;
const WALL_WIDTH = 400;
const GRAVITY = 4;
const OBJ_WIDTH = 52;
const OBJ_SPEED = 6;
const OBJ_GAP = 200;



function App() {
    const [isStart, setIsStart] = useState(false);
    const [birdpos, setBirdpos] = useState(300);
    const [objHeight, setObjHeight] = useState(0);
    const [objPos, setObjPos] = useState(WALL_WIDTH);
    const [score, setScore] = useState(0);
    const [isGameOver, setIsGameOver] = useState(false);
    const [finalScore, setFinalScore] = useState(0);

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
                window.location.href = '/game4';

            }
            const result = await response.json();
            console.log("Success:", result);
            localStorage.removeItem('finalScore');
            window.location.href = '/game4';
        }
        catch(error) {
            console.error("Error:", error);
        }
        
  }

    

    useEffect(() => {
        const storedFinalScore = localStorage.getItem('finalScore');
        if (storedFinalScore) {
          setFinalScore(parseInt(storedFinalScore));
        }
      }, []);

    useEffect(() => {
        let intVal;
        if (isStart && birdpos < WALL_HEIGHT - BIRD_HEIGHT) {
        intVal = setInterval(() => {
            setBirdpos((birdpos) => birdpos + GRAVITY);
        }, 24);
        }
        return () => clearInterval(intVal);
    });

    useEffect(() => {
        let objval;
        if (isStart && objPos >= -OBJ_WIDTH) {
            objval = setInterval(() => {
                setObjPos((objPos) => objPos - OBJ_SPEED);
            }, 24);
        return () => {
        clearInterval(objval);
    };

        } else {
        setObjPos(WALL_WIDTH);
        setObjHeight(Math.floor(Math.random() * (WALL_HEIGHT - OBJ_GAP)));

        if (isStart && !isGameOver) 
            setScore((score) => score + 1);
    }

    }, [isStart, objPos, isGameOver]);

    useEffect(() => {
        let topObj = birdpos >= 0 && birdpos < objHeight;
        let bottomObj =
        birdpos <= WALL_HEIGHT &&
        birdpos >=
            WALL_HEIGHT - (WALL_HEIGHT - OBJ_GAP - objHeight) - BIRD_HEIGHT;

    if (
      objPos >= OBJ_WIDTH &&
      objPos <= OBJ_WIDTH + 80 &&
      (topObj || bottomObj)
    ) {
      setIsStart(false);
      setIsGameOver(true);
      setFinalScore(prev => prev + score); 
      localStorage.setItem('finalScore', finalScore);
    }
    }, [isStart, birdpos, objHeight, objPos, score, finalScore]);

    const handler = () => {
        if (!isStart){ 
            setIsStart(true);
            setIsGameOver(false)
            setScore(0);
            setBirdpos(300);
        }else if (birdpos < BIRD_HEIGHT) setBirdpos(0);
        else setBirdpos((birdpos) => birdpos - 50);
    };

    
    return (
        <div className="home" onClick={handler}>
            <div style={{display:'flex', flexDirection:'column'}}>
                <span>Score: {score}</span>
                <span>Final score: {finalScore}</span>
                <div id='flappy-exit-button' style={{zIndex:'10'}}> 
                    <button onClick={exitFunction} className="exit-button-game">
                        Exit
                    </button>
                </div>
            </div>
                <div
                    className="background"
                    style={{
                    '--background-width': `${WALL_WIDTH}px`,
                    '--background-height': `${WALL_HEIGHT}px`
                    }}
                >
                    {!isStart ? <div className="startboard">Start game</div>: null}
                    <div
                        className="obj"
                        style={{
                            '--obj-width': `${OBJ_WIDTH}px`,
                            '--obj-height': `${objHeight}px`,
                            '--obj-left': `${objPos}px`,
                            '--obj-top': `0px`,
                            '--obj-deg': '180deg'
                        }}
                    />
                    <div
                        className="bird"
                        style={{
                            '--bird-width': `${BIRD_WIDTH}px`,
                            '--bird-height': `${BIRD_HEIGHT}px`,
                            '--bird-top': `${birdpos}px`,
                            '--bird-left': '100px'
                        }}
                    />
                    <div
                        className="obj"
                        style={{
                            '--obj-width': `${OBJ_WIDTH}px`,
                            '--obj-height': `${WALL_HEIGHT - OBJ_GAP - objHeight}px`,
                            '--obj-left': `${objPos}px`,
                            '--obj-top': `${
                            WALL_HEIGHT - (objHeight + (WALL_HEIGHT - OBJ_GAP - objHeight))
                            }px`,
                            '--obj-deg': '0deg'
                        }}
                    />
                    
                </div>
                
        </div>


  );
}

export default App;

