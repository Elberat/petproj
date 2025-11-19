import { useEffect, useState } from "react";
import type { GameProps } from "../core/types";

const GRID_SIZE = 3; // 3x3 => числа 1..9

const shuffle = <T,>(arr: T[]): T[] => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

export const NumberRush: React.FC<GameProps> = ({ onGameOver }) => {
  const [numbers, setNumbers] = useState<number[]>(() => shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]));
  const [next, setNext] = useState(1);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const [timeMs, setTimeMs] = useState<number | null>(null);

  const handleClick = (num: number) => {
    if (finished) return;

    if (num !== next) return;

    if (next === 1) {
      setStartTime(Date.now());
    }

    if (next === 9) {
      const end = Date.now();
      const totalMs = startTime ? end - startTime : 0;
      setTimeMs(totalMs);
      setFinished(true);

      // чем быстрее, тем выше счёт
      const seconds = totalMs / 1000;
      const score = Math.max(1, Math.round(100 - seconds * 5));
      onGameOver(score);
      return;
    }

    setNext((n) => n + 1);
  };

  const handleRestart = () => {
    setNumbers(shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]));
    setNext(1);
    setStartTime(null);
    setFinished(false);
    setTimeMs(null);
  };

  // при первом рендере перемешиваем
  useEffect(() => {
    setNumbers(shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]));
  }, []);

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
          width: 220,
          height: 260,
          borderRadius: 16,
          border: "1px solid #333",
          background: "#020617",
          padding: 10,
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            fontSize: 14,
            color: "#e5e7eb",
            marginBottom: 6,
          }}
        >
          Следующее число: {next}
          {finished && timeMs !== null && (
            <span style={{ marginLeft: 8, color: "#22c55e" }}>
              Время: {(timeMs / 1000).toFixed(1)} c
            </span>
          )}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            gap: 8,
            marginTop: 4,
          }}
        >
          {numbers.map((num) => {
            const isDone = num < next;
            const isNext = num === next;
            return (
              <button
                key={num}
                onClick={() => handleClick(num)}
                style={{
                  height: 52,
                  borderRadius: 10,
                  border: "1px solid #4b5563",
                  background: isDone
                    ? "#22c55e"
                    : isNext
                    ? "#1d4ed8"
                    : "#020617",
                  color: "#e5e7eb",
                  fontSize: 20,
                  fontWeight: 700,
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                {num}
              </button>
            );
          })}
        </div>

        {finished && (
          <div
            style={{
              marginTop: 10,
              textAlign: "center",
            }}
          >
            <button
              onClick={handleRestart}
              style={{
                padding: "6px 12px",
                borderRadius: 999,
                border: "1px solid #4b5563",
                background: "transparent",
                color: "#e5e7eb",
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Сыграть ещё раз (внутри игры)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
