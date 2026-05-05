import { GrooveType, QueueItem, InstrumentType } from "@/types";

type SavedState = {
  queue: QueueItem[];
  bpm: number;
  loop: boolean;
  groove: GrooveType;
  instrument: InstrumentType;
};

const KEY = "jam-chord-app-v1";

export function saveState(data: SavedState) {
  if (typeof window === "undefined") return;

  localStorage.setItem(KEY, JSON.stringify(data));
}

export function loadState(): SavedState | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(KEY);

  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
