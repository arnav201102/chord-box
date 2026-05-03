"use client";

type Props = {
  name: string;
  onAdd: (chord: string) => void;
};

export default function ChordTile({ name, onAdd }: Props) {
  return (
    <button
      onClick={() => onAdd(name)}
      className="
        w-full rounded-2xl
        bg-zinc-900 border border-zinc-800
        hover:bg-zinc-800
        active:scale-95
        transition
        px-4 py-5
        text-base md:text-lg
        font-semibold
        min-h-[64px]
      "
    >
      {name}
    </button>
  );
}
