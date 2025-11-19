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
    controls: [],
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
    controls: [],
  },
  {
    id: "aim-trainer",
    title: "Aim Trainer",
    description: "Кликай по мишеням как можно быстрее.",
    component: AimTrainer,
    controls: [],
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
    controls: [],
  },
];

