import React, { ReactNode } from "react";

interface RankingsGridProps {
  children: ReactNode;
}
const RankingsGrid: React.FC<RankingsGridProps> = ({ children }) => {
  return <div className="w-full gap-2  p-8 flex flex-col ">{children}</div>;
};

export default RankingsGrid;
