import { QueueItem } from "@/types";

type LyricLine = {
  chord: string;
  text: string;
};

type SongPreset = {
  bpm: number;
  queue: QueueItem[];
  lyrics: LyricLine[];
};

export const songs: Record<string, SongPreset> = {
  "Tum Hi Ho": {
    bpm: 78,
    queue: [
      { chord: "Am", beats: 4 },
      { chord: "F", beats: 4 },
      { chord: "C", beats: 4 },
      { chord: "G", beats: 4 },
    ],
    lyrics: [
      { chord: "Am", text: "Hum tere bin..." },
      { chord: "F", text: "Ab reh nahi..." },
      { chord: "C", text: "Sakte tere..." },
      { chord: "G", text: "Bina kya wajood..." },
    ],
  },

  Kesariya: {
    bpm: 92,
    queue: [
      { chord: "C", beats: 4 },
      { chord: "G", beats: 4 },
      { chord: "Am", beats: 4 },
      { chord: "F", beats: 4 },
    ],
    lyrics: [
      { chord: "C", text: "Kesariya..." },
      { chord: "G", text: "Tera ishq hai..." },
      { chord: "Am", text: "Piya..." },
      { chord: "F", text: "Rang jaaun..." },
    ],
  },

  Kabira: {
    bpm: 88,
    queue: [
      { chord: "D", beats: 4 },
      { chord: "A", beats: 4 },
      { chord: "Bm", beats: 4 },
      { chord: "G", beats: 4 },
    ],
    lyrics: [
      { chord: "D", text: "Kaisi teri..." },
      { chord: "A", text: "Khudgarzi..." },
      { chord: "Bm", text: "Na dhoop..." },
      { chord: "G", text: "Chune na..." },
    ],
  },

  ChannaMereya: {
    bpm: 84,
    queue: [
      { chord: "G", beats: 4 },
      { chord: "D", beats: 4 },
      { chord: "Em", beats: 4 },
      { chord: "C", beats: 4 },
    ],
    lyrics: [
      { chord: "G", text: "Accha chalta hoon..." },
      { chord: "D", text: "Duaon mein..." },
      { chord: "Em", text: "Yaad rakhna..." },
      { chord: "C", text: "Mere zikr ka..." },
    ],
  },

  Perfect: {
    bpm: 95,
    queue: [
      { chord: "G", beats: 4 },
      { chord: "Em", beats: 4 },
      { chord: "C", beats: 4 },
      { chord: "D", beats: 4 },
    ],
    lyrics: [
      { chord: "G", text: "I found a love..." },
      { chord: "Em", text: "For me..." },
      { chord: "C", text: "Darling just dive..." },
      { chord: "D", text: "Right in..." },
    ],
  },

  Photograph: {
    bpm: 108,
    queue: [
      { chord: "E", beats: 4 },
      { chord: "B", beats: 4 },
      { chord: "C#m", beats: 4 },
      { chord: "A", beats: 4 },
    ],
    lyrics: [
      { chord: "E", text: "Loving can hurt..." },
      { chord: "B", text: "Loving can heal..." },
      { chord: "C#m", text: "It is the only..." },
      { chord: "A", text: "Thing I know..." },
    ],
  },

  LetHerGo: {
    bpm: 76,
    queue: [
      { chord: "C", beats: 4 },
      { chord: "G", beats: 4 },
      { chord: "Am", beats: 4 },
      { chord: "F", beats: 4 },
    ],
    lyrics: [
      { chord: "C", text: "Well you only..." },
      { chord: "G", text: "Need the light..." },
      { chord: "Am", text: "When it's burning..." },
      { chord: "F", text: "Low..." },
    ],
  },

  StayWithMe: {
    bpm: 84,
    queue: [
      { chord: "A", beats: 4 },
      { chord: "F#m", beats: 4 },
      { chord: "D", beats: 4 },
      { chord: "E", beats: 4 },
    ],
    lyrics: [
      { chord: "A", text: "Guess it's true..." },
      { chord: "F#m", text: "I'm not good..." },
      { chord: "D", text: "At a one night..." },
      { chord: "E", text: "Stand..." },
    ],
  },
};
