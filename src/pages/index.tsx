import Image from "next/image";
import { Inter } from "next/font/google";
import FlappyBirdCanvas from "../../components/FlappyBirdCanvas";
import { useEffect, useState } from "react";
import EthosConnect from "ethos-connect";
import { useRouter } from "next/router";
import CompetitiveFlappyBirdCanvas from "../../components/CompetitiveFlappyBirdCanvas";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [gameStarted, setGameStarted] = useState(false);
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const handleGameStart = async () => {
    // Logic to handle game start, e.g., deducting a token from the user

    //creates transaction
    //once transaction returns as confrimed
    console.log("Game started!");
    setFinalScore(null); // Reset the final score
  };

  const handleGameOver = (score: number) => {
    // Logic to handle game over, e.g., updating leaderboard
    //checks highscore
    //compares with on chain score

    console.log(`Game over! Score: ${score}`);
    console.log("gamestarted", gameStarted);
    setFinalScore(score);
    setGameStarted(false);
    console.log("game state should be false", gameStarted);

    return;

    // Here you can also call your backend functions like `endcompetitivegame` and `checkcompetitive`
  };

  const startCompetitiveGame = async () => {
    // Logic to start the game, e.g., verifying user has enough tokens

    setGameStarted(true);
  };

  useEffect(() => {
    if (gameStarted) {
      console.log("Game started!");
    } else {
      console.log("Game ended!");
    }
  }, [gameStarted]);

  const router = useRouter();

  return (
    <main
      className={`min-h-screen bg-blue-950 flex flex-col justify-center items-center  ${inter.className}`}
    >
      <div className="min-h-screen  flex flex-col justify-center text-white">
        <h1 className="text-lg">Welcome To </h1>
        <h1 className="text-4xl">Decentralize Arcade Machine</h1>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce">
          ↓
        </div>
      </div>
      <div className="mb-20"></div>

      <div className="grid grid-cols-2">
        <div className=" p-4 flex justify-center items-center ">
          <CompetitiveFlappyBirdCanvas
            onGameStart={handleGameStart}
            onGameOver={handleGameOver}
            startGame={gameStarted}
          ></CompetitiveFlappyBirdCanvas>
        </div>
        <div className="flex justify-center items-center p-4">
          {!gameStarted && (
            <button
              className="p-4  bg-blue-900 border-white  shadow-inner bg-opacity-20  hover:bg-opacity-80 hover:shadow-2xl transition-all duration-1000 ease-in w-full text-white   rounded-md"
              onClick={startCompetitiveGame}
            >
              Click to Free Play
            </button>
          )}

          {gameStarted && (
            <button className="p-4 animate-bounce bg-blue-900 border-white  shadow-inner bg-opacity-20  hover:bg-opacity-80 hover:shadow-2xl transition-all duration-1000 ease-in w-full text-white   rounded-md">
              Ready To Start
            </button>
          )}
          <button
            className="p-4  text-white bg-blue-900 border-white  shadow-inner bg-opacity-0  hover:bg-opacity-80 hover:shadow-2xl transition-all duration-1000 ease-in w-full   rounded-md"
            onClick={() => {
              router.push("/competitive");
            }}
          >
            Competitive Mode
          </button>
        </div>
      </div>
      <div className="mb-20"></div>
    </main>
  );
}
