import { Position, ObstacleShape } from './types';

export const CELL_SIZE = 10;
export const GAME_WIDTH = 400;
export const GAME_HEIGHT = 300;
export const OBSTACLE_SIZE = 1; // Changed from 3 to 1

export function getRandomPosition(): Position {
  return {
    x: Math.floor(Math.random() * (GAME_WIDTH / CELL_SIZE)) * CELL_SIZE,
    y: Math.floor(Math.random() * (GAME_HEIGHT / CELL_SIZE)) * CELL_SIZE,
  };
}

export function checkCollision(pos1: Position, pos2: Position, size: number = 1): boolean {
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (pos1.x + i * CELL_SIZE === pos2.x && pos1.y + j * CELL_SIZE === pos2.y) {
        return true;
      }
    }
  }
  return false;
}

export function generateObstacle(shape: ObstacleShape): Position[] {
  const basePosition = getRandomPosition();
  return shape.map(pos => ({
    x: (basePosition.x + pos.x * CELL_SIZE * OBSTACLE_SIZE) % GAME_WIDTH,
    y: (basePosition.y + pos.y * CELL_SIZE * OBSTACLE_SIZE) % GAME_HEIGHT,
  }));
}

export function isPositionValid(pos: Position, snake: Position[], obstacles: Position[]): boolean {
  // Check if position is within game bounds
  if (pos.x < 0 || pos.x >= GAME_WIDTH || pos.y < 0 || pos.y >= GAME_HEIGHT) {
    return false;
  }

  // Check if position collides with snake
  if (snake.some(segment => checkCollision(segment, pos))) {
    return false;
  }

  // Check if position collides with obstacles
  if (obstacles.some(obstacle => checkCollision(obstacle, pos, OBSTACLE_SIZE))) {
    return false;
  }

  return true;
}

export function getValidApplePosition(snake: Position[], obstacles: Position[]): Position {
  let position: Position;
  do {
    position = getRandomPosition();
  } while (!isPositionValid(position, snake, obstacles));
  return position;
}

