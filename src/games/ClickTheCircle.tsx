import { useState, useEffect, useRef } from "react";
import type { GameProps } from "../core/types";

export const ClickTheCircle: React.FC<GameProps> = ({ onGameOver, lastControl }) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [circlePosition, setCirclePosition] = useState({ x: 50, y: 50 });
  const [circleSize, setCircleSize] = useState(80);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    // Таймер игры
    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Перемещение круга
    intervalRef.current = window.setInterval(() => {
      if (gameAreaRef.current) {
        const rect = gameAreaRef.current.getBoundingClientRect();
        const currentSize = 60 + Math.random() * 40;
        const maxX = rect.width - currentSize;
        const maxY = rect.height - currentSize;
        setCirclePosition({
          x: Math.random() * maxX,
          y: Math.random() * maxY,
        });
        setCircleSize(currentSize);
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      onGameOver(score);
    }
  }, [timeLeft, score, onGameOver]);

  const handleCircleClick = () => {
    setScore((prev) => prev + 1);
    // Перемещаем круг после клика
    if (gameAreaRef.current) {
      const rect = gameAreaRef.current.getBoundingClientRect();
      const maxX = rect.width - circleSize;
      const maxY = rect.height - circleSize;
      setCirclePosition({
        x: Math.random() * maxX,
        y: Math.random() * maxY,
      });
      setCircleSize(60 + Math.random() * 40);
    }
  };

  // Обработка lastControl (tap)
  useEffect(() => {
    if (lastControl === "tap") {
      // Проверяем, попал ли tap в круг (приблизительно)
      handleCircleClick();
    }
  }, [lastControl]);

  return (
    <div
      ref={gameAreaRef}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        background: "rgba(255, 255, 255, 0.05)",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "16px",
          left: "16px",
          fontSize: "18px",
          fontWeight: "bold",
        }}
      >
        Счёт: {score} | Время: {timeLeft}
      </div>
      <div
        onClick={handleCircleClick}
        style={{
          position: "absolute",
          left: `${circlePosition.x}px`,
          top: `${circlePosition.y}px`,
          width: `${circleSize}px`,
          height: `${circleSize}px`,
          borderRadius: "50%",
          background: "#4CAF50",
          cursor: "pointer",
          border: "3px solid #fff",
          boxShadow: "0 0 20px rgba(76, 175, 80, 0.5)",
          transition: "transform 0.1s",
        }}
        onMouseDown={(e) => {
          e.preventDefault();
          handleCircleClick();
        }}
      />
    </div>
  );
};

