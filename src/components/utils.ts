import { Position, ObstacleShape } from './types';

export const CELL_SIZE = 10;
export const GAME_WIDTH = 400;
export const GAME_HEIGHT = 300;
export const OBSTACLE_SIZE = 9; // Changed to 9x9 grid

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
  const maxX = Math.floor(GAME_WIDTH / CELL_SIZE) - OBSTACLE_SIZE;
  const maxY = Math.floor(GAME_HEIGHT / CELL_SIZE) - OBSTACLE_SIZE;
  const baseX = Math.floor(Math.random() * maxX) * CELL_SIZE;
  const baseY = Math.floor(Math.random() * maxY) * CELL_SIZE;

  return shape.map(pos => ({
    x: baseX + pos.x * CELL_SIZE,
    y: baseY + pos.y * CELL_SIZE,
  }));
}

export function generateCharacterShape(char: string, thickness: number = 1): ObstacleShape {
  const grid: boolean[][] = Array(OBSTACLE_SIZE).fill(null).map(() => Array(OBSTACLE_SIZE).fill(false));
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas context not supported');
  }

  canvas.width = OBSTACLE_SIZE;
  canvas.height = OBSTACLE_SIZE;
  ctx.font = `${OBSTACLE_SIZE * 0.8}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(char, OBSTACLE_SIZE / 2, OBSTACLE_SIZE / 2);

  const imageData = ctx.getImageData(0, 0, OBSTACLE_SIZE, OBSTACLE_SIZE);
  for (let y = 0; y < OBSTACLE_SIZE; y++) {
    for (let x = 0; x < OBSTACLE_SIZE; x++) {
      const index = (y * OBSTACLE_SIZE + x) * 4;
      if (imageData.data[index + 3] > 0) {
        grid[y][x] = true;
      }
    }
  }

  const shape: ObstacleShape = [];
  for (let y = 0; y < OBSTACLE_SIZE; y++) {
    for (let x = 0; x < OBSTACLE_SIZE; x++) {
      if (grid[y][x]) {
        for (let dy = -thickness + 1; dy < thickness; dy++) {
          for (let dx = -thickness + 1; dx < thickness; dx++) {
            const newX = x + dx;
            const newY = y + dy;
            if (newX >= 0 && newX < OBSTACLE_SIZE && newY >= 0 && newY < OBSTACLE_SIZE) {
              shape.push({ x: newX, y: newY });
            }
          }
        }
      }
    }
  }

  return shape;
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

