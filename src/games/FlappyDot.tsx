import { useEffect, useState } from "react";
import type { GameProps } from "../core/types";

// Птичка-точка летит, есть трубы с дыркой, надо не врезаться.

type Pipe = {
  id: number;
  x: number; // позиция по горизонтали (px внутри поля)
  gapY: number; // верхняя граница отверстия (px)
};

const FIELD_WIDTH = 220;
const FIELD_HEIGHT = 320;
const PLAYER_X = 60; // фиксированная позиция точки по X
const GRAVITY = 0.6;
const JUMP_VELOCITY = -6;
const PIPE_SPEED = 2.2;
const PIPE_GAP = 90;
const PIPE_WIDTH = 50;

export const FlappyDot: React.FC<GameProps> = ({ onGameOver, lastControl }) => {
  const [playerY, setPlayerY] = useState(FIELD_HEIGHT / 2);
  const [velocity, setVelocity] = useState(0);
  const [pipes, setPipes] = useState<Pipe[]>([]);
  const [score, setScore] = useState(0);
  const [isOver, setIsOver] = useState(false);
  const [nextId, setNextId] = useState(1);

  // стартовые трубы
  useEffect(() => {
    const initial: Pipe[] = [
      { id: 0, x: FIELD_WIDTH + 40, gapY: 80 },
    ];
    setPipes(initial);
  }, []);

  // обработка TAP (прыжок)
  useEffect(() => {
    if (isOver || !lastControl) return;
    if (lastControl === "tap") {
      setVelocity(JUMP_VELOCITY);
    }
  }, [lastControl, isOver]);

  // игровой цикл: гравитация + движение труб + счёт
  useEffect(() => {
    if (isOver) return;

    const id = setInterval(() => {
      // двигаем птичку
      setVelocity((v) => v + GRAVITY);
      setPlayerY((y) => y + velocity);

      // двигаем трубы
      setPipes((prev) => {
        const moved = prev
          .map((p) => ({ ...p, x: p.x - PIPE_SPEED }))
          .filter((p) => p.x + PIPE_WIDTH > -20); // удаляем ушедшие

        // спавним новую трубу, когда последняя ушла достаточно влево
        const last = moved[moved.length - 1];
        if (!last || last.x < FIELD_WIDTH - 140) {
          const gapY =
            60 + Math.random() * (FIELD_HEIGHT - PIPE_GAP - 120); // чтобы дырка не была слишком сверху/снизу

          moved.push({
            id: nextId,
            x: FIELD_WIDTH + 40,
            gapY,
          });

          setNextId((n) => n + 1);
        }

        return moved;
      });

      // живём — растёт счёт
      setScore((s) => s + 1);
    }, 30);

    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOver, velocity]);

  // проверка столкновений и границ
  useEffect(() => {
    if (isOver) return;

    // вылет за верх/низ
    if (playerY < 0 || playerY > FIELD_HEIGHT) {
      setIsOver(true);
      onGameOver(score);
      return;
    }

    // коллизия с трубами
    const dotRadius = 12;
    const dotTop = playerY - dotRadius;
    const dotBottom = playerY + dotRadius;

    const hit = pipes.some((p) => {
      const pipeLeft = p.x;
      const pipeRight = p.x + PIPE_WIDTH;

      const inX = PLAYER_X + dotRadius > pipeLeft && PLAYER_X - dotRadius < pipeRight;
      if (!inX) return false;

      const gapTop = p.gapY;
      const gapBottom = p.gapY + PIPE_GAP;

      const hitsTop = dotTop < gapTop;
      const hitsBottom = dotBottom > gapBottom;

      return hitsTop || hitsBottom;
    });

    if (hit) {
      setIsOver(true);
      onGameOver(score);
    }
  }, [pipes, playerY, score, isOver, onGameOver]);

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
          width: FIELD_WIDTH,
          height: FIELD_HEIGHT,
          borderRadius: "16px",
          border: "1px solid #333",
          background: "linear-gradient(180deg, #0f172a 0%, #020617 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* счёт в углу */}
        <div
          style={{
            position: "absolute",
            top: 8,
            left: 10,
            fontSize: 14,
            color: "#e5e7eb",
            zIndex: 2,
          }}
        >
          Счёт: {score}
        </div>

        {/* трубы */}
        {pipes.map((p) => (
          <div key={p.id}>
            {/* верхняя труба */}
            <div
              style={{
                position: "absolute",
                left: p.x,
                top: 0,
                width: PIPE_WIDTH,
                height: p.gapY,
                background: "#22c55e",
              }}
            />
            {/* нижняя труба */}
            <div
              style={{
                position: "absolute",
                left: p.x,
                top: p.gapY + PIPE_GAP,
                width: PIPE_WIDTH,
                height: FIELD_HEIGHT - (p.gapY + PIPE_GAP),
                background: "#22c55e",
              }}
            />
          </div>
        ))}

        {/* точка-птичка */}
        <div
          style={{
            position: "absolute",
            width: 24,
            height: 24,
            borderRadius: "999px",
            left: PLAYER_X - 12,
            top: playerY - 12,
            background: "#facc15",
            boxShadow: "0 0 12px rgba(250, 204, 21, 0.9)",
          }}
        />
      </div>
    </div>
  );
};
