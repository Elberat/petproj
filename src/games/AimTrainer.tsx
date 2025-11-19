import { useEffect, useState } from "react";
import type { GameProps } from "../core/types";

type Target = {
  x: number; // проценты по ширине
  y: number; // проценты по высоте
};

const GAME_TIME = 15; // секунд

export const AimTrainer: React.FC<GameProps> = ({ onGameOver }) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [isOver, setIsOver] = useState(false);
  const [target, setTarget] = useState<Target>(() => ({
    x: 50,
    y: 50,
  }));

  const moveTarget = () => {
    setTarget({
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 70,
    });
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          setIsOver(true);
          onGameOver(score);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onGameOver, score]);

  const handleHit = () => {
    if (isOver) return;
    setScore((s) => s + 1);
    moveTarget();
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
          borderRadius: 16,
          border: "1px solid #333",
          background: "#020617",
          position: "relative",
          overflow: "hidden",
          boxSizing: "border-box",
          padding: 8,
        }}
      >
        <div
          style={{
            fontSize: 14,
            color: "#e5e7eb",
            marginBottom: 4,
          }}
        >
          Счёт: {score} | Время: {timeLeft}
        </div>

        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
          }}
        >
          {!isOver && (
            <div
              onPointerDown={(e) => {
                e.preventDefault();
                handleHit();
              }}
              style={{
                position: "absolute",
                left: `${target.x}%`,
                top: `${target.y}%`,
                transform: "translate(-50%, -50%)",
                width: 40,
                height: 40,
                borderRadius: "999px",
                background: "#f97316",
                boxShadow: "0 0 12px rgba(249,115,22,0.9)",
                border: "3px solid #fff",
                cursor: "pointer",
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
