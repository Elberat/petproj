# TikTok Mini Games – spec.md

## 1. Цель проекта

Сделать фронтенд-демо «TikTok для мини-игр»:

- вертикальная лента, каждый экран = одна мини-игра;
- фокус на **мобильном UX** (управление кнопками на экране, touch-события);
- 10 простых игр, каждая длится ~10–30 секунд;
- без бэкенда, всё состояние — в памяти и `localStorage`.

Цель — показать концепт и возможность быстро переключаться между мини-играми свайпом (scroll) как в TikTok.

---

## 2. Технологический стек

- **Vite + React + TypeScript**
- CSS без фреймворков (inline styles / CSS-модули / простые классы).
- Без Redux и сложных стейт-менеджеров, достаточно `useState` / `useEffect`.

---

## 3. Общие требования

1. **Мобильный first дизайн**
   - Высота экрана = `100vh`, всё внутри одной «страницы».
   - Основной таргет: мобильный браузер (Chrome/Safari).

2. **Управление только с экрана**
   - Никаких обязательных WASD/стрелок с клавиатуры.
   - Для каждой игры используется блок кнопок внизу экрана.
   - Клавиатура может поддерживаться дополнительно, но не обязательно.

3. **Лента игр**
   - Вертикальный скролл, каждая игра занимает 100% высоты.
   - Использовать `scroll-snap` для эффекта «щёлкающих» экранов.
   - Переключение между играми — скроллом/свайпом.

4. **Отсутствие бэка**
   - Нет API, нет auth.
   - Рекорды игр сохраняются в `localStorage` по ключу `best_<gameId>`.

5. **Чистая архитектура**
   - Единый интерфейс для всех игр.
   - Общий контейнер `GameWrapper` (заголовок, рекорды, управление).
   - Общий компонент `ControlsPad` (кнопки управления).

---

## 4. Структура проекта


src/
  core/
    types.ts          // типы игр и управления
    GameFeed.tsx      // лента (vertical feed)
    GameWrapper.tsx   // обёртка над игрой + рекорды + управление
    ControlsPad.tsx   // блок кнопок управления
    gamesRegistry.tsx // список/метаданные всех игр
  games/
    SnakeGame.tsx
    FlappyDot.tsx
    ClickTheCircle.tsx
    ReactionTime.tsx
    DodgeBlocks.tsx
    StackTower.tsx
    MemoryFlip.tsx
    AimTrainer.tsx
    ColorMatch.tsx
    NumberRush.tsx
  App.tsx
  main.tsx
  styles.css          // базовые стили (если нужно)

## 5. Типы и интерфейсы
### 5.1. Управление

// src/core/types.ts
export type ControlId =
  | "up"
  | "down"
  | "left"
  | "right"
  | "action"
  | "tap";
Можно добавлять новые значения по необходимости, но сначала достаточно этих.

### 5.2. Пропсы игры

export type GameProps = {
  onGameOver: (score: number) => void;
  lastControl: ControlId | null;
};
onGameOver(score) — вызвать, когда игра завершена (по смерти, по времени, по прохождению).

lastControl — последняя нажатая кнопка управления (из ControlsPad).

Каждая игра обязана реализовывать компонент вида:


export const SomeGame: React.FC<GameProps> = ({ onGameOver, lastControl }) => {
  // ...
};

### 5.3. Метаданные игры

export type GameMeta = {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType<GameProps>;
  controls: ControlId[];
};

## 6. Реестр игр
// src/core/gamesRegistry.tsx
import type { GameMeta } from "./types";
import { SnakeGame } from "../games/SnakeGame";
import { FlappyDot } from "../games/FlappyDot";
import { ClickTheCircle } from "../games/ClickTheCircle";
import { ReactionTime } from "../games/ReactionTime";
import { DodgeBlocks } from "../games/DodgeBlocks";
import { StackTower } from "../games/StackTower";
import { MemoryFlip } from "../games/MemoryFlip";
import { AimTrainer } from "../games/AimTrainer";
import { ColorMatch } from "../games/ColorMatch";
import { NumberRush } from "../games/NumberRush";

export const games: GameMeta[] = [
  {
    id: "snake",
    title: "Micro Snake",
    description: "Классика: управляем змейкой на маленьком поле.",
    component: SnakeGame,
    controls: ["up", "down", "left", "right"],
  },
  {
    id: "flappy",
    title: "Flappy Dot",
    description: "Прыгайте точкой между препятствиями.",
    component: FlappyDot,
    controls: ["tap"],
  },
  {
    id: "click-circle",
    title: "Click the Circle",
    description: "Успевай нажимать на круг, пока он двигается.",
    component: ClickTheCircle,
    controls: ["tap"],
  },
  {
    id: "reaction",
    title: "Reaction Time",
    description: "Нажми как можно быстрее, когда экран станет зелёным.",
    component: ReactionTime,
    controls: ["tap"],
  },
  {
    id: "dodge-blocks",
    title: "Dodge Blocks",
    description: "Уклоняйся от падающих блоков.",
    component: DodgeBlocks,
    controls: ["left", "right"],
  },
  {
    id: "stack-tower",
    title: "Stack Tower",
    description: "Останавливай блоки ровно над предыдущими.",
    component: StackTower,
    controls: ["action"],
  },
  {
    id: "memory-flip",
    title: "Memory Flip",
    description: "Запомни расположение парных карточек.",
    component: MemoryFlip,
    controls: ["tap"],
  },
  {
    id: "aim-trainer",
    title: "Aim Trainer",
    description: "Кликай по мишеням как можно быстрее.",
    component: AimTrainer,
    controls: ["tap"],
  },
  {
    id: "color-match",
    title: "Color Match",
    description: "Совпадает ли цвет текста с его значением?",
    component: ColorMatch,
    controls: ["left", "right"], // left = "нет", right = "да"
  },
  {
    id: "number-rush",
    title: "Number Rush",
    description: "Нажми числа по порядку как можно быстрее.",
    component: NumberRush,
    controls: ["tap"],
  },
];

## 7. Лента игр (GameFeed)
Цель
Отображать все игры одну за другой вертикальным скроллом, каждая — на весь экран.

Реализация
// src/core/GameFeed.tsx
import { games } from "./gamesRegistry";
import { GameWrapper } from "./GameWrapper";

export const GameFeed = () => {
  return (
    <div
      style={{
        height: "100vh",
        overflowY: "scroll",
        scrollSnapType: "y mandatory",
        background: "#050816",
        color: "#fff",
      }}
    >
      {games.map((game) => (
        <section
          key={game.id}
          style={{
            height: "100vh",
            scrollSnapAlign: "start",
            display: "flex",
            justifyContent: "center",
            alignItems: "stretch",
          }}
        >
          <GameWrapper game={game} />
        </section>
      ))}
    </div>
  );
};

### 8. Обертка игры (GameWrapper)
Задачи
Отображать:
заголовок и описание игры,
рекорд и последний результат,
саму игру в отдельном контейнере,
блок управления (ControlsPad),
кнопку «Играть ещё раз».
Поддерживать:
перезапуск игры через смену key,
сохранение рекорда в localStorage,
передачу lastControl в компонент игры.
Реализация
(можно использовать уже написанную в предыдущем сообщении версию — Cursor должен её создать/дополнить):
Файл: src/core/GameWrapper.tsx.
Принимает проп game: GameMeta.

### 9. Блок управления (ControlsPad)
Задачи
Отрисовывать разные наборы кнопок в зависимости от controls: ControlId[] игры.
Работать хорошо на мобильных:
использовать onTouchStart для отправки событий,
для десктопа можно дублировать onMouseDown.
Две основные конфигурации:
Одна большая кнопка (["tap"] или ["action"]).
D-pad (["up", "down", "left", "right"]) или упрощённый (["left", "right"]).
Интерфейс

type ControlsPadProps = {
  controls: ControlId[];
  onPress: (control: ControlId) => void;
};
Компонент должен вызывать onPress(control) при нажатии кнопки.

#### 10. Игры
Общие требования ко всем играм
Все игры используют только:
DOM, div/button/span,
либо канвас (<canvas>) по желанию.
Все игры обязаны:
принимать GameProps,
не знать ничего про localStorage,
вызывать onGameOver(score) при завершении.
Далее краткие описания 10 игр (реализация внутри соответствующих файлов в src/games).

### 10.1 Micro Snake (SnakeGame.tsx)
Поле 10x10 (можно через CSS Grid).
Управление: up/down/left/right (игнорировать разворот на 180°).
Раз в N миллисекунд змея двигается.
Яблоко в случайной клетке.
Столкновение со стеной/собой → onGameOver(score), где score = длина змейки - 1.

### 10.2 Flappy Dot (FlappyDot.tsx)
Маленький «птичка-кружок».
Управление: tap = прыжок вверх (уменьшаем y).
Препятствия движутся слева направо или справа налево.
Столкновение или падение ниже/выше поля → onGameOver(score) по количеству пройденных «щелей».

### 10.3 Click the Circle (ClickTheCircle.tsx)
Уже есть пример кода, Cursor может перенести.
15 секунд, кружок появляется в рандомной позиции.
tap или клик прямо по кружку → score++.
Таймер = 0 → onGameOver(score).

### 10.4 Reaction Time (ReactionTime.tsx)
Состояния: «Жди…» → рандомная задержка → «ЖМИ!».
tap до сигнала = фейл (score=0, но можно показать текст).
tap после сигнала = измерить разницу в мс.
onGameOver(score), где score =, например, max(0, 1000 - delay).

### 10.5 Dodge Blocks (DodgeBlocks.tsx)
Игрок внизу (3 колонки: 0, 1, 2).
Управление: left/right (ограничивать по границам).
Сверху падают блоки по рандомным колонкам, двигаются вниз дискретно.
Столкновение → onGameOver(score), где score = число успешно пролетевших блоков.

### 10.6 Stack Tower (StackTower.tsx)
Внизу фиксированный блок.
Сверху по горизонтали ездит блок.
action останавливает блок, отрезаем выступающие части.
С каждым уровнем ширина уменьшается, скорость может расти.
После N уровней или если ширина стала 0 → onGameOver(score).

### 10.7 Memory Flip (MemoryFlip.tsx)
Поле из 6–8 карточек (3–4 пары).
На tap по карточке — переворот.
Логика: 2 открытые → сравнить → если разные, через паузу закрыть.
Игра заканчивается, когда все пары найдены.
onGameOver(score), где score можно считать по количеству ходов/времени.

### 10.8 Aim Trainer (AimTrainer.tsx)
Мишени появляются на ограниченной области.
tap по мишени → score++.
Таймер, например 20 секунд.
onGameOver(score) по истечении времени.

### 10.9 Color Match (ColorMatch.tsx)
Показывается слово (Красный/Синий/Зелёный/Жёлтый и т.п.).
Цвет текста может совпадать или не совпадать.
Управление: left = «не совпадает», right = «совпадает».
За правильный ответ — score++, за неправильный — можно закончить игру или просто не увеличивать.
Время/количество раундов ограничено.

### 10.10 Number Rush (NumberRush.tsx)
На поле отображаются числа 1..N в случайном порядке.
tap по числу:
если это следующее по порядку → подсвечиваем его как пройденный;
если нет — можно игнорировать или штрафовать.
Засекаем время от нажатия 1 до последнего числа.
onGameOver(score), где score =, например, max(0, 10000 - timeMs).

## 11. App и main
// src/App.tsx
import { GameFeed } from "./core/GameFeed";

export const App = () => {
  return <GameFeed />;
};
// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

## 12. Базовые стили (styles.css)
Минимум:
Сброс отступов у body.
Установка height: 100vh и фона.

* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
}

body {
  background: #050816;
  color: #fff;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

#root {
  height: 100%;
}

## 13. Acceptance criteria / Definition of Done
Проект стартует командой npm run dev (или pnpm run dev) и открывается в браузере.
На экране видна вертикальная лента из 10 игр.
Каждый экран занимает 100% высоты, при скролле срабатывает scroll-snap.
В каждой игре:
виден заголовок и описание;
есть блок игры;
есть блок управления (кнопки) под игрой;
есть кнопка «Играть ещё раз».
Управление работает на мобильном (через touch) во всех играх.
Результат игры отображается в Последний, рекорд — в Рекорд, хранится в localStorage.
В коде нет зависимости от бэкенда; нет неиспользуемых импортов и явных ошибок TypeScript.