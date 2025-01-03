# Year of the Snake Game

## Description

"Year of the Snake" is a modern, cyberpunk-themed take on the classic snake game. Built with React and Next.js, this game features responsive design, touch controls for mobile devices, and a sleek, neon-inspired visual style.

## Features

- Responsive design that works on both desktop and mobile devices
- Cyberpunk-inspired color scheme
- Increasing difficulty as the snake grows longer
- High score tracking using local storage
- Touch controls for mobile devices
- Keyboard controls for desktop
- Blurring effect on the snake's tail for added visual appeal
- Random obstacles appearing in the game area

## Game Logic

The game logic is implemented in the `useGameLogic` hook. Here's a breakdown of the main components:

1. **Snake Movement**: The snake moves continuously in the current direction. The game speed increases as the snake grows longer.

2. **Collision Detection**: The game checks for collisions with walls, the snake's own body, and obstacles. If a collision occurs, the game ends.

3. **Apple Generation**: Apples are generated at random positions, ensuring they don't overlap with the snake or obstacles.

4. **Obstacle Generation**: Obstacles are generated at the start of each game using predefined shapes. They remain in place for the duration of the game.

5. **Scoring**: The score increases as the snake eats apples. The high score is stored in local storage.

6. **Game Over**: When the game ends, an overlay is displayed with the "GAME OVER" message and a restart button.

## How to Play

1. Use arrow keys (on desktop) or touch the screen (on mobile) to control the snake's direction.
2. Guide the snake to eat the pink apples to grow longer.
3. Avoid hitting the walls, the snake's own body, or the obstacles.
4. The game ends when the snake collides with a wall, itself, or an obstacle.
5. Try to achieve the highest score possible!

## Installation

1. Clone this repository
2. Run `npm install` to install dependencies
3. Run `npm run dev` to start the development server
4. Open `http://localhost:3000` in your browser

## Customization

You can easily customize the appearance of obstacles in the game by modifying the `obstacleShapes` array in the `app/page.tsx` file.

## Technologies Used

- React
- TypeScript
- HTML5 Canvas

## Contributing

Contributions, issues, and feature requests are welcome. Feel free to check issues page if you want to contribute.

## License

This project is licensed under the MIT License.
