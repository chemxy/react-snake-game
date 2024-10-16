import './App.css';
import {useEffect, useRef, useState} from "react";

const initSnake = {
    bodyLocation: [
        [0, 0],
        [1, 0],
        [2, 0],
        [3, 0]
    ],
    direction: "RIGHT",
    speed: 200,
    scale: 4, // consistent with app.css - .snake-body height & width
    getHead: function getHead() {
        return this.bodyLocation[this.bodyLocation.length - 1];
    },
    getBody: function () {
        return this.bodyLocation.slice(0, -1);
    },
}

function generateFood() {
    const MAX = 100 / initSnake.scale;

    const x = Math.floor(Math.random() * MAX); // The Math.random() returns a float that is b/t 0 and 1.
    const y = Math.floor(Math.random() * MAX);
    console.log(`food location: ${x}, ${y}`);
    return [x, y];
}

const initFoodLocation = [3, 4];

function App() {

    const [snake, setSnake] = useState(initSnake);
    const [gameover, setGameover] = useState(true);
    const [gamePause, setgamePause] = useState(false);
    const [food, setFood] = useState(initFoodLocation);
    const scoreRef = useRef(0);
    const isFirstGame = useRef(true);

    function move() {
        let newBodyLocation = [...snake.bodyLocation];
        let head = snake.getHead();
        switch (snake.direction) {
            case "UP":
                head = [head[0], head[1] - 1];
                break;
            case "DOWN":
                head = [head[0], head[1] + 1];
                break;
            case "LFET":
                head = [head[0] - 1, head[1]];
                break;
            case "RIGHT":
                head = [head[0] + 1, head[1]];
                break;
        }
        newBodyLocation.shift();//remove the last index which is the head
        newBodyLocation.push(head);//add the new head
        // console.log(newBodyLocation)
        setSnake({...snake, bodyLocation: newBodyLocation})
    }

    function handleKeyPress(event) {
        // console.log(event);
        // console.log(event.key);
        // console.log(event.code);
        // console.log(event.keyCode);
        switch (event.key) {
            case "ArrowDown":
                if (snake.direction !== "UP")
                    setSnake({...snake, direction: "DOWN"});
                break;
            case "ArrowUp":
                if (snake.direction !== "DOWN")
                    setSnake({...snake, direction: "UP"});
                break;
            case "ArrowLeft":
                if (snake.direction !== "RIGHT")
                    setSnake({...snake, direction: "LFET"});
                break;
            case "ArrowRight":
                if (snake.direction !== "LEFT")
                    setSnake({...snake, direction: "RIGHT"});
                break;
        }
    }

    function hasHitWall() {
        const head = snake.getHead();
        if (head[0] * snake.scale < 0 || head[0] * snake.scale > 99 || head[1] < 0 || head[1] * snake.scale > 99) {
            console.log("hit the wall. game over.");
            setGameover(true);
        }
    }

    function hasEatenFood() {
        const head = snake.getHead();
        if (head[0] === food[0] && head[1] === food[1]) {
            // console.log("ate food");
            scoreRef.current += 1;
            let newBodyLocation = [...snake.bodyLocation];
            newBodyLocation.unshift([]);
            setSnake({...snake, bodyLocation: newBodyLocation});
            setFood(generateFood());
        }
    }

    function checkBodyCollision() {
        const head = snake.getHead();
        const body = snake.getBody();
        // console.log(head);
        // console.log(body);
        const found = body.find((item) => item[0] === head[0] && item[1] === head[1]);
        if (found) {
            console.log("hit the body. game over.");
            setGameover(true);
        }
    }

    function startNewGame() {
        setSnake(initSnake);
        setFood(initFoodLocation);
        scoreRef.current = 0;
        isFirstGame.current = false;
        setGameover(false);
        setgamePause(false);
    }

    function pauseGame() {
        setgamePause(true);
    }

    function resumeGame() {
        setgamePause(false);
    }

    useEffect(() => {

        if (!gameover && !gamePause) {
            document.addEventListener("keydown", handleKeyPress, {once: true}); // prevent multiple key presses within the same interval using {once:true}
        }
        return () => {
            //clearing the keypress listener; otherwise it creates multiple listeners and they are stacked infinitely.
            document.removeEventListener("keydown", handleKeyPress);
        }
    }, [snake.bodyLocation, gameover, gamePause]);

    useEffect(() => {
        if (!gameover && !gamePause) {
            const interval = setInterval(() => {
                move();
            }, snake.speed);
            //clearing the interval; otherwise it creates intervals calling move() function and they are stacked infinitely.
            return () => {
                clearInterval(interval);
            };
        }
    }, [snake, gameover, gamePause]);

    useEffect(() => {
        if (!gameover && !gamePause) {
            hasHitWall();
            hasEatenFood();
            checkBodyCollision();
        }
    }, [snake, gameover, gamePause]);

    return (
        <div className="app-background">
            <div className="score">
                {scoreRef.current}
            </div>
            <div className="canvas">
                {snake.bodyLocation.map((item, index) => {
                    return <div className="snake-body" key={index} style={{
                        left: `${item[0] * snake.scale}%`,
                        top: `${item[1] * snake.scale}%`,
                    }}></div>
                })}
                <div className="food" style={{
                    left: `${food[0] * snake.scale}%`,
                    top: `${food[1] * snake.scale}%`
                }}></div>
            </div>
            <div className="game-over">
                {(!isFirstGame.current && gameover) && <div>Game Over!</div>}
                {gameover && <button className="start-button" onClick={startNewGame}>start new game</button>}
            </div>
            <div className="pause-game">
                {!gameover && !gamePause && <button className="pause-button" onClick={pauseGame}>pause game</button>}
                {!gameover && gamePause && <button className="pause-button" onClick={resumeGame}>resume game</button>}
            </div>
        </div>

    );
}

export default App;
