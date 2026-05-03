export type Mode = "live" | "sequencer";

export type GrooveType =
  | "none"
  | "pop"
  | "lofi"
  | "trap"
  | "rock"
  | "funk"
  | "afro"
  | "house"
  | "click";

export type QueueItem = {
  chord: string;
  beats: number;
};
