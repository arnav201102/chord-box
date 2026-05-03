import { QueueItem } from "@/types";

type Props = {
  queue: QueueItem[];
  activeIndex: number | null;

  previewChord: (chord: string) => void;

  moveUp: (i: number) => void;

  moveDown: (i: number) => void;

  changeBeats: (i: number, delta: number) => void;

  removeChord: (i: number) => void;
};

export default function QueueList({
  queue,
  activeIndex,
  previewChord,
  moveUp,
  moveDown,
  changeBeats,
  removeChord,
}: Props) {
  return (
    <div className="space-y-3 mb-8">
      {queue.map((item, i) => (
        <div
          key={i}
          className={`rounded-2xl border p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 ${
            activeIndex === i
              ? "bg-green-700 border-green-500"
              : "bg-zinc-950 border-zinc-800"
          }`}
        >
          <button
            onClick={() => previewChord(item.chord)}
            className="text-xl font-bold text-left"
          >
            {item.chord}
          </button>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => moveUp(i)}
              className="px-3 py-2 bg-zinc-800 rounded-xl"
            >
              ↑
            </button>

            <button
              onClick={() => moveDown(i)}
              className="px-3 py-2 bg-zinc-800 rounded-xl"
            >
              ↓
            </button>

            <button
              onClick={() => changeBeats(i, -1)}
              className="px-3 py-2 bg-zinc-800 rounded-xl"
            >
              -
            </button>

            <div className="px-3 py-2 bg-zinc-900 rounded-xl">
              {item.beats} beats
            </div>

            <button
              onClick={() => changeBeats(i, 1)}
              className="px-3 py-2 bg-zinc-800 rounded-xl"
            >
              +
            </button>

            <button
              onClick={() => removeChord(i)}
              className="px-3 py-2 bg-red-700 rounded-xl"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
