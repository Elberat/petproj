import { useState, useEffect, useCallback } from "react";
import type { GameMeta, ControlId } from "./types";
import { ControlsPad } from "./ControlsPad";

type GameWrapperProps = {
  game: GameMeta;
  isActive: boolean;
};

export const GameWrapper = ({ game, isActive }: GameWrapperProps) => {
  const [lastControl, setLastControl] = useState<ControlId | null>(null);
  const [lastScore, setLastScore] = useState<number | null>(null);
  const [bestScore, setBestScore] = useState<number | null>(null);
  const [gameKey, setGameKey] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [isOver, setIsOver] = useState(false);

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

  useEffect(() => {
    if (isActive && !hasStarted) {
      setHasStarted(true);
    }
  }, [isActive, hasStarted]);

  const handleControlPress = (control: ControlId) => {
    setLastControl(control);
    // ВАЖНО: делаем это событием, а не постоянным состоянием
    // Используем requestAnimationFrame для более надежного сброса
    requestAnimationFrame(() => {
      setLastControl(null);
    });
  };

  const handleGameOver = useCallback(
    (score: number) => {
      setLastScore(score);
      setIsOver(true);
      if (bestScore === null || score > bestScore) {
        setBestScore(score);
        localStorage.setItem(storageKey, score.toString());
      }
    },
    [bestScore, storageKey]
  );

  const handleRestart = () => {
    setGameKey((prev) => prev + 1);
    setLastScore(null);
    setLastControl(null);
    setIsOver(false);
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
      <header style={{ marginBottom: 8, textAlign: "center" }}>
        <h2 style={{ margin: 0, fontSize: 20 }}>{game.title}</h2>
        <p style={{ margin: "4px 0 0", opacity: 0.75, fontSize: 13 }}>
          {game.description}
        </p>
        <div style={{ marginTop: 4, fontSize: 12, opacity: 0.8 }}>
          Рекорд: {bestScore ?? 0} &nbsp; | &nbsp; Последний: {lastScore ?? 0}
        </div>
      </header>

      {/* Контейнер игры */}
      <div
        style={{
          flex: 1,
          borderRadius: 20,
          border: "1px solid #27272f",
          background:
            "radial-gradient(circle at top, #111827 0, #020617 55%, #000 100%)",
          padding: 12,
          marginBottom: 8,
          boxShadow: "0 18px 40px rgba(0,0,0,0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {hasStarted ? (
          <GameComponent
            key={gameKey}
            onGameOver={handleGameOver}
            lastControl={lastControl}
          />
        ) : (
          <div
            style={{
              height: "100%",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              opacity: 0.7,
            }}
          >
            Свайпни сюда, чтобы начать игру
          </div>
        )}
      </div>

      {/* Сообщение при проигрыше */}
      {isOver && (
        <div
          style={{
            marginTop: 4,
            fontSize: 14,
            textAlign: "center",
            color: "#f97316",
          }}
        >
          Ты проиграл. Попробуй ещё раз!
        </div>
      )}

      {/* Блок управления */}
      <ControlsPad controls={game.controls} onPress={handleControlPress} />

      {/* Кнопка перезапуска */}
      <button
        onClick={handleRestart}
        style={{
          marginTop: 8,
          padding: "10px 14px",
          borderRadius: 999,
          border: "1px solid #4b5563",
          background: "rgba(15,23,42,0.9)",
          color: "#e5e7eb",
          fontSize: 14,
          fontWeight: 600,
          width: "100%",
          cursor: "pointer",
        }}
      >
        Играть ещё раз
      </button>
    </div>
  );
};

