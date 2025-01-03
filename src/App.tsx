import Game from './components/game'
import { ObstacleShape } from './components/types'

export default function App() {
  // Define obstacle shapes
  const obstacleShapes: ObstacleShape[] = [
    // Square (3 sides)
    [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 2 },
      { x: 2, y: 1 },
      { x: 2, y: 2 },
    ],
    // L shape
    [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 2 },
      { x: 1, y: 2 },
      { x: 2, y: 2 },
    ],
    // T shape
    [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 1, y: 1 },
      { x: 1, y: 2 },
    ],
  ];

  return (
    <main className="bg-black flex min-h-dvh flex-col justify-between p-3">
      <Game obstacleShapes={obstacleShapes} />
    </main>
  )
}

