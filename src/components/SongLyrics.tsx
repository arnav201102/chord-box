import { SongPreset } from "@/types";
import { useMemo } from "react";

type Props = {
  song: SongPreset;
};

export default function SongLyrics({ song }: Props) {
  const lyrics = useMemo(() => {
    if (song.lyrics) return song.lyrics;

    if (!song.sections) return [];

    const sectionMap: Record<string, any> = [];
    const lyrics: any[] = [];

    for (const section of song.sections) {
      if (section.ref) {
        // Repeat referenced section
        const refSection = sectionMap[section.ref];
        if (refSection) {
          for (let i = 0; i < (section.repeat || 1); i++) {
            lyrics.push(...refSection.lines);
          }
        }
      } else {
        const sectionLines: any[] = [];
        if (section.lines) {
          for (const line of section.lines) {
            // Extract first chord
            let firstChord = "C";
            if (Array.isArray(line.chords) && line.chords.length > 0) {
              const firstChordObj = line.chords[0];
              if (typeof firstChordObj === "object" && firstChordObj.chord) {
                firstChord = firstChordObj.chord;
              } else if (typeof firstChordObj === "string") {
                firstChord = firstChordObj;
              }
            }

            sectionLines.push({
              chord: firstChord,
              text: line.lyrics,
            });
          }
        }
        sectionMap[section.id] = { lines: sectionLines };
        lyrics.push(...sectionLines);
      }
    }

    return lyrics;
  }, [song]);

  if (!lyrics.length) return null;

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
