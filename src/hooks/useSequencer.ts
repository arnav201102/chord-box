"use client";

import { useEffect, useRef, useState } from "react";

import { GrooveType, QueueItem, InstrumentType } from "@/types";

import { chordNotes } from "@/data/chordNotes";

import { saveState, loadState } from "@/lib/storage";

import {
  preloadAudio,
  startAudio,
  playBass,
  stopAllAudio,
  startGroove,
  stopGroove,
  playChord,
  setInstrument,
} from "@/lib/audio";

export function useSequencer() {
  const [queue, setQueue] = useState<QueueItem[]>([]);

  const [bpm, setBpm] = useState(95);

  const [loop, setLoop] = useState(true);

  const [playing, setPlaying] = useState(false);

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const [groove, setGroove] = useState<GrooveType>("pop");

  const [instrument, setInstrumentState] = useState<InstrumentType>("strings");

  const stopRef = useRef(false);

  const queueRef = useRef(queue);

  const bpmRef = useRef(bpm);

  const loopRef = useRef(loop);

  const grooveRef = useRef(groove);

  const instrumentRef = useRef(instrument);

  /* ---------- Init ---------- */

  useEffect(() => {
    if (typeof window === "undefined") return;

    preloadAudio();

    const saved = loadState();

    if (saved) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQueue(saved.queue);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBpm(saved.bpm);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoop(saved.loop);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setGroove(saved.groove);
      if (saved.instrument) setInstrumentState(saved.instrument);
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

  useEffect(() => {
    instrumentRef.current = instrument;
  }, [instrument]);

  /* ---------- Save ---------- */

  useEffect(() => {
    saveState({
      queue,
      bpm,
      loop,
      groove,
      instrument,
    });
  }, [queue, bpm, loop, groove, instrument]);

  /* ---------- Groove Live ---------- */

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!playing) return;

    stopGroove();

    if (groove !== "none") {
      startGroove(groove, bpm);
    }
  }, [groove, bpm, playing]);

  /* ---------- Instrument Live ---------- */

  useEffect(() => {
    if (typeof window === "undefined") return;

    setInstrument(instrument);
  }, [instrument]);

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
              beats: Math.max(1, (item.beats ?? 1) + delta),
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
      playChord(notes);
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
        playChord(notes);
        playBass(notes[0], item.beats ?? 1);
      }

      const waitMs = item.duration
        ? item.duration * 1000
        : (item.beats ?? 1) * beatMs();

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

    instrument,
    setInstrument: setInstrumentState,

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
