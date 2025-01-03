export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface Position {
  x: number;
  y: number;
}

export interface GameState {
  snake: Position[];
  apple: Position;
  direction: Direction;
  gameOver: boolean;
  highScore: number;
  obstacles: Position[];
}

export type ObstacleShape = Position[];

