import { useEffect, useState } from "react";
import type { GameProps } from "../core/types";

type ColorOption = {
  name: string; // текст
  css: string;  // цвет
};

const COLORS: ColorOption[] = [
  { name: "КРАСНЫЙ", css: "#ef4444" },
  { name: "СИНИЙ", css: "#3b82f6" },
  { name: "ЗЕЛЁНЫЙ", css: "#22c55e" },
  { name: "ЖЁЛТЫЙ", css: "#eab308" },
];

const ROUNDS_TOTAL = 12;

export const ColorMatch: React.FC<GameProps> = ({ onGameOver, lastControl }) => {
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [isOver, setIsOver] = useState(false);

  const [wordIndex, setWordIndex] = useState(0);  // какой текст
  const [colorIndex, setColorIndex] = useState(0); // какой цвет текста

  const [message, setMessage] = useState<string | null>(null);

  const generateRound = () => {
    const w = Math.floor(Math.random() * COLORS.length);

    let c: number;
    // 50/50 совпадает / не совпадает
    if (Math.random() < 0.5) {
      c = w;
    } else {
      const options = COLORS.map((_, i) => i).filter((i) => i !== w);
      c = options[Math.floor(Math.random() * options.length)];
    }

    setWordIndex(w);
    setColorIndex(c);
  };

  // первый раунд
  useEffect(() => {
    generateRound();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // обработка нажатий left/right
  useEffect(() => {
    if (isOver || !lastControl) return;
    if (lastControl !== "left" && lastControl !== "right") return;

    const isMatch = wordIndex === colorIndex;
    const userSaysMatch = lastControl === "right";

    const correct = isMatch === userSaysMatch;

    setMessage(correct ? "Верно!" : "Ошибка");

    setScore((s) => (correct ? s + 1 : s));

    if (round >= ROUNDS_TOTAL) {
      const finalScore = (correct ? score + 1 : score);
      setIsOver(true);
      onGameOver(finalScore);
      return;
    }

    setRound((r) => r + 1);
    generateRound();

    const timer = setTimeout(() => setMessage(null), 500);
    return () => clearTimeout(timer);
  }, [lastControl, isOver, wordIndex, colorIndex, round, score, onGameOver]);

  const color = COLORS[colorIndex];

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
          height: 220,
          borderRadius: 16,
          border: "1px solid #333",
          background: "#020617",
          padding: 12,
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            fontSize: 14,
            color: "#e5e7eb",
            marginBottom: 4,
          }}
        >
          Раунд: {round} / {ROUNDS_TOTAL} | Счёт: {score}
        </div>

        <div
          style={{
            marginTop: 12,
            height: 80,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontSize: 28,
              fontWeight: 800,
              letterSpacing: "2px",
              color: color.css,
            }}
          >
            {COLORS[wordIndex].name}
          </span>
        </div>

        <div
          style={{
            marginTop: 20,
            textAlign: "center",
            fontSize: 13,
            color: "#9ca3af",
          }}
        >
          Левая кнопка: <b>НЕ совпадает</b> <br />
          Правая кнопка: <b>СОВПАДАЕТ</b>
        </div>

        {message && (
          <div
            style={{
              marginTop: 10,
              textAlign: "center",
              fontSize: 14,
              color: message === "Верно!" ? "#22c55e" : "#f97316",
            }}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
};
