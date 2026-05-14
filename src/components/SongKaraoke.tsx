"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { SongPreset } from "@/types";

type Props = {
  song: SongPreset;
};

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function SongKaraoke({ song }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [audioReady, setAudioReady] = useState(false);

  // -------------------------
  // 1. PROCESS LYRICS
  // -------------------------
  const processedLyrics = useMemo(() => {
    const beatMs = 60000 / song.bpm;

    if (song.lyrics)
      return song.lyrics.map((line) => ({
        chords: [],
        text: line.text,
        duration: line.duration ?? ((line.beats ?? 4) * beatMs) / 1000,
        beats: line.beats,
        startTime: line.startTime,
      }));

    if (!song.sections) return [];

    const sectionMap: Record<string, any> = {};
    const lyrics: any[] = [];

    for (const section of song.sections) {
      if (section.ref) {
        const ref = sectionMap[section.ref];
        if (ref) {
          for (let i = 0; i < (section.repeat || 1); i++) {
            lyrics.push(...ref.lines);
          }
        }
      } else {
        const lines: any[] = [];

        if (section.lines) {
          const beatMs = 60000 / song.bpm;

          for (const line of section.lines) {
            const totalDuration = (line.chords || []).reduce(
              (s: number, c: any) =>
                s + (c.duration ?? ((c.beats || 4) * beatMs) / 1000),
              0,
            );

            const totalBeats = (line.chords || []).reduce(
              (s: number, c: any) => s + (c.beats || 0),
              0,
            );

            lines.push({
              chords: line.chords || [],
              text: line.lyrics,
              duration: totalDuration || ((totalBeats || 4) * beatMs) / 1000,
              beats: totalBeats || 4,
            });
          }
        }

        sectionMap[section.id] = { lines };
        lyrics.push(...lines);
      }
    }

    return lyrics;
  }, [song]);

  // -------------------------
  // 2. TIMELINE + WORD + CHORD SYNC
  // -------------------------
  const lyricSegments = useMemo(() => {
    if (!processedLyrics.length) return [];

    let t = song.introSeconds ?? 0;

    return processedLyrics.map((line) => {
      const start = t;
      const duration =
        line.duration ?? ((line.beats ?? 4) * 60000) / song.bpm / 1000;
      t += duration;

      // WORD TIMING
      const words = line.text.split(" ");
      const totalChars = words.reduce(
        (s: number, w: string) => s + w.length,
        0,
      );

      let wc = start;

      const wordTimings = words.map((w: string) => {
        const dur = duration * (w.length / totalChars);
        const ws = wc;
        wc += dur;

        return { word: w, start: ws, duration: dur };
      });

      // CHORD TIMING
      let cc = start;

      const chordTimings = line.chords.map((c: any) => {
        const dur = c.duration ?? ((c.beats ?? 4) * 60000) / song.bpm / 1000;
        const cs = cc;
        cc += dur;

        return { chord: c.chord, start: cs, duration: dur };
      });

      return {
        ...line,
        start,
        duration,
        words: wordTimings,
        chords: chordTimings,
      };
    });
  }, [processedLyrics, song.bpm, song.introSeconds]);

  // -------------------------
  // 3. ACTIVE LINE
  // -------------------------
  const currentIndex = useMemo(() => {
    return lyricSegments.findIndex(
      (l) => currentTime >= l.start && currentTime < l.start + l.duration,
    );
  }, [currentTime, lyricSegments]);

  const progress = duration ? Math.min((currentTime / duration) * 100, 100) : 0;

  // -------------------------
  // 3B. CHORD FINDER (Memoized for performance)
  // -------------------------
  const findChordForWord = useMemo(() => {
    return (wordStart: number, wordEnd: number, chords: any[]) => {
      if (!chords.length) return null;

      // Find chord that overlaps most with word
      let bestChord = null;
      let maxOverlap = 0;

      for (const chord of chords) {
        const chordEnd = chord.start + chord.duration;
        const overlapStart = Math.max(wordStart, chord.start);
        const overlapEnd = Math.min(wordEnd, chordEnd);
        const overlap = Math.max(0, overlapEnd - overlapStart);

        if (overlap > maxOverlap) {
          maxOverlap = overlap;
          bestChord = chord;
        }
      }

      return bestChord;
    };
  }, []);

  // -------------------------
  // 4. AUTO SCROLL
  // -------------------------
  useEffect(() => {
    if (currentIndex === -1) return;

    const el = lineRefs.current[currentIndex];
    if (!el) return;

    el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [currentIndex]);

  // -------------------------
  // 5. AUDIO EVENTS
  // -------------------------
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () => {
      if (!isSeeking) setCurrentTime(audio.currentTime);
    };

    const onLoad = () => {
      setDuration(audio.duration || 0);
      setAudioReady(true);
    };

    const onEnd = () => setIsPlaying(false);

    const onError = () => {
      setAudioReady(false);
      setIsPlaying(false);
    };

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onLoad);
    audio.addEventListener("canplay", onLoad);
    audio.addEventListener("ended", onEnd);
    audio.addEventListener("error", onError);

    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onLoad);
      audio.removeEventListener("canplay", onLoad);
      audio.removeEventListener("ended", onEnd);
      audio.removeEventListener("error", onError);
    };
  }, [isSeeking]);

  // -------------------------
  // CONTROLS
  // -------------------------
  const togglePlayback = async () => {
    const a = audioRef.current;
    if (!a) return;

    if (isPlaying) {
      a.pause();
      setIsPlaying(false);
    } else {
      await a.play();
      setIsPlaying(true);
    }
  };

  const restart = () => {
    const a = audioRef.current;
    if (!a) return;

    a.currentTime = 0;
    setCurrentTime(0);
    if (isPlaying) a.play();
  };

  const handleSeek = (clientX: number, rect: DOMRect) => {
    if (!duration) return;

    const percent = (clientX - rect.left) / rect.width;
    const t = Math.max(0, Math.min(percent, 1)) * duration;

    const a = audioRef.current;
    if (!a) return;

    a.currentTime = t;
    setCurrentTime(t);
  };

  // -------------------------
  // UI
  // -------------------------
  const hasAudio = !!song.audioSrc;

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5">
      {/* Metadata */}
      <div className="mb-4 text-xs text-zinc-400 space-y-1">
        {song.introSeconds && <div>Intro: {formatTime(song.introSeconds)}</div>}
        {song.key && <div>Key: {song.key}</div>}
        {song.camelot && <div>Camelot: {song.camelot}</div>}
      </div>

      {/* Controls */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={togglePlayback}
          disabled={!hasAudio || !audioReady}
          className="bg-green-600 px-4 py-2 rounded-xl disabled:bg-gray-600 disabled:opacity-50"
        >
          {isPlaying ? "Pause" : "Play"}
        </button>

        <button
          onClick={restart}
          disabled={!hasAudio}
          className="bg-zinc-700 px-4 py-2 rounded-xl disabled:bg-gray-600 disabled:opacity-50"
        >
          Restart
        </button>

        <div className="text-sm text-zinc-400 ml-auto">
          {hasAudio ? (
            <>
              {formatTime(currentTime)} / {formatTime(duration)}
            </>
          ) : (
            <span className="text-red-400">No audio file</span>
          )}
        </div>
      </div>

      {/* Seek Bar */}
      <div
        className={`h-3 bg-zinc-900 rounded-full mb-4 relative cursor-pointer transition ${
          !hasAudio ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onMouseDown={(e) => {
          if (!hasAudio) return;
          setIsSeeking(true);
          handleSeek(e.clientX, e.currentTarget.getBoundingClientRect());
        }}
        onMouseMove={(e) => {
          if (!isSeeking || !hasAudio) return;
          handleSeek(e.clientX, e.currentTarget.getBoundingClientRect());
        }}
        onMouseUp={() => setIsSeeking(false)}
        onMouseLeave={() => setIsSeeking(false)}
      >
        <div
          className="h-full bg-green-500 rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Lyrics */}
      <div className="h-[420px] overflow-y-auto space-y-3">
        {lyricSegments.length === 0 ? (
          <div className="flex items-center justify-center h-full text-zinc-500">
            No lyrics available
          </div>
        ) : (
          lyricSegments.map((line, i) => {
            const active = i === currentIndex;

            return (
              <div
                key={i}
                ref={(el) => {
                  lineRefs.current[i] = el;
                }}
                className={`p-4 rounded-xl transition ${
                  active
                    ? "bg-green-700 scale-[1.02] shadow-lg shadow-green-500"
                    : "bg-zinc-900 opacity-60 hover:opacity-80"
                }`}
              >
                {/* Chord indicators above lyrics */}
                <div className="mb-2 flex flex-wrap gap-x-2 min-h-[1.25rem]">
                  {line.chords.map((c: any, ci: number) => (
                    <div
                      key={ci}
                      className={`text-xs font-bold transition ${
                        currentTime >= c.start &&
                        currentTime < c.start + c.duration
                          ? "text-yellow-300 bg-yellow-900 px-2 py-1 rounded"
                          : "text-green-300"
                      }`}
                      style={{
                        opacity:
                          currentTime >= c.start - 0.5 &&
                          currentTime < c.start + c.duration
                            ? 1
                            : 0.6,
                      }}
                    >
                      {c.chord}
                    </div>
                  ))}
                </div>

                {/* Lyrics with word-level progress */}
                <div className="flex flex-wrap gap-x-2">
                  {line.words.map((w: any, wi: number) => {
                    const chord = findChordForWord(
                      w.start,
                      w.start + w.duration,
                      line.chords,
                    );

                    const isActive =
                      currentTime >= w.start &&
                      currentTime < w.start + w.duration;

                    const p = isActive
                      ? (currentTime - w.start) / w.duration
                      : currentTime > w.start
                        ? 1
                        : 0;

                    return (
                      <div key={wi} className="flex flex-col items-start">
                        {chord && (
                          <div
                            className={`text-xs h-4 transition ${
                              isActive
                                ? "text-yellow-300 font-bold"
                                : "text-green-300"
                            }`}
                          >
                            {chord.chord}
                          </div>
                        )}

                        <div className="relative">
                          <span
                            className={`transition ${
                              isActive ? "font-semibold" : ""
                            }`}
                          >
                            {w.word}
                          </span>
                          <span
                            className="absolute left-0 top-0 text-yellow-300 overflow-hidden whitespace-nowrap font-semibold"
                            style={{ width: `${p * 100}%` }}
                          >
                            {w.word}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>

      <audio ref={audioRef} src={song.audioSrc} crossOrigin="anonymous" />
    </div>
  );
}
