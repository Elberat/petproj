import { useEffect, useState } from "react";
import type { GameProps } from "../core/types";

type Cell = { x: number; y: number };
type Dir = "up" | "down" | "left" | "right";

const GRID_SIZE = 10;
const TICK_MS = 200;

const randomCell = (): Cell => ({
  x: Math.floor(Math.random() * GRID_SIZE),
  y: Math.floor(Math.random() * GRID_SIZE),
});

export const SnakeGame: React.FC<GameProps> = ({ onGameOver, lastControl }) => {
  const [direction, setDirection] = useState<Dir>("right");
  const [snake, setSnake] = useState<Cell[]>([
    { x: 4, y: 5 },
    { x: 5, y: 5 },
  ]);
  const [apple, setApple] = useState<Cell>(() => randomCell());
  const [score, setScore] = useState(0);
  const [isOver, setIsOver] = useState(false);

  // обработка управления стрелками
  useEffect(() => {
    if (!lastControl || isOver) return;

    setDirection((prev) => {
      const opposite: Record<Dir, Dir> = {
        up: "down",
        down: "up",
        left: "right",
        right: "left",
      };

      // не даём разворачиваться на 180°
      if (
        (lastControl === "up" ||
          lastControl === "down" ||
          lastControl === "left" ||
          lastControl === "right") &&
        opposite[prev] !== lastControl
      ) {
        return lastControl as Dir;
      }

      return prev;
    });
  }, [lastControl, isOver]);

  // игровой цикл
  useEffect(() => {
    if (isOver) return;

    const intervalId = setInterval(() => {
      setSnake((prevSnake) => {
        const head = prevSnake[prevSnake.length - 1];

        let newHead: Cell = head;
        if (direction === "up") newHead = { x: head.x, y: head.y - 1 };
        if (direction === "down") newHead = { x: head.x, y: head.y + 1 };
        if (direction === "left") newHead = { x: head.x - 1, y: head.y };
        if (direction === "right") newHead = { x: head.x + 1, y: head.y };

        // столкновение со стеной
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setIsOver(true);
          onGameOver(score);
          return prevSnake;
        }

        // столкновение с самим собой
        const hitsSelf = prevSnake.some((cell) => cell.x === newHead.x && cell.y === newHead.y);
        if (hitsSelf) {
          setIsOver(true);
          onGameOver(score);
          return prevSnake;
        }

        let newSnake = [...prevSnake, newHead];

        const ateApple = newHead.x === apple.x && newHead.y === apple.y;

        if (ateApple) {
          const newScore = score + 1;
          setScore(newScore);

          // ставим новое яблоко не на змейку
          let nextApple = randomCell();
          while (newSnake.some((c) => c.x === nextApple.x && c.y === nextApple.y)) {
            nextApple = randomCell();
          }
          setApple(nextApple);

          // не обрезаем хвост => змейка растёт
        } else {
          // просто двигаемся – хвост обрезаем
          newSnake = newSnake.slice(1);
        }

        return newSnake;
      });
    }, TICK_MS);

    return () => clearInterval(intervalId);
    // направление и яблоко изменяются редко, можем не добавлять их в зависимости
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [direction, isOver, score, apple, onGameOver]);

  // рендер поля 10x10
  const cellSize = 18;
  const boardSize = GRID_SIZE * cellSize;

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
          width: boardSize + 16,
          height: boardSize + 40,
          borderRadius: "16px",
          border: "1px solid #333",
          background: "#020617",
          padding: "8px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            fontSize: 14,
            marginBottom: 6,
            color: "#e5e7eb",
          }}
        >
          Длина: {snake.length} | Счёт: {score}
          {isOver && <span style={{ marginLeft: 8, color: "#f97316" }}>Конец игры</span>}
        </div>

        <div
          style={{
            width: boardSize,
            height: boardSize,
            background: "#0b1220",
            display: "grid",
            gridTemplateColumns: `repeat(${GRID_SIZE}, ${cellSize}px)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, ${cellSize}px)`,
            gap: 1,
            borderRadius: 8,
            padding: 2,
            boxSizing: "border-box",
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
            const x = index % GRID_SIZE;
            const y = Math.floor(index / GRID_SIZE);

            const isSnake = snake.some((c) => c.x === x && c.y === y);
            const isHead =
              snake[snake.length - 1].x === x && snake[snake.length - 1].y === y;
            const isApple = apple.x === x && apple.y === y;

            let bg = "#020617";

            if (isSnake) bg = "#22c55e";
            if (isHead) bg = "#4ade80";
            if (isApple) bg = "#ef4444";

            return (
              <div
                key={index}
                style={{
                  width: cellSize,
                  height: cellSize,
                  borderRadius: 4,
                  background: bg,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
