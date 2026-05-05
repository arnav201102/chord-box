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

  // -------------------------
  // 1. PROCESS LYRICS
  // -------------------------
  const processedLyrics = useMemo(() => {
    if (song.lyrics) return song.lyrics;
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
          for (const line of section.lines) {
            const totalBeats = (line.chords || []).reduce(
              (s: number, c: any) => s + (c.beats || 4),
              0,
            );

            lines.push({
              chords: line.chords || [],
              text: line.lyrics,
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
    if (!processedLyrics.length || !song.queue?.length) return [];

    const beatMs = 60000 / song.bpm;

    let t = song.introSeconds ?? 0;

    const timeline = song.queue.map((q) => {
      const d = (q.beats * beatMs) / 1000;
      const start = t;
      t += d;
      return { ...q, start, duration: d };
    });

    let cursor = 0;

    return processedLyrics.map((line) => {
      const needed = line.beats;

      let consumed = 0;
      const start = timeline[cursor]?.start ?? 0;

      while (cursor < timeline.length && consumed < needed) {
        consumed += timeline[cursor].beats;
        cursor++;
      }

      const last = timeline[cursor - 1];
      const duration = last
        ? last.start + last.duration - start
        : (needed * beatMs) / 1000;

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
        const dur = ((c.beats || 4) * beatMs) / 1000;
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
  }, [processedLyrics, song]);

  useEffect(() => {
    lineRefs.current = [];
  }, [lyricSegments]);

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

    const onLoad = () => setDuration(audio.duration || 0);
    const onEnd = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onLoad);
    audio.addEventListener("ended", onEnd);

    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onLoad);
      audio.removeEventListener("ended", onEnd);
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
  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5">
      {/* Controls */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={togglePlayback}
          className="bg-green-600 px-4 py-2 rounded-xl"
        >
          {isPlaying ? "Pause" : "Play"}
        </button>

        <button onClick={restart} className="bg-zinc-700 px-4 py-2 rounded-xl">
          Restart
        </button>

        <div className="text-sm text-zinc-400 ml-auto">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>

      {/* Seek Bar */}
      <div
        className="h-3 bg-zinc-900 rounded-full mb-4 relative cursor-pointer"
        onMouseDown={(e) => {
          setIsSeeking(true);
          handleSeek(e.clientX, e.currentTarget.getBoundingClientRect());
        }}
        onMouseMove={(e) => {
          if (!isSeeking) return;
          handleSeek(e.clientX, e.currentTarget.getBoundingClientRect());
        }}
        onMouseUp={() => setIsSeeking(false)}
        onMouseLeave={() => setIsSeeking(false)}
      >
        <div
          className="h-full bg-green-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Lyrics */}
      <div className="h-[420px] overflow-y-auto space-y-3">
        {lyricSegments.map((line, i) => {
          const active = i === currentIndex;

          return (
            <div
              key={i}
              ref={(el) => {
                lineRefs.current[i] = el;
              }}
              className={`p-4 rounded-xl transition ${
                active ? "bg-green-700 scale-[1.02]" : "bg-zinc-900 opacity-60"
              }`}
            >
              <div className="flex flex-wrap gap-x-2">
                {line.words.map((w: any, wi: number) => {
                  const chord = line.chords.find(
                    (c: any) => Math.abs(c.start - w.start) < 0.2,
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
                      <div className="text-xs text-green-300 h-4">
                        {chord?.chord || ""}
                      </div>

                      <div className="relative">
                        <span>{w.word}</span>
                        <span
                          className="absolute left-0 top-0 text-yellow-300 overflow-hidden whitespace-nowrap"
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
        })}
      </div>

      <audio ref={audioRef} src={song.audioSrc} />
    </div>
  );
}
