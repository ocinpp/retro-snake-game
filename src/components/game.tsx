'use client'

import React, { useRef, useEffect, useState } from 'react';
import { useGameLogic } from './useGameLogic';
import { CELL_SIZE, GAME_WIDTH, GAME_HEIGHT } from './utils';
import { Direction, ObstacleShape } from './types';

interface GameProps {
  obstacleShapes: ObstacleShape[];
}

const CYBERPUNK_GREEN = '#00ff00';
const CYBERPUNK_PINK = '#ff00ff';
const CYBERPUNK_BLUE = '#00ffff';

export default function Game({ obstacleShapes }: GameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { gameState, changeDirection, resetGame, gameSpeed, startGame: startGameLogic, isRunning, setIsRunning } = useGameLogic(obstacleShapes);
  const [scale, setScale] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [lastKeyPressed, setLastKeyPressed] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => {
      const maxWidth = window.innerWidth * 0.9;
      const maxHeight = window.innerHeight * 0.7; // Reduced to make room for touch controls
      const widthScale = maxWidth / GAME_WIDTH;
      const heightScale = maxHeight / GAME_HEIGHT;
      setScale(Math.min(widthScale, heightScale, 1));
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Draw snake with blurring effect
    ctx.fillStyle = CYBERPUNK_GREEN;
    gameState.snake.forEach((segment, index) => {
      const alpha = 1 - (index / gameState.snake.length) * 0.8;
      ctx.globalAlpha = alpha;
      ctx.fillRect(segment.x, segment.y, CELL_SIZE, CELL_SIZE);
    });
    ctx.globalAlpha = 1;

    // Draw apple
    ctx.fillStyle = CYBERPUNK_PINK;
    ctx.fillRect(gameState.apple.x, gameState.apple.y, CELL_SIZE, CELL_SIZE);

    // Draw obstacles
    ctx.fillStyle = CYBERPUNK_BLUE;
    gameState.obstacles.forEach(cell => {
        ctx.fillRect(cell.x, cell.y, CELL_SIZE, CELL_SIZE);
    });

    // Draw game over overlay
    if (gameState.gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
      ctx.fillStyle = CYBERPUNK_BLUE;
      ctx.font = '20px "Courier New", Courier, monospace';
      ctx.fillText('GAME OVER', GAME_WIDTH / 2 - 60, GAME_HEIGHT / 2);
    }

    // Show "Press Start" message when the game hasn't started
    if (!gameStarted && !gameState.gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
      ctx.fillStyle = CYBERPUNK_BLUE;
      ctx.font = '20px "Courier New", Courier, monospace';
      ctx.fillText('PRESS START', GAME_WIDTH / 2 - 70, GAME_HEIGHT / 2);
    }
  }, [gameState, gameStarted]);


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore repeated key presses
      if (e.repeat) {
        e.preventDefault();
        return;
      }

      let newDirection: Direction | null = null;
      switch (e.key) {
        case 'ArrowUp':
          newDirection = 'UP';
          break;
        case 'ArrowDown':
          newDirection = 'DOWN';
          break;
        case 'ArrowLeft':
          newDirection = 'LEFT';
          break;
        case 'ArrowRight':
          newDirection = 'RIGHT';
          break;
      }

      if (newDirection && e.key !== lastKeyPressed) {
        e.preventDefault();
        changeDirection(newDirection);
        setLastKeyPressed(e.key);
      } else {
        e.preventDefault();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === lastKeyPressed) {
        setLastKeyPressed(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [changeDirection, lastKeyPressed]);

  const handleTouchStart = (direction: Direction) => (e: React.TouchEvent) => {
    e.preventDefault();
    changeDirection(direction);
  };

  // Prevent default touch behavior to stop accidental refreshes
  useEffect(() => {
    const preventDefault = (e: TouchEvent) => e.preventDefault();
    document.addEventListener('touchmove', preventDefault, { passive: false });
    return () => document.removeEventListener('touchmove', preventDefault);
  }, []);

  const startGame = () => {
    setGameStarted(true);
    setIsRunning(true);
    startGameLogic();
  };

  useEffect(() => {
    let gameLoop: NodeJS.Timeout;
    if (isRunning && !gameState.gameOver) {
      gameLoop = setInterval(() => {
        startGameLogic();
      }, gameSpeed);
    }
    return () => {
      if (gameLoop) clearInterval(gameLoop);
    };
  }, [isRunning, gameState.gameOver, startGameLogic, gameSpeed]);

  return (
    <div className="flex flex-col items-center bg-black text-white font-geist-mono-regular">
      <h1 className="text-2xl font-bold mb-2 text-cyan-400">Year of the Snake</h1>
      <div className="w-full max-w-lg mb-2 flex justify-between items-center">
        <p className="text-lg font-bold text-green-400">Score: {gameState.snake.length - 1}</p>
        <p className="text-lg font-bold text-pink-400">High Score: {gameState.highScore}</p>
      </div>
      <div
        style={{
          width: `${GAME_WIDTH * scale}px`,
          height: `${GAME_HEIGHT * scale}px`,
        }}
        className="relative border-4 border-cyan-400"
      >
        <canvas
          ref={canvasRef}
          width={GAME_WIDTH}
          height={GAME_HEIGHT}
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      </div>
      {isMobile && (
        <div className="mt-2 w-full flex justify-center">
          <div className="w-full max-w-[60%]">
            <div className="grid grid-cols-3 gap-1">
              <div></div>
              <button
                className="bg-cyan-600 text-white p-4 rounded-lg aspect-square flex items-center justify-center"
                onTouchStart={handleTouchStart('UP')}
              >
                ▲
              </button>
              <div></div>
              <button
                className="bg-cyan-600 text-white p-4 rounded-lg aspect-square flex items-center justify-center"
                onTouchStart={handleTouchStart('LEFT')}
              >
                ◀
              </button>
              <div></div>
              <button
                className="bg-cyan-600 text-white p-4 rounded-lg aspect-square flex items-center justify-center"
                onTouchStart={handleTouchStart('RIGHT')}
              >
                ▶
              </button>
              <div></div>
              <button
                className="bg-cyan-600 text-white p-4 rounded-lg aspect-square flex items-center justify-center"
                onTouchStart={handleTouchStart('DOWN')}
              >
                ▼
              </button>
              <div></div>
            </div>
          </div>
        </div>
      )}
      <div className="mt-2 text-center text-sm text-gray-400 h-16 flex flex-col justify-between">
        <p>{isMobile ? 'Use touch controls to move the snake' : 'Use arrow keys to control the snake'}</p>
        {!gameStarted && !gameState.gameOver && (
          <button
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded"
            onClick={startGame}
          >
            Start
          </button>
        )}
        {gameState.gameOver && (
          <button
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => {
              resetGame();
              setGameStarted(true);
              setIsRunning(true);
            }}
          >
            Restart
          </button>
        )}
      </div>
      <p className="mt-2 text-xs text-gray-600">Speed: {Math.floor(1000 / gameSpeed)} units/second</p>
    </div>
  );
}

