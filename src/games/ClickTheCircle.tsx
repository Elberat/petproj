import { useEffect, useState } from "react";
import type { GameProps } from "../core/types";

export const ClickTheCircle: React.FC<GameProps> = ({ onGameOver }) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isHidden, setIsHidden] = useState(false);
  const [pos, setPos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval);
          onGameOver(score);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onGameOver, score]);

  const handleClick = () => {
    if (timeLeft <= 0) return;

    setScore((s) => s + 1);

    // эффект: спрятать → подождать → показать
    setIsHidden(true);

    setTimeout(() => {
      setPos({
        x: 10 + Math.random() * 80,
        y: 10 + Math.random() * 80,
      });
      setIsHidden(false);
    }, 200); // задержка 200ms — можно увеличить до 300ms
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: 260,
          height: 260,
          borderRadius: "16px",
          border: "1px solid #333",
          background: "#020617",
          position: "relative",
          overflow: "hidden",
          padding: 10,
          boxSizing: "border-box",
        }}
      >
        <div style={{ color: "#e5e7eb", fontSize: 14, marginBottom: 4 }}>
          Очки: {score} | Время: {timeLeft}
        </div>

        {!isHidden && (
          <div
            onPointerDown={(e) => {
              e.preventDefault();
              handleClick();
            }}
            style={{
              position: "absolute",
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: "translate(-50%, -50%)",
              width: 50,
              height: 50,
              borderRadius: "50%",
              background: "#22c55e",
              boxShadow: "0 0 10px rgba(34,197,94,0.9)",
            }}
          />
        )}
      </div>
    </div>
  );
};
