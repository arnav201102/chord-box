"use client";

import { useEffect, useRef, useState } from "react";

import { GrooveType, QueueItem } from "@/types";

import { chordNotes } from "@/data/chordNotes";

import { saveState, loadState } from "@/lib/storage";

import {
  preloadAudio,
  startAudio,
  playSustainChord,
  playBass,
  stopAllAudio,
  startGroove,
  stopGroove,
} from "@/lib/audio";

export function useSequencer() {
  const [queue, setQueue] = useState<QueueItem[]>([]);

  const [bpm, setBpm] = useState(95);

  const [loop, setLoop] = useState(true);

  const [playing, setPlaying] = useState(false);

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const [groove, setGroove] = useState<GrooveType>("pop");

  const stopRef = useRef(false);

  const queueRef = useRef(queue);

  const bpmRef = useRef(bpm);

  const loopRef = useRef(loop);

  const grooveRef = useRef(groove);

  /* ---------- Init ---------- */

  useEffect(() => {
    preloadAudio();

    const saved = loadState();

    if (saved) {
      setQueue(saved.queue);
      setBpm(saved.bpm);
      setLoop(saved.loop);
      setGroove(saved.groove);
    }
  }, []);

  /* ---------- Refs ---------- */

  useEffect(() => {
    queueRef.current = queue;
  }, [queue]);

  useEffect(() => {
    bpmRef.current = bpm;
  }, [bpm]);

  useEffect(() => {
    loopRef.current = loop;
  }, [loop]);

  useEffect(() => {
    grooveRef.current = groove;
  }, [groove]);

  /* ---------- Save ---------- */

  useEffect(() => {
    saveState({
      queue,
      bpm,
      loop,
      groove,
    });
  }, [queue, bpm, loop, groove]);

  /* ---------- Groove Live ---------- */

  useEffect(() => {
    if (!playing) return;

    stopGroove();

    if (groove !== "none") {
      startGroove(groove, bpm);
    }
  }, [groove, bpm, playing]);

  /* ---------- Helpers ---------- */

  const beatMs = () => (60 / bpmRef.current) * 1000;

  /* ---------- Queue Controls ---------- */

  const addChord = (chord: string) => {
    setQueue((prev) => [
      ...prev,
      {
        chord,
        beats: 2,
      },
    ]);
  };

  const removeChord = (index: number) => {
    setQueue((prev) => prev.filter((_, i) => i !== index));
  };

  const clearQueue = () => {
    stop();
    setQueue([]);
  };

  const changeBeats = (index: number, delta: number) => {
    setQueue((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              beats: Math.max(1, item.beats + delta),
            }
          : item,
      ),
    );
  };

  const moveUp = (index: number) => {
    if (index === 0) return;

    const arr = [...queueRef.current];

    [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];

    setQueue(arr);
  };

  const moveDown = (index: number) => {
    if (index === queueRef.current.length - 1) return;

    const arr = [...queueRef.current];

    [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];

    setQueue(arr);
  };

  /* ---------- Audio Controls ---------- */

  const stop = () => {
    stopRef.current = true;

    setPlaying(false);

    setActiveIndex(null);

    stopGroove();
    stopAllAudio();
  };

  const previewChord = async (chord: string) => {
    await startAudio();

    const notes = chordNotes[chord];

    if (notes) {
      playSustainChord(notes);
    }
  };

  const play = async () => {
    if (playing) return;

    if (!queueRef.current.length) return;

    await startAudio();

    stopRef.current = false;

    setPlaying(true);

    if (grooveRef.current !== "none") {
      startGroove(grooveRef.current, bpmRef.current);
    }

    let index = 0;

    while (!stopRef.current) {
      const current = queueRef.current;

      if (!current.length) break;

      if (index >= current.length) {
        if (loopRef.current) {
          index = 0;
        } else {
          break;
        }
      }

      const item = current[index];

      const notes = chordNotes[item.chord];

      setActiveIndex(index);

      if (notes) {
        playSustainChord(notes);

        playBass(notes[0], item.beats);
      }

      const waitMs = item.beats * beatMs();

      await new Promise((r) => setTimeout(r, waitMs));

      index++;
    }

    stop();
  };

  return {
    queue,
    setQueue,

    bpm,
    setBpm,

    loop,
    setLoop,

    groove,
    setGroove,

    playing,
    activeIndex,

    addChord,
    removeChord,
    clearQueue,

    changeBeats,
    moveUp,
    moveDown,

    play,
    stop,
    previewChord,
  };
}
