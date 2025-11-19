import { useEffect, useState } from "react";
import type { GameProps } from "../core/types";

type Card = {
  id: number;
  value: string;
  isOpen: boolean;
  isMatched: boolean;
};

const VALUES = ["◆", "●", "★"]; // 3 пары

const createDeck = (): Card[] => {
  let id = 0;
  const cards: Card[] = [];
  VALUES.forEach((v) => {
    cards.push({ id: id++, value: v, isOpen: false, isMatched: false });
    cards.push({ id: id++, value: v, isOpen: false, isMatched: false });
  });

  // перемешиваем
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }

  return cards;
};

export const MemoryFlip: React.FC<GameProps> = ({ onGameOver }) => {
  const [cards, setCards] = useState<Card[]>(() => createDeck());
  const [openedIds, setOpenedIds] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [finished, setFinished] = useState(false);
  const [locking, setLocking] = useState(false);

  const handleCardClick = (id: number) => {
    if (finished || locking) return;

    setCards((prev) => {
      const card = prev.find((c) => c.id === id);
      if (!card || card.isMatched || card.isOpen) return prev;

      return prev.map((c) =>
        c.id === id ? { ...c, isOpen: true } : c
      );
    });

    setOpenedIds((prev) => {
      if (prev.length === 0) return [id];
      if (prev.length === 1 && prev[0] !== id) return [prev[0], id];
      return prev;
    });
  };

  // когда открыто 2 карты – проверяем пару
  useEffect(() => {
    if (openedIds.length !== 2) return;

    setMoves((m) => m + 1);
    setLocking(true);

    const [firstId, secondId] = openedIds;
    const first = cards.find((c) => c.id === firstId);
    const second = cards.find((c) => c.id === secondId);

    if (!first || !second) {
      setOpenedIds([]);
      setLocking(false);
      return;
    }

    if (first.value === second.value) {
      // совпадение
      setCards((prev) =>
        prev.map((c) =>
          c.id === firstId || c.id === secondId ? { ...c, isMatched: true } : c
        )
      );
      setOpenedIds([]);
      setLocking(false);
    } else {
      // не совпали – закроем через паузу
      const timer = setTimeout(() => {
        setCards((prev) =>
          prev.map((c) =>
            c.id === firstId || c.id === secondId ? { ...c, isOpen: false } : c
          )
        );
        setOpenedIds([]);
        setLocking(false);
      }, 700);

      return () => clearTimeout(timer);
    }
  }, [openedIds, cards]);

  // проверяем завершение игры
  useEffect(() => {
    if (finished) return;
    const allMatched = cards.every((c) => c.isMatched);
    if (allMatched) {
      setFinished(true);
      // чем меньше ходов, тем больше счёт
      const score = Math.max(1, 100 - moves * 10);
      onGameOver(score);
    }
  }, [cards, finished, moves, onGameOver]);

  const handleRestart = () => {
    setCards(createDeck());
    setOpenedIds([]);
    setMoves(0);
    setFinished(false);
    setLocking(false);
  };

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
          Ходы: {moves}
          {finished && <span style={{ marginLeft: 8, color: "#22c55e" }}>Готово!</span>}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 8,
          }}
        >
          {cards.map((card) => {
            const show = card.isOpen || card.isMatched;
            return (
              <button
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                style={{
                  height: 60,
                  borderRadius: 10,
                  border: "1px solid #4b5563",
                  background: show ? "#111827" : "#020617",
                  color: show ? "#e5e7eb" : "#6b7280",
                  fontSize: 24,
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                {show ? card.value : "?"}
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
              Сыграть ещё раз
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
