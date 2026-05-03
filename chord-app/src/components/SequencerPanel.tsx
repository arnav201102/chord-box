import ChordGrid from "@/components/ChordGrid";
import QueueList from "@/components/QueueList";
import { GrooveType } from "@/types";

export default function SequencerPanel(props: any) {
  const {
    play,
    stop,
    playing,

    bpm,
    setBpm,

    loop,
    setLoop,

    groove,
    setGroove,

    queue,
    activeIndex,

    previewChord,
    moveUp,
    moveDown,
    changeBeats,
    removeChord,
    clearQueue,

    addChord,
  } = props;

  return (
    <>
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 mb-6 space-y-4">
        <div className="grid md:grid-cols-4 gap-4">
          <button
            onClick={play}
            disabled={playing}
            className="rounded-xl bg-green-600 px-4 py-3 font-semibold"
          >
            Play
          </button>

          <button
            onClick={stop}
            className="rounded-xl bg-yellow-600 px-4 py-3 font-semibold"
          >
            Stop
          </button>

          <button
            onClick={() => setLoop(!loop)}
            className="rounded-xl bg-blue-600 px-4 py-3 font-semibold"
          >
            Loop: {loop ? "On" : "Off"}
          </button>

          <button
            onClick={clearQueue}
            className="rounded-xl bg-red-600 px-4 py-3 font-semibold"
          >
            Clear
          </button>
        </div>

        <div>
          <div className="mb-2">BPM: {bpm}</div>

          <input
            type="range"
            min="60"
            max="160"
            value={bpm}
            onChange={(e) => setBpm(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <div className="mb-2">Groove</div>

          <select
            value={groove}
            onChange={(e) => setGroove(e.target.value as GrooveType)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-3"
          >
            <option value="none">None</option>
            <option value="pop">Pop</option>
            <option value="lofi">Lo-fi</option>
            <option value="trap">Trap</option>
            <option value="rock">Rock</option>
            <option value="funk">Funk</option>
            <option value="afro">Afro</option>
            <option value="house">House</option>
            <option value="click">Click</option>
          </select>
        </div>
      </div>

      <QueueList
        queue={queue}
        activeIndex={activeIndex}
        previewChord={previewChord}
        moveUp={moveUp}
        moveDown={moveDown}
        changeBeats={changeBeats}
        removeChord={removeChord}
      />

      <ChordGrid onAdd={addChord} />
    </>
  );
}
