import { InstrumentType } from "@/types";

type Props = {
  current: InstrumentType;
  onChange: (val: InstrumentType) => void;
};

export default function InstrumentSelector({ current, onChange }: Props) {
  const items: InstrumentType[] = ["strings", "guitar", "piano"];

  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      {items.map((i) => (
        <button
          key={i}
          onClick={() => onChange(i)}
          className={`rounded-xl py-3 font-semibold capitalize ${
            current === i ? "bg-green-600" : "bg-zinc-900"
          }`}
        >
          {i}
        </button>
      ))}
    </div>
  );
}
