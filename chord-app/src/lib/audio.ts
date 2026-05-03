import * as Tone from "tone";
import { GrooveType } from "@/types";

let started = false;

/* Instruments */
let pad: Tone.PolySynth | null = null;
let pluck: Tone.PolySynth | null = null;
let bass: Tone.MonoSynth | null = null;
let kick: Tone.MembraneSynth | null = null;
let snare: Tone.NoiseSynth | null = null;
let hat: Tone.MetalSynth | null = null;

/* Live hold notes */
let liveNotes: string[] = [];

function buildInstruments() {
  if (pad) return;

  pad = new Tone.PolySynth(Tone.Synth, {
    oscillator: {
      type: "triangle",
    },
    envelope: {
      attack: 0.25,
      decay: 0.2,
      sustain: 0.8,
      release: 1.8,
    },
    volume: -8,
  }).toDestination();

  pluck = new Tone.PolySynth(Tone.Synth, {
    oscillator: {
      type: "sine",
    },
    envelope: {
      attack: 0.01,
      decay: 0.15,
      sustain: 0.15,
      release: 0.5,
    },
    volume: -10,
  }).toDestination();

  bass = new Tone.MonoSynth({
    oscillator: {
      type: "square",
    },
    envelope: {
      attack: 0.01,
      decay: 0.2,
      sustain: 0.3,
      release: 0.8,
    },
    filterEnvelope: {
      attack: 0.01,
      decay: 0.15,
      sustain: 0,
      release: 0.2,
      baseFrequency: 90,
      octaves: 2,
    },
    volume: -6,
  }).toDestination();

  kick = new Tone.MembraneSynth({
    pitchDecay: 0.03,
    octaves: 6,
    volume: -2,
  }).toDestination();

  snare = new Tone.NoiseSynth({
    noise: {
      type: "white",
    },
    envelope: {
      attack: 0.001,
      decay: 0.12,
      sustain: 0,
    },
    volume: -10,
  }).toDestination();

  hat = new Tone.MetalSynth({
    // frequency: 220,
    envelope: {
      attack: 0.001,
      decay: 0.05,
      release: 0.01,
    },
    harmonicity: 5.1,
    modulationIndex: 32,
    resonance: 2000,
    octaves: 1.5,
    volume: -18,
  }).toDestination();
}

/* ---------- Start ---------- */

export async function startAudio() {
  if (!started) {
    await Tone.start();
    started = true;
  }

  buildInstruments();
}

export async function preloadAudio() {
  await startAudio();
}

/* ---------- Stops ---------- */

export function stopAllAudio() {
  Tone.Transport.stop();
  Tone.Transport.cancel();

  pad?.releaseAll();
  pluck?.releaseAll();

  if (liveNotes.length) {
    pad?.triggerRelease(liveNotes);
    liveNotes = [];
  }
}

export function stopGroove() {
  //   Tone.Transport.stop();
  Tone.Transport.cancel();
}

/* ---------- Live Jam ---------- */

export function playLiveChord(notes: string[]) {
  if (!pad || !pluck) return;

  stopAllAudio();

  liveNotes = notes;

  pluck.triggerAttackRelease(notes, "8n");

  pad.triggerAttack(notes);
}

export function stopLiveChord() {
  if (!pad) return;

  if (liveNotes.length) {
    pad.triggerRelease(liveNotes);
    liveNotes = [];
  }
}

/* ---------- Sequencer ---------- */

export function playSustainChord(notes: string[]) {
  if (!pad || !pluck) return;

  pad.releaseAll();

  pluck.triggerAttackRelease(notes, "8n");

  pad.triggerAttack(notes);
}

export function playBass(root: string, beats = 4) {
  if (!bass) return;

  const low = root.replace("4", "2").replace("5", "2").replace("3", "2");

  bass.triggerAttackRelease(low, `${beats}n`);
}

/* ---------- Groove ---------- */

export function startGroove(groove: GrooveType, bpm: number) {
  if (!kick || !snare || !hat) return;

  Tone.Transport.stop();
  Tone.Transport.cancel();

  Tone.Transport.bpm.value = bpm;

  if (Tone.Transport.state !== "started") {
    Tone.Transport.start();
  }

  if (groove === "none") return;

  if (groove === "click") {
    Tone.Transport.scheduleRepeat((time) => {
      hat!.triggerAttackRelease("32n", time);
    }, "4n");
  }

  if (groove === "pop") {
    Tone.Transport.scheduleRepeat((time) => {
      kick!.triggerAttackRelease("C1", "8n", time);
    }, "1m");

    Tone.Transport.scheduleRepeat((time) => {
      snare!.triggerAttackRelease("8n", time + Tone.Time("2n").toSeconds());
    }, "1m");

    Tone.Transport.scheduleRepeat((time) => {
      hat!.triggerAttackRelease("32n", time);
    }, "8n");
  }

  if (groove === "lofi") {
    Tone.Transport.scheduleRepeat((time) => {
      kick!.triggerAttackRelease("C1", "8n", time);
    }, "2n");

    Tone.Transport.scheduleRepeat((time) => {
      hat!.triggerAttackRelease("32n", time);
    }, "4n");
  }

  if (groove === "trap") {
    Tone.Transport.scheduleRepeat((time) => {
      kick!.triggerAttackRelease("C1", "8n", time);
    }, "2n");

    Tone.Transport.scheduleRepeat((time) => {
      hat!.triggerAttackRelease("64n", time);
    }, "16n");
  }

  if (groove === "rock") {
    Tone.Transport.scheduleRepeat((time) => {
      kick!.triggerAttackRelease("C1", "8n", time);
    }, "2n");

    Tone.Transport.scheduleRepeat(
      (time) => {
        snare!.triggerAttackRelease("8n", time);
      },
      "2n",
      "2n",
    );
  }

  if (groove === "funk") {
    Tone.Transport.scheduleRepeat((time) => {
      hat!.triggerAttackRelease("64n", time);
    }, "8t");
  }

  if (groove === "house") {
    Tone.Transport.scheduleRepeat((time) => {
      kick!.triggerAttackRelease("C1", "8n", time);
    }, "4n");

    Tone.Transport.scheduleRepeat((time) => {
      hat!.triggerAttackRelease("32n", time);
    }, "8n");
  }

  if (groove === "afro") {
    Tone.Transport.scheduleRepeat((time) => {
      kick!.triggerAttackRelease("C1", "8n", time);
    }, "2n");

    Tone.Transport.scheduleRepeat((time) => {
      hat!.triggerAttackRelease("32n", time);
    }, "8t");
  }

  if (Tone.Transport.state !== "started") {
    Tone.Transport.start();
  }
}
