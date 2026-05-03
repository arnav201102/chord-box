import { QueueItem } from "@/types";

export const presets: Record<string, QueueItem[]> = {
  "Pop Hit": [
    { chord: "C", beats: 4 },
    { chord: "G", beats: 4 },
    { chord: "Am", beats: 4 },
    { chord: "F", beats: 4 },
  ],

  "Sad Vibe": [
    { chord: "Am", beats: 4 },
    { chord: "F", beats: 4 },
    { chord: "C", beats: 4 },
    { chord: "G", beats: 4 },
  ],

  "Lo-fi": [
    { chord: "Cmaj7", beats: 4 },
    { chord: "Am7", beats: 4 },
    { chord: "Dm7", beats: 4 },
    { chord: "G7", beats: 4 },
  ],

  Rock: [
    { chord: "Em", beats: 4 },
    { chord: "C", beats: 4 },
    { chord: "G", beats: 4 },
    { chord: "D", beats: 4 },
  ],
};
