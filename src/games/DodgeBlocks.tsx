import { useEffect, useRef, useState } from "react";
import type { GameProps } from "../core/types";

type Block = {
  id: number;
  x: number; // колонка 0..2
  y: number; // ряд 0..5
};

const GRID_WIDTH = 3;
const GRID_HEIGHT = 6;

export const DodgeBlocks: React.FC<GameProps> = ({ onGameOver, lastControl }) => {
  const [playerX, setPlayerX] = useState(1); // позиция игрока по X (0..2)
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [score, setScore] = useState(0);
  const [isOver, setIsOver] = useState(false);

  // счётчик id для блоков
  const nextIdRef = useRef(0);

  // обработка управления
  useEffect(() => {
    if (isOver || !lastControl) return;

    if (lastControl === "left") {
      setPlayerX((x) => Math.max(0, x - 1));
    }

    if (lastControl === "right") {
      setPlayerX((x) => Math.min(GRID_WIDTH - 1, x + 1));
    }
  }, [lastControl, isOver]);

  // игровой цикл: движение блоков + спавн новых
  useEffect(() => {
    if (isOver) return;

    const intervalId = setInterval(() => {
      setBlocks((prev) => {
        // двигаем блоки вниз
        const moved = prev
          .map((b) => ({ ...b, y: b.y + 1 }))
          .filter((b) => b.y < GRID_HEIGHT); // удаляем ушедшие за поле

        // иногда спавним новый блок сверху
        if (Math.random() < 0.4) {
          const id = nextIdRef.current++;
          moved.push({
            id,
            x: Math.floor(Math.random() * GRID_WIDTH),
            y: 0,
          });
        }

        return moved;
      });

      setScore((s) => s + 1);
    }, 220);

    return () => clearInterval(intervalId);
  }, [isOver]);

  // проверка столкновения
  useEffect(() => {
    if (isOver) return;

    const hit = blocks.some((b) => b.y === GRID_HEIGHT - 1 && b.x === playerX);

    if (hit) {
      setIsOver(true);
      onGameOver(score);
    }
  }, [blocks, playerX, isOver, score, onGameOver]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
      }}
    >
      <div
        style={{
          width: 220,
          height: 320,
          borderRadius: "16px",
          border: "1px solid #333",
          background: "#0d0f16",
          position: "relative",
          overflow: "hidden",
          padding: "8px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            fontSize: "14px",
            marginBottom: "4px",
            color: "#fff",
          }}
        >
          Счёт: {score}
        </div>

        {/* игровое поле */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
          }}
        >
          {/* блоки */}
          {blocks.map((b) => (
            <div
              key={b.id}
              style={{
                position: "absolute",
                width: "50px",
                height: "50px",
                background: "#e53935",
                borderRadius: "10px",
                left: b.x * 60 + 10,
                top: b.y * 50 + 10,
                transition: "top 0.18s linear",
              }}
            />
          ))}

          {/* игрок */}
          <div
            style={{
              position: "absolute",
              width: "50px",
              height: "50px",
              background: "#43a047",
              borderRadius: "50%",
              left: playerX * 60 + 10,
              top: (GRID_HEIGHT - 1) * 50 + 10,
              boxShadow: "0 0 10px rgba(67, 160, 71, 0.8)",
            }}
          />
        </div>
      </div>
    </div>
  );
};
