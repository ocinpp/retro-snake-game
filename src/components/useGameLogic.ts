import { useState, useEffect, useCallback } from 'react';
import { GameState, Direction, Position, ObstacleShape } from './types';
import { CELL_SIZE, GAME_WIDTH, GAME_HEIGHT, checkCollision, generateObstacle, getValidApplePosition, OBSTACLE_SIZE } from './utils';

function getHighScore(): number {
  if (typeof window !== 'undefined') {
    return parseInt(localStorage.getItem('snakeHighScore') || '0', 10);
  }
  return 0;
}

export function useGameLogic(obstacleShapes: ObstacleShape[]) {
  const [gameState, setGameState] = useState<GameState>({
    snake: [{ x: 0, y: 0 }],
    apple: { x: 0, y: 0 },
    direction: 'RIGHT',
    gameOver: false,
    highScore: getHighScore(),
    obstacles: [],
  });
  const [gameSpeed, setGameSpeed] = useState(100);
  const [isRunning, setIsRunning] = useState(false);

  const moveSnake = useCallback(() => {
    if (!isRunning || gameState.gameOver) return;

    const newSnake = [...gameState.snake];
    const head = { ...newSnake[0] };

    switch (gameState.direction) {
      case 'UP':
        head.y -= CELL_SIZE;
        break;
      case 'DOWN':
        head.y += CELL_SIZE;
        break;
      case 'LEFT':
        head.x -= CELL_SIZE;
        break;
      case 'RIGHT':
        head.x += CELL_SIZE;
        break;
    }

    const checkGameOver = () => {
      if (
        head.x < 0 || head.x >= GAME_WIDTH || head.y < 0 || head.y >= GAME_HEIGHT ||
        newSnake.some((segment) => checkCollision(segment, head)) ||
        gameState.obstacles.some((obstacle) => checkCollision(obstacle, head, OBSTACLE_SIZE))
      ) {
        const currentScore = newSnake.length - 1;
        const newHighScore = Math.max(gameState.highScore, currentScore);
        setGameState((prev) => ({ 
          ...prev, 
          gameOver: true,
          highScore: newHighScore
        }));
        if (newHighScore > gameState.highScore) {
          localStorage.setItem('snakeHighScore', newHighScore.toString());
        }
        return true;
      }
      return false;
    };

    if (checkGameOver()) return;

    newSnake.unshift(head);

    // Check if snake eats the apple
    if (checkCollision(head, gameState.apple)) {
      const newApple = getValidApplePosition(newSnake, gameState.obstacles);
      setGameState((prev) => ({
        ...prev,
        apple: newApple,
        snake: newSnake,
      }));
      
      // Increase speed every 10 points
      if (newSnake.length % 10 === 0) {
        setGameSpeed((prevSpeed) => Math.max(prevSpeed - 10, 50)); // Minimum speed of 50ms
      }
    } else {
      newSnake.pop();
      setGameState((prev) => ({ ...prev, snake: newSnake }));
    }
  }, [gameState, isRunning]);

  const generateObstacles = useCallback(() => {
    const randomShape = obstacleShapes[Math.floor(Math.random() * obstacleShapes.length)];
    return generateObstacle(randomShape);
  }, [obstacleShapes]);

  const initGame = useCallback(() => {
    const initialSnake = [{ x: 0, y: 0 }];
    const newObstacles = generateObstacles();
    const newApple = getValidApplePosition(initialSnake, newObstacles);
    setGameState(prev => ({
      ...prev,
      snake: initialSnake,
      apple: newApple,
      direction: 'RIGHT',
      gameOver: false,
      obstacles: newObstacles,
    }));
    setGameSpeed(100);
  }, [generateObstacles]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  useEffect(() => {
    const gameLoop = setInterval(moveSnake, gameSpeed);
    return () => clearInterval(gameLoop);
  }, [moveSnake, gameSpeed]);

  const changeDirection = useCallback((newDirection: Direction) => {
    setGameState((prev) => {
      // Prevent 180-degree turns
      if (
        (prev.direction === 'UP' && newDirection === 'DOWN') ||
        (prev.direction === 'DOWN' && newDirection === 'UP') ||
        (prev.direction === 'LEFT' && newDirection === 'RIGHT') ||
        (prev.direction === 'RIGHT' && newDirection === 'LEFT')
      ) {
        return prev;
      }
      return { ...prev, direction: newDirection };
    });
  }, []);

  const resetGame = useCallback(() => {
    initGame();
    setIsRunning(false);
  }, [initGame]);

  const startGame = useCallback(() => {
    setIsRunning(true);
  }, []);

  return { gameState, changeDirection, resetGame, gameSpeed, startGame, isRunning, setIsRunning };
}

