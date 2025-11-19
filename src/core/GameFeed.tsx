import { useState } from "react";
import { games } from "./gamesRegistry";
import { GameWrapper } from "./GameWrapper";

export const GameFeed = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const cycles = 5; // 5 циклов по 10 игр = 50 экранов
  const gamesToRender = Array.from({ length: games.length * cycles }, (_, i) => {
    const baseIndex = i % games.length;
    return { game: games[baseIndex], index: i };
  });

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const index = Math.round(el.scrollTop / el.clientHeight);
    setActiveIndex(index);
  };

  return (
    <div
      style={{
        height: "100vh",
        overflowY: "scroll",
        scrollSnapType: "y mandatory",
        background: "#050816",
        color: "#fff",
      }}
      onScroll={handleScroll}
    >
      {gamesToRender.map(({ game, index }) => (
        <section
          key={game.id + "-" + index}
          style={{
            height: "100vh",
            scrollSnapAlign: "start",
            display: "flex",
            justifyContent: "center",
            alignItems: "stretch",
          }}
        >
          <GameWrapper game={game} isActive={index === activeIndex} />
        </section>
      ))}
    </div>
  );
};

