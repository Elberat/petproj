import { useEffect, useState, useRef } from "react";
import type { GameProps, ControlId } from "../core/types";

type Block = {
  id: number;
  x: number;      // позиция слева в px
  width: number;  // ширина блока в px
  level: number;  // уровень снизу, 0 = самый нижний
};

const FIELD_WIDTH = 220;
const FIELD_HEIGHT = 320;
const BASE_WIDTH = 140;
const BLOCK_HEIGHT = 22;
const SPEED = 2.2;
const MAX_LEVELS = 8; // сколько слоёв максимум

export const StackTower: React.FC<GameProps> = ({ onGameOver, lastControl }) => {
  // самый нижний блок
  const [blocks, setBlocks] = useState<Block[]>(() => {
    const baseX = (FIELD_WIDTH - BASE_WIDTH) / 2;
    return [
      {
        id: 0,
        x: baseX,
        width: BASE_WIDTH,
        level: 0,
      },
    ];
  });

  const [movingX, setMovingX] = useState(0);
  const [movingWidth, setMovingWidth] = useState(BASE_WIDTH);
  const [movingDir, setMovingDir] = useState<1 | -1>(1);
  const [level, setLevel] = useState(1); // следующий уровень
  const [score, setScore] = useState(0);
  const [nextId, setNextId] = useState(1);
  const [isOver, setIsOver] = useState(false);
  const processedControlRef = useRef<ControlId | null>(null);

  // движение верхнего блока
  useEffect(() => {
    if (isOver) return;

    const id = setInterval(() => {
      setMovingX((x) => {
        let nx = x + SPEED * movingDir;
        if (nx < 0) {
          nx = 0;
          setMovingDir(1);
        } else if (nx + movingWidth > FIELD_WIDTH) {
          nx = FIELD_WIDTH - movingWidth;
          setMovingDir(-1);
        }
        return nx;
      });
    }, 16);

    return () => clearInterval(id);
  }, [isOver, movingDir, movingWidth]);

  // обработка ACTION – "роняем" блок
  useEffect(() => {
    if (isOver) return;
    
    // Если lastControl стал null - сбрасываем флаг обработки
    if (lastControl === null) {
      processedControlRef.current = null;
      return;
    }
    
    // Обрабатываем только "action"
    if (lastControl !== "action") {
      return;
    }
    
    // Если это значение уже обработано - пропускаем
    if (processedControlRef.current === "action") {
      return;
    }
    
    // Обрабатываем новое значение
    processedControlRef.current = "action";
    
    setBlocks((prev) => {
      const prevTop = prev[prev.length - 1];

      const movingLeft = movingX;
      const movingRight = movingX + movingWidth;
      const baseLeft = prevTop.x;
      const baseRight = prevTop.x + prevTop.width;

      const overlapLeft = Math.max(movingLeft, baseLeft);
      const overlapRight = Math.min(movingRight, baseRight);
      const overlapWidth = overlapRight - overlapLeft;

      // если вообще не попали по блоку — конец игры
      if (overlapWidth <= 0) {
        setIsOver(true);
        onGameOver(score);
        return prev;
      }

      const newBlock: Block = {
        id: nextId,
        x: overlapLeft,
        width: overlapWidth,
        level,
      };

      const updated = [...prev, newBlock];

      const newScore = score + 1;
      setScore(newScore);
      setNextId((id) => id + 1);

      // достигли максимальной высоты — победа/конец
      if (level >= MAX_LEVELS) {
        setIsOver(true);
        onGameOver(newScore);
        return updated;
      }

      // готовим следующий движущийся блок
      setLevel(level + 1);
      setMovingWidth(overlapWidth);
      setMovingDir(1);
      setMovingX(0);

      return updated;
    });
  }, [lastControl, isOver, level, movingWidth, movingX, nextId, onGameOver, score]);

  // рендер
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
          borderRadius: 16,
          border: "1px solid #333",
          background: "linear-gradient(180deg, #020617 0%, #000 100%)",
          position: "relative",
          overflow: "hidden",
          padding: 8,
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            fontSize: 14,
            marginBottom: 4,
            color: "#e5e7eb",
          }}
        >
          Слой: {blocks.length - 1} / {MAX_LEVELS} | Счёт: {score}
          {isOver && <span style={{ marginLeft: 8, color: "#f97316" }}>Конец игры</span>}
        </div>

        {/* поле с башней */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: FIELD_HEIGHT - 40,
          }}
        >
          {/* поставленные блоки */}
          {blocks.map((b) => {
            const bottomPadding = 8;
            const bottom = bottomPadding + b.level * BLOCK_HEIGHT;
            return (
              <div
                key={b.id}
                style={{
                  position: "absolute",
                  left: b.x,
                  bottom,
                  width: b.width,
                  height: BLOCK_HEIGHT - 2,
                  borderRadius: 8,
                  background: "linear-gradient(90deg, #22c55e, #16a34a)",
                  boxShadow: "0 0 10px rgba(34,197,94,0.6)",
                }}
              />
            );
          })}

          {/* движущийся блок */}
          {!isOver && (
            <div
              style={{
                position: "absolute",
                left: movingX,
                bottom: 8 + level * BLOCK_HEIGHT,
                width: movingWidth,
                height: BLOCK_HEIGHT - 2,
                borderRadius: 8,
                background: "linear-gradient(90deg, #38bdf8, #0ea5e9)",
                boxShadow: "0 0 10px rgba(56,189,248,0.7)",
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
