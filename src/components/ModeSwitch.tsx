import { Mode } from "@/types";

type Props = {
  mode: Mode;
  setMode: (mode: Mode) => void;
};

export default function ModeSwitch({ mode, setMode }: Props) {
  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      <button
        onClick={() => setMode("live")}
        className={`rounded-2xl px-4 py-4 font-semibold ${
          mode === "live" ? "bg-green-600" : "bg-zinc-900"
        }`}
      >
        Live Jam
      </button>

      <button
        onClick={() => setMode("sequencer")}
        className={`rounded-2xl px-4 py-4 font-semibold ${
          mode === "sequencer" ? "bg-blue-600" : "bg-zinc-900"
        }`}
      >
        Progression
      </button>

      <button
        onClick={() => setMode("karaoke")}
        className={`rounded-2xl px-4 py-4 font-semibold ${
          mode === "karaoke" ? "bg-purple-600" : "bg-zinc-900"
        }`}
      >
        Karaoke
      </button>
    </div>
  );
}
