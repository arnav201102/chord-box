export type Mode = "live" | "sequencer" | "karaoke";

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
  beats?: number;
  duration?: number;
};

export type LyricLine = {
  chord: string;
  text: string;
  beats?: number;
  duration?: number;
  startTime?: number;
};

export type SectionType = "verse" | "chorus" | "instrumental" | "bridge";

export type SongLine = {
  chords: { chord: string; beats?: number; duration?: number }[];
  lyrics: string;
};

export type InstrumentalPart = {
  progression: string[];
  repeat?: number;
};

export type Section = {
  type: SectionType;
  id: string;
  lines?: SongLine[];
  progression?: string[];
  repeat?: number;
  ref?: string;
  parts?: (
    | InstrumentalPart
    | {
        chords: { chord: string; beats?: number; duration?: number }[];
        lyrics: string;
      }
  )[];
};

export type SongPreset = {
  bpm: number;
  queue?: QueueItem[];
  lyrics?: LyricLine[];
  sections?: Section[];
  audioSrc?: string;
  introSeconds?: number;
  gapSeconds?: number;
  key?: string;
  camelot?: string;
  duration?: string;
};

export type InstrumentType = "strings" | "guitar" | "piano";
