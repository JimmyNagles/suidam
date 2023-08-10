import Image from "next/image";
import { Inter } from "next/font/google";
import FlappyBirdCanvas from "../../components/FlappyBirdCanvas";
import { useEffect, useState } from "react";
import EthosConnect from "ethos-connect";
import { useRouter } from "next/router";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const router = useRouter();

  return (
    <main
      className={`min-h-screen bg-blue-950 flex flex-col justify-center items-center p-24 ${inter.className}`}
    >
      <button
        className="p-4 mb-2 bg-blue-900 border-white  shadow-inner bg-opacity-0  hover:bg-opacity-80 hover:shadow-2xl transition-all duration-1000 ease-in w-[200px]   rounded-md"
        onClick={() => {
          router.push("/competitive");
        }}
      >
        Competitive Mode
      </button>
      <div>
        <FlappyBirdCanvas />
      </div>
    </main>
  );
}
