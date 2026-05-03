"use client";

import { useState } from "react";
import { chords } from "@/data/chords";
import { chordNotes } from "@/data/chordNotes";
import {
  startAudio,
  playLiveChord,
  stopLiveChord,
} from "@/lib/audio";

export default function LiveJam() {
  const [active, setActive] =
    useState<string | null>(null);

  const chooseChord =
    async (
      chord: string
    ) => {
      await startAudio();

      const notes =
        chordNotes[chord];

      if (!notes) return;

      playLiveChord(
        notes
      );

      setActive(chord);
    };

  return (
    <div>
      <div className="mb-4 flex gap-3">
        <button
          onClick={() => {
            stopLiveChord();
            setActive(null);
          }}
          className="bg-red-600 px-4 py-3 rounded-xl"
        >
          Stop
        </button>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {chords.map(
          (chord) => (
            <button
              key={chord}
              onClick={() =>
                chooseChord(
                  chord
                )
              }
              className={`rounded-2xl px-4 py-5 font-semibold ${
                active ===
                chord
                  ? "bg-green-600"
                  : "bg-zinc-900"
              }`}
            >
              {chord}
            </button>
          )
        )}
      </div>
    </div>
  );
}