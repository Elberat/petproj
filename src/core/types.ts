export type ControlId =
  | "up"
  | "down"
  | "left"
  | "right"
  | "action"
  | "tap";

export type GameProps = {
  onGameOver: (score: number) => void;
  lastControl: ControlId | null;
};

export type GameMeta = {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType<GameProps>;
  controls: ControlId[];
};

