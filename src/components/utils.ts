import { Position, ObstacleShape } from './types';

export const CELL_SIZE = 10;
export const GAME_WIDTH = 400;
export const GAME_HEIGHT = 300;
export const OBSTACLE_SIZE = 5; // Changed from 1 to 5

export function getRandomPosition(): Position {
  return {
    x: Math.floor(Math.random() * (GAME_WIDTH / CELL_SIZE)) * CELL_SIZE,
    y: Math.floor(Math.random() * (GAME_HEIGHT / CELL_SIZE)) * CELL_SIZE,
  };
}

export function checkCollision(pos1: Position, pos2: Position, size: number = 1): boolean {
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (
        pos1.x < pos2.x + CELL_SIZE * size &&
        pos1.x + CELL_SIZE > pos2.x &&
        pos1.y < pos2.y + CELL_SIZE * size &&
        pos1.y + CELL_SIZE > pos2.y
      ) {
        return true;
      }
    }
  }
  return false;
}

export function generateObstacle(shape: ObstacleShape): Position[] {
  const maxX = Math.floor(GAME_WIDTH / CELL_SIZE) - 5;
  const maxY = Math.floor(GAME_HEIGHT / CELL_SIZE) - 5;
  const baseX = Math.floor(Math.random() * maxX) * CELL_SIZE;
  const baseY = Math.floor(Math.random() * maxY) * CELL_SIZE;

  return shape.map(pos => ({
    x: baseX + pos.x * CELL_SIZE,
    y: baseY + pos.y * CELL_SIZE,
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

