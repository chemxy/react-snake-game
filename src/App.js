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

const initFoodLocation = generateFood();

function App() {

    const [snake, setSnake] = useState(initSnake);
    const [gameover, setGameover] = useState(false);
    const [food, setFood] = useState(initFoodLocation);
    const scoreRef = useRef(0);
    const direction = useRef('RIGHT'); //switch to useRef to prevent snake movement pausing when pressing keys

    function move() {
        let newBodyLocation = [...snake.bodyLocation];
        // let head = newBodyLocation[newBodyLocation.length - 1];
        let head = snake.getHead();
        // switch (snake.direction) {
        //     case "UP":
        //         head = [head[0], head[1] - 1];
        //         break;
        //     case "DOWN":
        //         head = [head[0], head[1] + 1];
        //         break;
        //     case "LFET":
        //         head = [head[0] - 1, head[1]];
        //         break;
        //     case "RIGHT":
        //         head = [head[0] + 1, head[1]];
        //         break;
        // }
        switch (direction.current) {
            case "UP":
                head = [head[0], head[1] - 1];
                break;
            case "DOWN":
                head = [head[0], head[1] + 1];
                break;
            case "LEFT":
                head = [head[0] - 1, head[1]];
                break;
            case "RIGHT":
                head = [head[0] + 1, head[1]];
                break;
        }
        newBodyLocation.shift();//remove the last index which is the head
        newBodyLocation.push(head);//add the new head
        console.log(newBodyLocation)
        setSnake({...snake, bodyLocation: newBodyLocation})
    }

    function onKeyPress(event) {
        // console.log(event);
        console.log(event.key);
        // console.log(event.code);
        // console.log(event.keyCode);
        // switch (event.key) {
        //     case "ArrowDown":
        //         if (snake.direction !== "UP")
        //             setSnake({...snake, direction: "DOWN"});
        //         break;
        //     case "ArrowUp":
        //         if (snake.direction !== "DOWN")
        //             setSnake({...snake, direction: "UP"});
        //         break;
        //     case "ArrowLeft":
        //         if (snake.direction !== "RIGHT")
        //             setSnake({...snake, direction: "LFET"});
        //         break;
        //     case "ArrowRight":
        //         if (snake.direction !== "LEFT")
        //             setSnake({...snake, direction: "RIGHT"});
        //         break;
        // }

        switch (event.key) {
            case "ArrowDown":
                if (direction.current !== "UP")
                    direction.current = 'DOWN';
                break;
            case "ArrowUp":
                if (direction.current !== "DOWN")
                    direction.current = 'UP';
                break;
            case "ArrowLeft":
                if (direction.current !== "RIGHT")
                    direction.current = 'LEFT';
                break;
            case "ArrowRight":
                if (direction.current !== "LEFT")
                    direction.current = 'RIGHT';
                break;
        }
    }

    function hasHitWall() {
        const head = snake.getHead();
        if (head[0] * snake.scale < 0 || head[0] * snake.scale > 99 || head[1] < 0 || head[1] * snake.scale > 99) {
            console.log("game over");
            setGameover(true);
        }
    }

    function hasEatenFood() {
        const head = snake.getHead();
        if (head[0] === food[0] && head[1] === food[1]) {
            console.log("ate food");
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
            console.log("hit the body");
            setGameover(true);
        }
    }

    useEffect(() => {

        if (!gameover) {
            document.addEventListener("keydown", onKeyPress, {once: true}); // prevent multiple key presses within the same interval
            // window.onkeydown = onKeyPress;
        }
        return () => {
            document.removeEventListener("keydown", onKeyPress);
        }
    }, [snake, gameover]);

    //or
    // useEffect(() => {
    // if (!gameover)
    //     window.onkeydown = onKeyPress;
    //
    // }, [snake, gameover]);

    useEffect(() => {
        if (!gameover) {
            const interval = setInterval(() => {
                move();
            }, snake.speed);
            //Clearing the interval
            return () => clearInterval(interval);
        }
    }, [snake, gameover]);

    useEffect(() => {
        if (!gameover) {
            hasHitWall();
        }
    }, [snake, gameover]);

    useEffect(() => {
        if (!gameover) {
            hasEatenFood();
        }
    }, [snake, gameover]);

    useEffect(() => {
        if (!gameover) {
            checkBodyCollision();
        }
    }, [snake, gameover]);

    return (
        <div className="app-background">
            <div className="score">
                {scoreRef.current}
            </div>
            <div className="canvas">
                {/*<div className="snake-body" style={{top: 0, left: 0}}></div>*/}
                {/*<div className="snake-body" style={{top: 0, left: '1%'}}></div>*/}
                {/*<div className="snake-body" style={{top: 0, left: '2%'}}></div>*/}
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
                {gameover && <div>Game Over!</div>}
            </div>
        </div>

    );
}

export default App;
