import * as Tone from "tone";
import { GrooveType, InstrumentType } from "@/types";

let master: Tone.Gain;
let eq: Tone.EQ3;
let reverb: Tone.Reverb;
let delay: Tone.FeedbackDelay;
let widener: Tone.StereoWidener;

let started = false;

function buildAudioChain() {
  if (master) return;

  master = new Tone.Gain(0.9);

  eq = new Tone.EQ3({
    low: 0,
    mid: 0,
    high: -3, // reduce harshness
  });

  reverb = new Tone.Reverb({
    decay: 4.5,
    wet: 0.25, // subtle, not muddy
  });

  delay = new Tone.FeedbackDelay({
    delayTime: "8n",
    feedback: 0.2,
    wet: 0.1,
  });

  widener = new Tone.StereoWidener(0.5);

  master.chain(eq, widener, reverb, delay, Tone.Destination);
}

/* Instruments */
let bass: Tone.MonoSynth | null = null;
let kick: Tone.MembraneSynth | null = null;
let snare: Tone.NoiseSynth | null = null;
let hat: Tone.MetalSynth | null = null;

function buildGrooveInstruments() {
  if (bass) return;

  bass = new Tone.MonoSynth({
    oscillator: { type: "sawtooth" },
    envelope: { attack: 0.01, decay: 0.1, sustain: 0.3, release: 0.2 },
    volume: -12,
  }).connect(master);

  kick = new Tone.MembraneSynth({
    pitchDecay: 0.05,
    octaves: 10,
    oscillator: { type: "sine" },
    envelope: { attack: 0.001, decay: 0.4, sustain: 0.01, release: 1.4 },
    volume: -8,
  }).connect(master);

  snare = new Tone.NoiseSynth({
    noise: { type: "white" },
    envelope: { attack: 0.001, decay: 0.2, sustain: 0, release: 0.1 },
    volume: -18,
  }).connect(master);

  hat = new Tone.MetalSynth({
    envelope: { attack: 0.001, decay: 0.1, release: 0.1 },
    harmonicity: 5.1,
    modulationIndex: 32,
    resonance: 4000,
    octaves: 1.5,
    volume: -20,
  }).connect(master);
}

/* ---------- Instrument System ---------- */

let currentInstrument: InstrumentType = "strings";

let activeNotes: string[] = [];

/* Gains for crossfade */
let stringsGain: Tone.Gain;
let guitarGain: Tone.Gain;
let pianoGain: Tone.Gain;

/* Instruments */
let strings: Tone.PolySynth;
let guitar: Tone.PolySynth;
let piano: Tone.PolySynth;

function buildInstruments() {
  if (strings) return;

  /* Gains for crossfade */
  stringsGain = new Tone.Gain(1).connect(master);
  guitarGain = new Tone.Gain(0).connect(master);
  pianoGain = new Tone.Gain(0).connect(master);

  /* Strings (default) */
  strings = new Tone.PolySynth(Tone.Synth, {
    oscillator: {
      type: "fatsawtooth",
      count: 3,
      spread: 20,
    },
    envelope: {
      attack: 0.3,
      decay: 0.2,
      sustain: 0.8,
      release: 2,
    },
    volume: -8,
  }).connect(stringsGain);

  /* Guitar */
  guitar = new Tone.PolySynth(Tone.Synth, {
    oscillator: {
      type: "triangle",
    },
    envelope: {
      attack: 0.01,
      decay: 0.2,
      sustain: 0.1,
      release: 0.8,
    },
    volume: -12,
  }).connect(guitarGain);

  /* Piano */
  piano = new Tone.PolySynth(Tone.Synth, {
    oscillator: {
      type: "triangle",
    },
    envelope: {
      attack: 0.02,
      decay: 0.4,
      sustain: 0.2,
      release: 1.2,
    },
    volume: -6,
  }).connect(pianoGain);
}

/* ---------- Start ---------- */

export async function startAudio() {
  if (!started) {
    await Tone.start();
    started = true;
  }

  buildAudioChain();
  buildInstruments();
  buildGrooveInstruments();
}

export async function preloadAudio() {
  await startAudio();
}

/* ---------- Instrument Switch ---------- */

export function setInstrument(next: InstrumentType) {
  if (currentInstrument === next) return;

  const fade = 0.25;

  const gains = {
    strings: stringsGain,
    guitar: guitarGain,
    piano: pianoGain,
  };

  gains[currentInstrument].gain.linearRampTo(0, fade);

  gains[next].gain.linearRampTo(1, fade);

  currentInstrument = next;

  /* re-trigger current chord */
  if (activeNotes.length) {
    setTimeout(() => {
      playChord(activeNotes);
    }, 50);
  }
}

/* ---------- Play ---------- */

export function playChord(notes: string[]) {
  if (!strings || !guitar || !piano) return;
  const now = Tone.now();

  activeNotes = notes;

  strings.releaseAll();
  guitar.releaseAll();
  piano.releaseAll();

  if (currentInstrument === "strings") {
    strings.triggerAttack(notes);
  }

  if (currentInstrument === "piano") {
    piano.triggerAttackRelease(notes, "2n");
  }

  if (currentInstrument === "guitar") {
    notes.forEach((note, i) => {
      guitar.triggerAttackRelease(
        note,
        "8n",
        now + i * 0.04 + Math.random() * 0.01,
      );
    });
  }
}

/* ---------- Stop ---------- */

export function stopChord() {
  strings?.releaseAll();
  guitar?.releaseAll();
  piano?.releaseAll();

  activeNotes = [];
}

/* ---------- Stops ---------- */

export function stopAllAudio() {
  Tone.Transport.stop();
  Tone.Transport.cancel();

  stopChord();
}

export function stopGroove() {
  //   Tone.Transport.stop();
  Tone.Transport.cancel();
}

/* ---------- Sequencer ---------- */

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
