import { games } from "./gamesRegistry";
import { GameWrapper } from "./GameWrapper";

export const GameFeed = () => {
  return (
    <div
      style={{
        height: "100vh",
        overflowY: "scroll",
        scrollSnapType: "y mandatory",
        background: "#050816",
        color: "#fff",
      }}
    >
      {games.map((game) => (
        <section
          key={game.id}
          style={{
            height: "100vh",
            scrollSnapAlign: "start",
            display: "flex",
            justifyContent: "center",
            alignItems: "stretch",
          }}
        >
          <GameWrapper game={game} />
        </section>
      ))}
    </div>
  );
};

