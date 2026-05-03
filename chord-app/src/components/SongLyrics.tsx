type Props = {
  lyrics: {
    chord: string;
    text: string;
  }[];
};

export default function SongLyrics({ lyrics }: Props) {
  if (!lyrics) return null;

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 mt-5">
      <h2 className="text-xl font-semibold mb-4">Sing Along</h2>

      <div className="space-y-3">
        {lyrics.map((line, i) => (
          <div key={i} className="flex gap-3">
            <div className="text-green-400 font-bold min-w-[60px]">
              [{line.chord}]
            </div>

            <div className="text-zinc-300">{line.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
