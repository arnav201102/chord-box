"use client";

import { useState } from "react";
import ChordTile from "./ChordTile";
import { chords } from "@/data/chords";

type Props = {
  onAdd: (chord: string) => void;
};

export default function ChordGrid({ onAdd }: Props) {
  const [chordType, setChordType] = useState<"english" | "hindi">("english");

  const currentChords = chords[chordType];

  return (
    <div>
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setChordType("english")}
          className={`px-4 py-2 rounded-xl ${
            chordType === "english" ? "bg-green-600" : "bg-zinc-700"
          }`}
        >
          English
        </button>
        <button
          onClick={() => setChordType("hindi")}
          className={`px-4 py-2 rounded-xl ${
            chordType === "hindi" ? "bg-green-600" : "bg-zinc-700"
          }`}
        >
          Hindi
        </button>
      </div>

      <div
        className="
          grid grid-cols-3 sm:grid-cols-4
          md:grid-cols-5 lg:grid-cols-6
          gap-3
        "
      >
        {currentChords.map((chord) => (
          <ChordTile key={chord} name={chord} onAdd={onAdd} />
        ))}
      </div>
    </div>
  );
}
