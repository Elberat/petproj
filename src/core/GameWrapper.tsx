import { useState, useEffect, useRef } from "react";
import type { GameMeta, ControlId } from "./types";
import { ControlsPad } from "./ControlsPad";

type GameWrapperProps = {
  game: GameMeta;
};

export const GameWrapper = ({ game }: GameWrapperProps) => {
  const [lastControl, setLastControl] = useState<ControlId | null>(null);
  const [lastScore, setLastScore] = useState<number | null>(null);
  const [bestScore, setBestScore] = useState<number | null>(null);
  const [gameKey, setGameKey] = useState(0);

  const storageKey = `best_${game.id}`;

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      const parsed = parseInt(stored, 10);
      if (!isNaN(parsed)) {
        setBestScore(parsed);
      }
    }
  }, [storageKey]);

  const handleControlPress = (control: ControlId) => {
    setLastControl(control);
    // Сбрасываем lastControl через небольшую задержку, чтобы игра успела его обработать
    setTimeout(() => {
      setLastControl(null);
    }, 100);
  };

  const handleGameOver = (score: number) => {
    setLastScore(score);
    if (bestScore === null || score > bestScore) {
      setBestScore(score);
      localStorage.setItem(storageKey, score.toString());
    }
  };

  const handleRestart = () => {
    setGameKey((prev) => prev + 1);
    setLastScore(null);
    setLastControl(null);
  };

  const GameComponent = game.component;

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: "16px",
        boxSizing: "border-box",
        maxWidth: "600px",
        margin: "0 auto",
        width: "100%",
      }}
    >
      {/* Заголовок и описание */}
      <div style={{ marginBottom: "16px", textAlign: "center" }}>
        <h1 style={{ margin: "0 0 8px 0", fontSize: "24px", fontWeight: "bold" }}>
          {game.title}
        </h1>
        <p style={{ margin: "0 0 12px 0", fontSize: "14px", opacity: 0.8 }}>
          {game.description}
        </p>
        {/* Рекорды */}
        <div
          style={{
            display: "flex",
            gap: "16px",
            justifyContent: "center",
            fontSize: "14px",
          }}
        >
          {bestScore !== null && (
            <span>
              Рекорд: <strong>{bestScore}</strong>
            </span>
          )}
          {lastScore !== null && (
            <span>
              Последний: <strong>{lastScore}</strong>
            </span>
          )}
        </div>
      </div>

      {/* Контейнер игры */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 0,
          marginBottom: "16px",
        }}
      >
        <div style={{ width: "100%", height: "100%" }}>
          <GameComponent
            key={gameKey}
            onGameOver={handleGameOver}
            lastControl={lastControl}
          />
        </div>
      </div>

      {/* Блок управления */}
      <ControlsPad controls={game.controls} onPress={handleControlPress} />

      {/* Кнопка перезапуска */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: "16px" }}>
        <button
          style={{
            padding: "12px 24px",
            border: "2px solid #fff",
            borderRadius: "8px",
            background: "rgba(255, 255, 255, 0.1)",
            color: "#fff",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
            userSelect: "none",
          }}
          onClick={handleRestart}
        >
          Играть ещё раз
        </button>
      </div>
    </div>
  );
};

