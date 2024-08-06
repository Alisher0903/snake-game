import React, { useEffect, useRef, useState } from 'react';
import './App.css';

const App = () => {
  const canvasRef = useRef(null);
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [apple, setApple] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [speed, setSpeed] = useState(200);
  const [count, setCount] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (count <= 10) setCount(prev => count + 1);
    else if (count > 10 && count <= 15) setCount(prev => count + 2);
    else if (count > 15 && count <= 25) setCount(prev => count + 3);
    else if (count > 25 && count <= 35) setCount(prev => count + 4);
    else if (count > 35) setCount(prev => count + 5);
  }, [apple])

  useEffect(() => {
    if (count <= 10) setSpeed(150)
    else if (count > 10 && count <= 15) setSpeed(100)
    else if (count > 15 && count <= 25) setSpeed(80)
    else if (count > 25 && count <= 35) setSpeed(60)
    else if (count > 35) setSpeed(50)
  }, [count])

  useEffect(() => {
    const context = canvasRef.current.getContext('2d');
    context.setTransform(20, 0, 0, 20, 0, 0);
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);

    context.fillStyle = 'green';
    snake.forEach(({ x, y }) => context.fillRect(x, y, 1, 1));

    context.fillStyle = 'red';
    context.fillRect(apple.x, apple.y, 1, 1);
  }, [snake, apple, gameOver]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [direction]);

  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const newSnake = [...prevSnake];
        const head = { x: newSnake[0].x + direction.x, y: newSnake[0].y + direction.y };

        if (
          head.x < 0 ||
          head.x >= 30 ||
          head.y < 0 ||
          head.y >= 30 ||
          newSnake.some((segment) => segment.x === head.x && segment.y === head.y)
        ) {
          setGameOver(true);
          return prevSnake;
        }

        newSnake.unshift(head);

        if (head.x === apple.x && head.y === apple.y) {
          setApple({
            x: Math.floor(Math.random() * 30),
            y: Math.floor(Math.random() * 30),
          });
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [direction, apple, gameOver, speed]);

  return (
    <div className="App">
      <canvas
        ref={canvasRef}
        style={{ border: '1px solid black' }}
        width="600"
        height="600"
      ></canvas>
      <p className='game-point'>Point: {count}</p>
      {gameOver && <div className='game-main'>
        <p className="game-over">Game Over</p>
        <button className="game-start" onClick={() => {
          setSnake([{ x: 10, y: 10 }]);
          setApple({ x: 15, y: 15 });
          setDirection({ x: 1, y: 0 });
          setSpeed(200);
          setGameOver(false);
          setCount(0)
        }}>Game Start</button>
      </div>}
    </div>
  );
};

export default App;
