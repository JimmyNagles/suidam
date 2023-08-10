// components/FlappyBirdCanvas.tsx

import React, { useRef, useEffect } from "react";

//type definitions help to ensure type safety in our code
type Pipe = {
  x: number;
  y: number;
  height: number;
};

type PipePair = {
  upper: Pipe;
  lower: Pipe;
  scored?: boolean;
};

type GameState = "START" | "PLAYING" | "GAME_OVER";

const FlappyBirdCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Bird properties
  let bird = {
    x: 50, // This will position the bird towards the left side of the canvas
    y: 320,
    velocity: 0,
    gravity: 0.5,
    jump: -8,
  };

  // Pipes properties
  let pipes: PipePair[] = [];
  const pipeWidth = 50;
  const pipeGap = 150;

  // Score
  let score = 0;

  // Game state
  let gameState: GameState = "START";

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (context) {
      // Start the game loop
      requestAnimationFrame(gameLoop);
    }

    // Event listener for jump action (e.g., when space key is pressed)
    window.addEventListener("keydown", (e) => {
      if (e.code === "Space") {
        e.preventDefault(); // Prevent the default behavior of the space key

        if (gameState === "START" || gameState === "GAME_OVER") {
          // Reset game variables
          bird.y = 320;
          bird.velocity = 0;
          score = 0;
          pipes = [];

          // Change state to PLAYING
          gameState = "PLAYING";
        } else if (gameState === "PLAYING") {
          jump();
        }
      }
    });

    const pipeInterval = setInterval(() => {
      if (gameState === "PLAYING") {
        generatePipe();
      }
    }, 2000); // Generate pipes every 2 seconds

    return () => {
      clearInterval(pipeInterval);
    };
  }, []);

  function updateBird() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    // Collision with ground or ceiling
    if (bird.y > 640 || bird.y < 0) {
      gameState = "GAME_OVER";
    }
  }

  function jump() {
    bird.velocity = bird.jump;
  }

  function generatePipe() {
    let pipeHeight = Math.floor(Math.random() * (320 - 100)) + 50; // Random height between 50 and 320
    let upperPipe = {
      x: 480, // Canvas width
      y: 0,
      height: pipeHeight,
    };
    let lowerPipe = {
      x: 480,
      y: pipeHeight + pipeGap,
      height: 640 - pipeHeight - pipeGap, // Canvas height
    };
    pipes.push({ upper: upperPipe, lower: lowerPipe, scored: false });
  }

  function updatePipes() {
    for (let i = pipes.length - 1; i >= 0; i--) {
      pipes[i].upper.x -= 2; // Move pipes to the left by 2 pixels
      pipes[i].lower.x -= 2;

      // Check for collision with bird
      if (
        (bird.y < pipes[i].upper.height || bird.y > pipes[i].lower.y) &&
        bird.x + 20 > pipes[i].upper.x && // Using bird.x here
        bird.x < pipes[i].upper.x + pipeWidth
      ) {
        gameState = "GAME_OVER";
      }

      // Remove pipes that are out of the canvas
      if (pipes[i].upper.x + pipeWidth < 0) {
        pipes.splice(i, 1);
      }
    }
  }
  function updateScore() {
    pipes.forEach((pipePair) => {
      if (bird.x > pipePair.upper.x + pipeWidth && !pipePair.scored) {
        score++;
        pipePair.scored = true;
      }
    });
  }

  function gameLoop() {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!context) return;

    // Clear the canvas
    context.clearRect(0, 0, 480, 640);

    switch (gameState) {
      case "START":
        context.fillStyle = "white";
        context.font = "24px Arial";
        context.fillText("Tap SpaceBar to Play", 120, 320);
        break;

      case "PLAYING":
        updateBird();
        updatePipes();
        updateScore();

        context.fillStyle = "red";
        context.fillRect(50, bird.y, 20, 20);

        pipes.forEach((pipe) => {
          context.fillStyle = "green";
          context.fillRect(
            pipe.upper.x,
            pipe.upper.y,
            pipeWidth,
            pipe.upper.height
          );
          context.fillRect(
            pipe.lower.x,
            pipe.lower.y,
            pipeWidth,
            pipe.lower.height
          );
        });

        context.fillStyle = "white";
        context.font = "24px Arial";
        context.fillText(`Score: ${score}`, 10, 30);
        break;

      case "GAME_OVER":
        context.fillStyle = "white";
        context.font = "24px Arial";
        context.fillText(`Score: ${score}`, 210, 320);
        context.fillText("Press Spacebar to Play Again", 100, 240);
        context.fillText("Game Over", 190, 280);
        break;
    }

    requestAnimationFrame(gameLoop);
  }

  return <canvas className="border" ref={canvasRef} width={480} height={640} />;
};

export default FlappyBirdCanvas;
