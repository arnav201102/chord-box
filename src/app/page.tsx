"use client";

import { useState } from "react";

import Header from "@/components/Header";
import UsageGuide from "@/components/UsageGuide";
import ModeSwitch from "@/components/ModeSwitch";
import SequencerPanel from "@/components/SequencerPanel";
import LiveJam from "@/components/LiveJam";

import { Mode } from "@/types";
import { useSequencer } from "@/hooks/useSequencer";

import { songs } from "@/data/songs";
import SongLyrics from "@/components/SongLyrics";

export const dynamic = "force-dynamic";

export default function Home() {
  const [mode, setMode] = useState<Mode>("live");

  const [selectedSong, setSelectedSong] = useState("");

  const [showHelp, setShowHelp] = useState(false);

  const seq = useSequencer();

  const switchMode = (next: Mode) => {
    seq.stop();
    setMode(next);
  };

  const loadSong = (name: string) => {
    const song = songs[name];

    seq.stop();

    seq.setQueue(song.queue);

    seq.setBpm(song.bpm);

    setSelectedSong(name);
  };

  return (
    <main className="min-h-screen bg-black text-white px-4 py-6 md:px-8">
      <div className="max-w-6xl mx-auto">
        <Header onShowHelp={() => setShowHelp(true)} />

        <ModeSwitch mode={mode} setMode={switchMode} />

        {mode === "sequencer" && (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Song Presets</h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.keys(songs).map((name) => (
                  <button
                    key={name}
                    onClick={() => loadSong(name)}
                    className={`rounded-xl px-4 py-3 border ${
                      selectedSong === name
                        ? "bg-green-700 border-green-400"
                        : "bg-zinc-900 border-zinc-800"
                    }`}
                  >
                    <div>{name}</div>

                    <div className="text-xs text-zinc-400 mt-1">
                      {songs[name].bpm} BPM
                    </div>
                  </button>
                ))}
              </div>

              {selectedSong && (
                <div className="mt-4 text-green-400">
                  Selected: {selectedSong}
                </div>
              )}

              {selectedSong && (
                <SongLyrics lyrics={songs[selectedSong].lyrics} />
              )}
            </div>

            <SequencerPanel {...seq} />
          </>
        )}

        {mode === "live" && <LiveJam />}
      </div>

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Usage Guide</h2>
                <button
                  onClick={() => setShowHelp(false)}
                  className="bg-zinc-800 hover:bg-zinc-700 rounded-full w-8 h-8 flex items-center justify-center text-white"
                >
                  ×
                </button>
              </div>
              <UsageGuide />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
