"use client";

import ChordTile from "./ChordTile";
import { chords } from "@/data/chords";

type Props = {
  onAdd: (chord: string) => void;
};

export default function ChordGrid({ onAdd }: Props) {
  return (
    <div
      className="
        grid grid-cols-3 sm:grid-cols-4
        md:grid-cols-5 lg:grid-cols-6
        gap-3
      "
    >
      {chords.map((chord) => (
        <ChordTile key={chord} name={chord} onAdd={onAdd} />
      ))}
    </div>
  );
}
