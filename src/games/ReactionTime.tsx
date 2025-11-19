import { useState, useEffect, useRef } from "react";
import type { GameProps } from "../core/types";

type GameState = "waiting" | "ready" | "tooEarly" | "finished";

export const ReactionTime: React.FC<GameProps> = ({ onGameOver, lastControl }) => {
  const [state, setState] = useState<GameState>("waiting");
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [round, setRound] = useState(0);
  const [scores, setScores] = useState<number[]>([]);
  const timeoutRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const roundRef = useRef(0);
  const scoresRef = useRef<number[]>([]);
  const maxRounds = 5;

  useEffect(() => {
    if (state === "waiting") {
      // Случайная задержка от 1 до 5 секунд
      const delay = 1000 + Math.random() * 4000;
      timeoutRef.current = window.setTimeout(() => {
        setState("ready");
        startTimeRef.current = Date.now();
      }, delay);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [state, round]);

  useEffect(() => {
    if (lastControl === "tap") {
      if (state === "waiting") {
        // Нажали слишком рано
        setState("tooEarly");
        const timeoutId = window.setTimeout(() => {
          roundRef.current += 1;
          setRound(roundRef.current);
          setState("waiting");
        }, 1500);
        return () => clearTimeout(timeoutId);
      } else if (state === "ready" && startTimeRef.current) {
        // Правильное нажатие
        const time = Date.now() - startTimeRef.current;
        setReactionTime(time);
        const score = Math.max(0, 1000 - time);
        scoresRef.current = [...scoresRef.current, score];
        setScores(scoresRef.current);
        setState("finished");
        
        const timeoutId = window.setTimeout(() => {
          if (roundRef.current + 1 < maxRounds) {
            roundRef.current += 1;
            setRound(roundRef.current);
            setState("waiting");
            setReactionTime(null);
          } else {
            // Игра завершена
            const totalScore = scoresRef.current.reduce((sum, s) => sum + s, 0);
            onGameOver(totalScore);
          }
        }, 2000);
        return () => clearTimeout(timeoutId);
      }
    }
  }, [lastControl, state, onGameOver]);

  const getBackgroundColor = () => {
    if (state === "waiting") return "#FF5722";
    if (state === "ready") return "#4CAF50";
    if (state === "tooEarly") return "#FFC107";
    return "#2196F3";
  };

  const getMessage = () => {
    if (state === "waiting") return "Жди...";
    if (state === "ready") return "ЖМИ!";
    if (state === "tooEarly") return "Слишком рано!";
    if (reactionTime !== null) {
      return `Время реакции: ${reactionTime}мс`;
    }
    return "Готово";
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: getBackgroundColor(),
        borderRadius: "8px",
        transition: "background 0.3s",
      }}
    >
      <div
        style={{
          fontSize: "48px",
          fontWeight: "bold",
          marginBottom: "24px",
          textAlign: "center",
        }}
      >
        {getMessage()}
      </div>
      {state === "finished" && reactionTime !== null && (
        <div style={{ fontSize: "24px", marginBottom: "16px" }}>
          Очки: {Math.max(0, 1000 - reactionTime)}
        </div>
      )}
      <div style={{ fontSize: "18px", opacity: 0.9 }}>
        Раунд {round + 1} / {maxRounds}
      </div>
      {scores.length > 0 && (
        <div style={{ marginTop: "24px", fontSize: "16px" }}>
          Средний результат: {Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)}
        </div>
      )}
    </div>
  );
};

