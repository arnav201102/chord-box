# Chord-Box Development Guide for AI Agents

This is a music chord learning app with three modes: **live jam**, **sequencer**, and **karaoke**. Built with Next.js 16, React 19, TypeScript, and Tone.js for audio synthesis.

## Quick Facts

- **Entry Point**: `src/app/page.tsx` — main mode switcher
- **Central State**: `useSequencer()` hook (ONLY custom hook) — orchestrates sequencer state and audio playback
- **Audio Engine**: `src/lib/audio.ts` — pure functions managing Tone.js synths and grooves
- **Data**: `src/data/` — static chord/song definitions; add songs by editing `songs.ts`
- **Client-Side Only**: No backend. All state managed via hook and localStorage persistence.
- **Build**: `npm run dev` — auto-opens browser; Tailwind & ESLint enabled

## Critical Architecture: Ref-Based Async Loop

The sequencer's `play()` function uses **refs inside a while loop with setTimeout** to avoid stale closures. This is intentional and necessary for music timing:

```ts
// Pattern: refs capture current state for async operations
const queueRef = useRef(queue);
useEffect(() => {
  queueRef.current = queue;
}, [queue]);

// Inside play() loop:
while (!stopRef.current) {
  const item = queueRef.current[currentIndex];
  await new Promise((r) => setTimeout(r, beatDuration));
}
```

**Do NOT refactor this to state-based logic** — the pattern works because refs update outside render cycles.

## Key Development Workflows

### Add a Song

Edit `src/data/songs.ts`:

```ts
export const songs: Record<string, SongPreset> = {
  "Song Name": {
    bpm: 120,
    queue: [
      { chord: "C", beats: 4 },
      { chord: "G", beats: 4 },
    ],
    // Optional karaoke:
    audioSrc: "/path-to-audio.mp3",
    introSeconds: 5,
    sections: [
      /* verse/chorus structure */
    ],
  },
};
```

### Add a Chord or Groove

- **Chord**: Update both `src/data/chords.ts` (name) and `src/data/chordNotes.ts` (note array)
- **Groove**: Add case in `startGroove()` function in `src/lib/audio.ts` using `Tone.Transport.scheduleRepeat()`

### Audio Tweaks

All audio synthesis lives in `src/lib/audio.ts`. Changes to synth envelopes, EQ, effects require **dev server restart** (no hot reload). Example:

```ts
// Modify decay, attack, wet levels of reverb/delay/eq
eq = new Tone.EQ3({ low: 0, mid: 0, high: -3 });
```

## Important Conventions & Gotchas

### Next.js Version Differences

<!-- BEGIN:nextjs-agent-rules -->

This uses **Next.js 16.2.4** which has breaking changes. Check `/node_modules/next/dist/docs/` before using APIs you think you know.

<!-- END:nextjs-agent-rules -->

### Audio Timing

- Sequencer uses `setTimeout` (NOT sample-accurate). Fine for learning; not for production DAW.
- Groove patterns run on separate Tone.Transport (may not sync perfectly with queue).
- Karaoke HTML audio sync is browser-dependent; may drift over time.

### All Interactive Components Need `"use client"`

Every `.tsx` component that manages state or interacts with hooks must have this directive (app is fully client-side).

### Tone.js Initialization

- `startAudio()` must be called on first user interaction (browser requirement).
- `preloadAudio()` called automatically on `useSequencer` mount.

### Component Communication

- Props drilling only (no Redux/Context). Callbacks bubble up to `page.tsx`.
- `seq` object from `useSequencer()` is spread to child components: `<SequencerPanel {...seq} />`

### Karaoke Quirks

- Intro delay & gap timing manually handled in `SongKaraoke` component.
- Synth doesn't auto-retrigger held strings when switching instruments (uses gain crossfade).

## File Structure Reference

```
src/
├── app/
│   ├── page.tsx          ← Mode switcher, passes seq hook to all children
│   └── layout.tsx
├── components/           ← Dumb UI components, receive callbacks
│   ├── SequencerPanel.tsx
│   ├── LiveJam.tsx
│   ├── SongKaraoke.tsx
│   └── ...
├── hooks/
│   └── useSequencer.ts   ← CENTRAL STATE & AUDIO ORCHESTRATION
├── lib/
│   ├── audio.ts          ← Tone.js synths, grooves, effects
│   └── storage.ts        ← localStorage helpers
├── data/
│   ├── songs.ts          ← Add new songs here
│   ├── chords.ts
│   ├── chordNotes.ts
│   └── presets.ts
└── types/
    └── index.ts          ← All TypeScript definitions
```

## Types to Know

- **Mode**: `"live" | "sequencer" | "karaoke"`
- **QueueItem**: `{ chord: string; beats?: number; duration?: number }`
- **SongPreset**: Song definition with bpm, queue, optional sections and karaoke metadata
- **Section**: `{ type: SectionType; id: string; lines?: SongLine[]; progression?: string[] }`
- **GrooveType**: `"none" | "pop" | "lofi" | "trap" | "rock" | "funk" | "afro" | "house" | "click"`

## When Something Breaks

1. **Audio not playing?** Check if `Tone.start()` was called. Browser requires user interaction first.
2. **Sequencer jumps/skips?** Check `useSequencer` refs are updating correctly.
3. **Karaoke syncs drift?** Expected for long songs; HTML audio sync is browser-dependent.
4. **New song doesn't appear?** Verify export in `songs.ts`; restart dev server.
5. **Build fails?** Check Next.js version notes; ensure no SSR-only code in client components.
