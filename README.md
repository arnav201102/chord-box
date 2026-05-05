This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Adding a New Song (Developer)

To add a new song, edit `src/data/songs.ts` and add a new entry to the `songs` object.

Required fields:

- `bpm`: tempo in beats per minute
- `queue`: chord progression with per-chord beats
- `lyrics` or `sections`: lyric alignment for karaoke

Optional karaoke metadata:

- `audioSrc`: audio file path under `public/`
- `introSeconds`: delay before the first lyric line
- `key`, `camelot`, `duration`

Example:

```ts
export const songs: Record<string, SongPreset> = {
  "My Song": {
    bpm: 92,
    audioSrc: "/my-song-karaoke.mp3",
    introSeconds: 6,
    key: "F minor",
    camelot: "4A",
    duration: "3:45",
    queue: [
      { chord: "Em", beats: 4 },
      { chord: "C", beats: 4 },
      { chord: "D", beats: 4 },
      { chord: "G", beats: 4 },
    ],
    sections: [
      {
        type: "verse",
        id: "verse_1",
        lines: [
          {
            chords: [
              { chord: "Em", beats: 2 },
              { chord: "C", beats: 2 },
            ],
            lyrics: "Sample lyric line one",
          },
          {
            chords: [
              { chord: "D", beats: 1 },
              { chord: "G", beats: 3 },
            ],
            lyrics: "Sample lyric line two",
          },
        ],
      },
    ],
  },
};
```

Notes:

- Use `sections` for verses, choruses, bridges, and repeats.
- Keep each lyric line total to 4 beats for consistent karaoke timing.
- Store audio files in `public/` and reference them from `audioSrc`.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
