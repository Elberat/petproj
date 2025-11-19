import { useEffect, useState, useRef } from "react";
import type { GameProps } from "../core/types";

export const ReactionTime: React.FC<GameProps> = ({ onGameOver, lastControl }) => {
  const [phase, setPhase] = useState<"wait" | "ready" | "clicked">("wait");
  const [message, setMessage] = useState("Жди зелёного…");
  const startRef = useRef<number | null>(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    // случайное время 1–3 секунды
    const timeout = setTimeout(() => {
      setPhase("ready");
      setMessage("ЖМИ!");
      startRef.current = performance.now();
    }, 1000 + Math.random() * 2000);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!lastControl) return;
    if (phase === "ready") {
      const end = performance.now();
      const reaction = end - (startRef.current ?? end);
      const scoreNum = Math.round(reaction);

      setScore(scoreNum);
      setMessage(`Реакция: ${scoreNum} мс`);
      setPhase("clicked");

      setTimeout(() => {
        onGameOver(Math.max(1, 300 - Math.floor(scoreNum))); 
      }, 700);
    }
  }, [lastControl, phase, onGameOver]);

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
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
          color: phase === "wait" ? "#f87171" : phase === "ready" ? "#4ade80" : "#60a5fa",
          textAlign: "center",
          padding: 10,
        }}
      >
        {message}
      </div>
    </div>
  );
};
