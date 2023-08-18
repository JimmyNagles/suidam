import React from "react";

// Define the props interface
interface RankingProps {
  address: string;
  score: number;
  rank: number;
}

const Ranking: React.FC<RankingProps> = ({
  address = "8x230821039120930123",
  score = 0,
  rank = 10,
}) => {
  return (
    <div className="grid grid-cols-2 items-center border-white border">
      <div className="grid grid-cols-2  ">
        <h2 className="p-2 text-center text-white">#{rank}</h2>
        <h2 className="p-2 text-center text-white">{score}</h2>
      </div>
      <h1 className="p-2 text-center text-white">{address}</h1>
    </div>
  );
};

export default Ranking;
