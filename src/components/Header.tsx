type Props = {
  onShowHelp: () => void;
};

export default function Header({ onShowHelp }: Props) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h1 className="text-3xl md:text-5xl font-bold">Jam Chord Box</h1>

        <p className="text-zinc-400 mt-2">
          Live chords, progressions and song jamming.
        </p>
      </div>

      <button
        onClick={onShowHelp}
        className="bg-zinc-800 hover:bg-zinc-700 rounded-full w-10 h-10 flex items-center justify-center text-white font-semibold text-lg"
        title="Help & Usage Guide"
      >
        ?
      </button>
    </div>
  );
}
