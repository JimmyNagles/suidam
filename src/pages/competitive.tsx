import Image from "next/image";
import React, { useState, useEffect, useCallback } from "react";

import { useRouter } from "next/router";
import {
  ethos,
  SignInButton,
  EthosConnectStatus,
  TransactionBlock,
} from "ethos-connect";
import FlappyBirdCanvas from "../../components/FlappyBirdCanvas";
import CompetitiveFlappyBirdCanvas from "../../components/CompetitiveFlappyBirdCanvas";

const Competitive = () => {
  const router = useRouter();
  const { status, wallet } = ethos.useWallet();

  const contractAddress =
    "0xddba96419d5272af78072c88a4dbc451d0ae8a21eb84a69fb5098cda35b5f7c7";

  const [nftObjectId, setNftObjectId] = useState(null);

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
    mint().then();
    setGameStarted(true);
  };

  useEffect(() => {
    if (gameStarted) {
      console.log("Game started!");
    } else {
      console.log("Game ended!");
    }
  }, [gameStarted]);

  const mint = useCallback(async () => {
    if (!wallet) return;

    try {
      const transactionBlock = new TransactionBlock();

      console.log("nftName", "");
      console.log("nftName", "");
      console.log("nftName", "state.nftImgUrl");

      const nft = transactionBlock.moveCall({
        target: `${contractAddress}::nft_example::mint_to_sender`,
        arguments: [
          transactionBlock.pure(""),
          transactionBlock.pure(""),
          transactionBlock.pure("state.nftImgUrl"),
        ],
      });

      const response = await wallet.signAndExecuteTransactionBlock({
        transactionBlock,
        options: {
          showInput: true,
          showEffects: true,
          showEvents: true,
          showBalanceChanges: true,
          showObjectChanges: true,
        },
      });
      console.log("Transaction Response", response);
      setNftObjectId(response.object);
    } catch (error) {
      console.log(error);
    }
  }, [wallet]);

  const reset = useCallback(() => {
    setNftObjectId(" dsa");
  }, []);

  const renderButton = () => {
    // If wallet is not connected, return a button which allows them to connect their wallet
    if (!wallet) {
      return (
        <div className="text-white flex flex-col justify-center items-center">
          <div className="h-[150px]">
            <h1 className="text-2xl">Connect Wallet</h1>
            <h1 className="text-6xl text-white ">For Competitive Mode </h1>
          </div>

          <div className="text-white flex flex-col justify-center items-center">
            <h1 className=" mb-4">No wallet connected</h1>
            <SignInButton className="p-2 mb-2 bg-blue-900 border-white  shadow-inner bg-opacity-0  hover:bg-opacity-80 hover:shadow-2xl transition-all duration-1000 ease-in w-[200px] text-white  rounded-md" />
          </div>

          <div className="absolute bottom-4 animate-bounce">
            <button
              className="p-4  text-white bg-blue-900 border-white  shadow-inner bg-opacity-0  hover:bg-opacity-80 hover:shadow-2xl transition-all duration-1000 ease-in w-full   rounded-md"
              onClick={() => {
                router.push("/");
              }}
            >
              ←
            </button>
          </div>
        </div>
      );
    }

    console.log(wallet);

    // If we are currently waiting for something, return a loading button
    if (status === EthosConnectStatus.Loading) {
      return <div>Loading...</div>;
    }

    return (
      <div>
        <div className="min-h-screen p-4 grid grid-cols-2">
          <div className=" p-4 flex flex-col justify-center ">
            <button
              className="p-2 mb-6 bg-blue-900 shadow-inner bg-opacity-0  hover:bg-opacity-80 hover:shadow-2xl transition-all duration-1000 ease-in w-[200px] text-white border rounded-md"
              onClick={wallet && wallet.disconnect}
            >
              Sign Out
            </button>
            <div className=" p-4 border border-white flex flex-row-reverse">
              {!gameStarted && (
                <button
                  className="p-4 mb-2 bg-blue-900 border-white  shadow-inner bg-opacity-20  hover:bg-opacity-80 hover:shadow-2xl transition-all duration-1000 ease-in w-[200px] text-white   rounded-md"
                  onClick={startCompetitiveGame}
                >
                  Insert Token
                </button>
              )}

              {gameStarted && (
                <button className="p-4 mb-2 bg-blue-900 border-white  shadow-inner bg-opacity-20  hover:bg-opacity-80 hover:shadow-2xl transition-all duration-1000 ease-in w-[200px] text-white   rounded-md">
                  Ready To Start
                </button>
              )}
              {finalScore !== null && (
                <div className="text-white w-full flex justify-center items-center">
                  <h1 className=" w-3/4">Your final score: {finalScore}</h1>
                  {/* Optionally, you can also show the "Play Again" button here */}
                </div>
              )}
            </div>

            <div className="text-white mt-2">Wallet Name {wallet?.name}</div>
            <div className="text-white mt-2">My address: {wallet?.address}</div>
            <h1 className=" text-white text-3xl ">
              My balance:
              {wallet?.contents && wallet.contents.suiBalance.toString()}
            </h1>
          </div>
          <div className=" p-4 flex justify-center ">
            <CompetitiveFlappyBirdCanvas
              onGameStart={handleGameStart}
              onGameOver={handleGameOver}
              startGame={gameStarted}
            />
          </div>
        </div>
        <h1 className="text-white text-4xl mt-20">Leaderboard</h1>

        <div className="w-full mt-28 p-8 flex flex-col ">
          <div className="grid grid-cols-2 items-center border-white border">
            <h1 className="p-2 text-white">Address</h1>
            <h2 className="p-2 text-white">SCORE</h2>
          </div>

          <div className="grid grid-cols-2 items-center border-white border">
            <h1 className="p-2 text-white">Address</h1>
            <h2 className="p-2 text-white">SCORE</h2>
          </div>

          <div className="grid grid-cols-2 items-center border-white border">
            <h1 className="p-2 text-white">Address</h1>
            <h2 className="p-2 text-white">SCORE</h2>
          </div>

          <div className="grid grid-cols-2 items-center border-white border">
            <h1 className="p-2 text-white">Address</h1>
            <h2 className="p-2 text-white">SCORE</h2>
          </div>
          <div className="grid grid-cols-2 items-center border-white border">
            <h1 className="p-2 text-white">Address</h1>
            <h2 className="p-2 text-white">SCORE</h2>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center w-full bg-blue-950">
      {renderButton()}
    </div>
  );
};

export default Competitive;
