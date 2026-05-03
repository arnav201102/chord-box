import { songs } from "@/data/songs";
import { QueueItem } from "@/types";

type Props = {
  setQueue: (items: QueueItem[]) => void;
};

export default function SongPresets({ setQueue }: Props) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-3">Popular Songs</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Object.keys(songs).map((name) => (
          <button
            key={name}
            onClick={() => setQueue(songs[name] as unknown as QueueItem[])}
            className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 hover:bg-zinc-800 text-sm"
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}
