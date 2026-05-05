import { QueueItem, SongPreset } from "@/types";

export const songs: Record<string, SongPreset> = {
  "Tum Hi Ho": {
    bpm: 94,
    audioSrc: "/tum-hi-ho-karaoke-from-aashiqui-2.mp3",
    introSeconds: 10,
    key: "Em",
    camelot: "4A",
    duration: "4:22",
    queue: [
      { chord: "Em", beats: 4 },
      { chord: "C", beats: 4 },
      { chord: "D", beats: 4 },
      { chord: "Bm", beats: 4 },
      { chord: "C", beats: 4 },
      { chord: "Em", beats: 4 },
      { chord: "C", beats: 4 },
      { chord: "D", beats: 4 },
      { chord: "Bm", beats: 4 },
      { chord: "C", beats: 4 },
      { chord: "Em", beats: 4 },
      { chord: "C", beats: 4 },
      { chord: "D", beats: 4 },
      { chord: "Bm", beats: 4 },
      { chord: "C", beats: 4 },
      { chord: "Em", beats: 4 },
      { chord: "Am", beats: 4 },
      { chord: "D", beats: 4 },
      { chord: "Bm", beats: 4 },
      { chord: "C", beats: 4 },
      { chord: "Em", beats: 4 },
      { chord: "Am", beats: 4 },
      { chord: "D", beats: 4 },
      { chord: "Bm", beats: 4 },
      { chord: "C", beats: 4 },
      { chord: "D", beats: 4 },
      { chord: "G", beats: 4 },
      { chord: "B7", beats: 4 },
      { chord: "C", beats: 4 },
      { chord: "D", beats: 4 },
      { chord: "Em", beats: 4 },
      { chord: "Bm", beats: 4 },
      { chord: "Am", beats: 4 },
      { chord: "Em", beats: 4 },
      { chord: "C", beats: 4 },
      { chord: "Em", beats: 4 },
      { chord: "C", beats: 4 },
      { chord: "D", beats: 4 },
      { chord: "Em", beats: 4 },
      { chord: "C", beats: 4 },
      { chord: "Bm", beats: 4 },
      { chord: "C", beats: 4 },
      { chord: "Bm", beats: 4 },
      { chord: "Am", beats: 4 },
      { chord: "Em", beats: 4 },
      { chord: "Am", beats: 4 },
      { chord: "Em", beats: 4 },
      { chord: "D", beats: 4 },
      { chord: "G", beats: 4 },
      { chord: "B7", beats: 4 },
      { chord: "C", beats: 4 },
      { chord: "D", beats: 4 },
      { chord: "Em", beats: 4 },
      { chord: "Am", beats: 4 },
      { chord: "D", beats: 4 },
      { chord: "Bm", beats: 4 },
      { chord: "C", beats: 4 },
      { chord: "Em", beats: 4 },
      { chord: "Am", beats: 4 },
      { chord: "D", beats: 4 },
      { chord: "Bm", beats: 4 },
      { chord: "C", beats: 4 },
    ],
    sections: [
      {
        type: "verse",
        id: "verse_1",
        lines: [
          {
            chords: [
              { chord: "Em", beats: 2 },
              { chord: "C", beats: 2 },
            ],
            lyrics: "Hum tere bin ab reh nahi sakte",
          },
          {
            chords: [
              { chord: "D", beats: 1 },
              { chord: "Bm", beats: 1 },
              { chord: "C", beats: 2 },
            ],
            lyrics: "Tere bina kya wajood mera",
          },
          {
            chords: [
              { chord: "Em", beats: 2 },
              { chord: "C", beats: 2 },
            ],
            lyrics: "Hum tere bin ab reh nahi sakte",
          },
          {
            chords: [
              { chord: "D", beats: 1 },
              { chord: "Bm", beats: 1 },
              { chord: "C", beats: 2 },
            ],
            lyrics: "Tere bina kya wajood mera",
          },
          {
            chords: [
              { chord: "Em", beats: 2 },
              { chord: "C", beats: 2 },
            ],
            lyrics: "Tujhse juda gar ho jaayenge",
          },
          {
            chords: [
              { chord: "D", beats: 1 },
              { chord: "Bm", beats: 1 },
              { chord: "C", beats: 2 },
            ],
            lyrics: "Toh khud se hi ho jaayenge judaa",
          },
        ],
      },
      {
        type: "chorus",
        id: "chorus_1",
        lines: [
          {
            chords: [{ chord: "Em", beats: 4 }],
            lyrics: "Kyunki tum hi ho",
          },
          {
            chords: [{ chord: "Am", beats: 4 }],
            lyrics: "Ab tum hi ho",
          },
          {
            chords: [
              { chord: "D", beats: 1 },
              { chord: "Bm", beats: 1 },
              { chord: "C", beats: 2 },
            ],
            lyrics: "Zindagi ab tum hi ho",
          },
          {
            chords: [
              { chord: "Em", beats: 2 },
              { chord: "Am", beats: 2 },
            ],
            lyrics: "Chain bhi, mera dard bhi",
          },
          {
            chords: [
              { chord: "D", beats: 1 },
              { chord: "Bm", beats: 1 },
              { chord: "C", beats: 2 },
            ],
            lyrics: "Meri aashiqui ab tum hi ho",
          },
        ],
      },
      {
        type: "instrumental",
        id: "instrumental_1",
        progression: ["Em", "Bm", "Am", "Em"],
        repeat: 2,
      },
      {
        type: "verse",
        id: "verse_2",
        lines: [
          {
            chords: [
              { chord: "Em", beats: 2 },
              { chord: "C", beats: 2 },
            ],
            lyrics: "Tera mera rishta hai kaisa",
          },
          {
            chords: [
              { chord: "D", beats: 1 },
              { chord: "Bm", beats: 1 },
              { chord: "C", beats: 2 },
            ],
            lyrics: "Ik pal door gawara nahi",
          },
          {
            chords: [
              { chord: "Em", beats: 2 },
              { chord: "C", beats: 2 },
            ],
            lyrics: "Tere liye har roz hai jeete",
          },
          {
            chords: [
              { chord: "D", beats: 1 },
              { chord: "Bm", beats: 1 },
              { chord: "C", beats: 2 },
            ],
            lyrics: "Tujh ko diya mera waqt sabhi",
          },
          {
            chords: [
              { chord: "D", beats: 2 },
              { chord: "G", beats: 2 },
            ],
            lyrics: "Koi lamha mera na ho tere bina",
          },
          {
            chords: [
              { chord: "B7", beats: 1 },
              { chord: "C", beats: 1 },
              { chord: "D", beats: 2 },
            ],
            lyrics: "Har saans pe naam tera",
          },
        ],
      },
      {
        type: "chorus",
        id: "chorus_2",
        ref: "chorus_1",
      },
      {
        type: "bridge",
        id: "bridge_1",
        parts: [
          {
            progression: ["Em", "Bm", "Am", "Em"],
          },
          {
            chords: [
              { chord: "C", beats: 2 },
              { chord: "Em", beats: 2 },
            ],
            lyrics: "Tumhi ho",
          },
          {
            chords: [
              { chord: "C", beats: 0.5 },
              { chord: "Em", beats: 0.5 },
              { chord: "C", beats: 0.5 },
              { chord: "D", beats: 0.5 },
              { chord: "Em", beats: 2 },
            ],
            lyrics: "Tumhi ho",
          },
        ],
      },
      {
        type: "verse",
        id: "verse_3",
        lines: [
          {
            chords: [
              { chord: "C", beats: 2 },
              { chord: "Bm", beats: 2 },
            ],
            lyrics: "Tere liye hi jiya main",
          },
          {
            chords: [
              { chord: "C", beats: 2 },
              { chord: "Bm", beats: 2 },
            ],
            lyrics: "Khud ko jo yun de diya hai",
          },
          {
            chords: [
              { chord: "Am", beats: 2 },
              { chord: "Em", beats: 2 },
            ],
            lyrics: "Teri wafa ne mujhko sambhala",
          },
          {
            chords: [
              { chord: "Am", beats: 2 },
              { chord: "Em", beats: 2 },
            ],
            lyrics: "Saare ghamon ko dil se nikala",
          },
          {
            chords: [
              { chord: "D", beats: 2 },
              { chord: "G", beats: 2 },
            ],
            lyrics: "Tere saath mera hai naseeb juda",
          },
          {
            chords: [
              { chord: "B7", beats: 1 },
              { chord: "C", beats: 1 },
              { chord: "D", beats: 2 },
            ],
            lyrics: "Tujhe paake adhoora naa raha",
          },
        ],
      },
      {
        type: "chorus",
        id: "chorus_3",
        ref: "chorus_1",
        repeat: 2,
      },
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
