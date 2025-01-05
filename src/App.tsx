import Game from './components/game'
import { ObstacleShape } from './components/types'

export default function App() {
  // Define obstacle shapes
  const obstacleShapes: ObstacleShape[] = [
    // Square (3x3)
    [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 },
      { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 },
      { x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 },
    ],
    // L shape (5x5)
    [
      { x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }, { x: 0, y: 4 },
      { x: 1, y: 4 }, { x: 2, y: 4 }, { x: 3, y: 4 }, { x: 4, y: 4 },
    ],
    // T shape (5x5)
    [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 },
      { x: 2, y: 1 }, { x: 2, y: 2 }, { x: 2, y: 3 }, { x: 2, y: 4 },
    ],
    // Cross shape (5x5)
    [
      { x: 2, y: 0 },
      { x: 2, y: 1 },
      { x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 4, y: 2 },
      { x: 2, y: 3 },
      { x: 2, y: 4 },
    ],
    // Z shape (5x5)
    [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 },
      { x: 2, y: 1 }, { x: 2, y: 2 },
      { x: 2, y: 3 }, { x: 3, y: 3 }, { x: 4, y: 3 },
    ],
    // A shape (5x5)
    [
      { x: 2, y: 0 },
      { x: 1, y: 1 }, { x: 3, y: 1 },
      { x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 4, y: 2 },
      { x: 0, y: 3 }, { x: 4, y: 3 },
      { x: 0, y: 4 }, { x: 4, y: 4 },
    ],
    // M shape (5x5)
    [
      { x: 0, y: 0 }, { x: 4, y: 0 },
      { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }, { x: 4, y: 1 },
      { x: 0, y: 2 }, { x: 2, y: 2 }, { x: 4, y: 2 },
      { x: 0, y: 3 }, { x: 4, y: 3 },
      { x: 0, y: 4 }, { x: 4, y: 4 },
    ],
  ];

  return (
    <main className="bg-black flex min-h-dvh flex-col justify-between p-2">
      <Game obstacleShapes={obstacleShapes} />
    </main>
  )
}

