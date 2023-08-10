import React, { useRef, useEffect } from "react";

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

type CompetitiveFlappyBirdCanvasProps = {
  onGameStart: () => void;
  onGameOver: (score: number) => void;
  startGame: boolean;
};

const CompetitiveFlappyBirdCanvas: React.FC<
  CompetitiveFlappyBirdCanvasProps
> = ({ onGameStart, onGameOver, startGame }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Bird properties
  let bird = {
    x: 50,
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
      requestAnimationFrame(gameLoop);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!startGame) return; // If startGame is false, do nothing

      if (e.code === "Space") {
        e.preventDefault();

        console.log("game starterrrr", startGame);

        if (gameState === "START" || gameState === "GAME_OVER") {
          bird.y = 320;
          bird.velocity = 0;
          score = 0;
          pipes = [];
          gameState = "START"; // Reset the game state

          if (startGame) {
            gameState = "PLAYING";
            onGameStart();
          }
        } else if (gameState === "PLAYING") {
          jump();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    const pipeInterval = setInterval(() => {
      if (gameState === "PLAYING") {
        generatePipe();
      }
    }, 2000);

    console.log(startGame);

    return () => {
      window.removeEventListener("keydown", handleKeyDown); // Remove the event listener when the component is unmounted
      clearInterval(pipeInterval);
    };
  }, [startGame]);

  function updateBird() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y > 640 || bird.y < 0) {
      gameState = "GAME_OVER";
      console.log("crash with wall this is the score", score);
      onGameOver(score);
    }
  }

  function jump() {
    bird.velocity = bird.jump;
  }

  function generatePipe() {
    let pipeHeight = Math.floor(Math.random() * (320 - 100)) + 50;
    let upperPipe = {
      x: 480,
      y: 0,
      height: pipeHeight,
    };
    let lowerPipe = {
      x: 480,
      y: pipeHeight + pipeGap,
      height: 640 - pipeHeight - pipeGap,
    };
    pipes.push({ upper: upperPipe, lower: lowerPipe, scored: false });
  }

  function updatePipes() {
    for (let i = pipes.length - 1; i >= 0; i--) {
      pipes[i].upper.x -= 2;
      pipes[i].lower.x -= 2;

      if (
        (bird.y < pipes[i].upper.height || bird.y > pipes[i].lower.y) &&
        bird.x + 20 > pipes[i].upper.x &&
        bird.x < pipes[i].upper.x + pipeWidth
      ) {
        console.log("crashed with walls", score);
        onGameOver(score);
        gameState = "GAME_OVER";
      }

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
        if (gameState !== "GAME_OVER") {
          console.log("GAME OVER");
          onGameOver(score);
          context.fillText(`Score: ${score}`, 210, 320);
        }
        gameState = "GAME_OVER";
        context.fillStyle = "white";
        context.font = "24px Arial";
        context.fillText(`Score: ${score}`, 210, 320);
        context.fillText("Press Spacebar to Play Again test", 100, 240);
        context.fillText("Game Over", 190, 280);
        break;
    }

    requestAnimationFrame(gameLoop);
  }

  return <canvas className="border" ref={canvasRef} width={480} height={640} />;
};

export default CompetitiveFlappyBirdCanvas;
