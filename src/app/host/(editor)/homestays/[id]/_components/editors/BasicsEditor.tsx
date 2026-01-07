"use client";

import { Minus, Plus, Clock } from "lucide-react";

type BasicsEditorProps = {
  maxGuests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  checkInTime: string;
  checkOutTime: string;
  onChange: (value: {
    maxGuests: number;
    bedrooms: number;
    beds: number;
    bathrooms: number;
    checkInTime: string;
    checkOutTime: string;
  }) => void;
};

const Counter = ({
  label,
  value,
  min,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  onChange: (v: number) => void;
}) => {
  return (
    <div className="flex items-center justify-between py-4 border-b last:border-b-0">
      <span className="font-medium text-mitti-dark-brown">{label}</span>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => value > min && onChange(value - 1)}
          disabled={value <= min}
          className="h-8 w-8 rounded-full border border-mitti-khaki flex items-center justify-center cursor-pointer disabled:opacity-40"
        >
          <Minus size={14} />
        </button>

        <span className="w-6 text-center font-medium">{value}</span>

        <button
          type="button"
          onClick={() => onChange(value + 1)}
          className="h-8 w-8 rounded-full border border-mitti-khaki flex items-center justify-center cursor-pointer"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
};

const BasicsEditor = ({
  maxGuests,
  bedrooms,
  beds,
  bathrooms,
  checkInTime,
  checkOutTime,
  onChange,
}: BasicsEditorProps) => {
  const update = (patch: Partial<BasicsEditorProps>) => {
    onChange({
      maxGuests,
      bedrooms,
      beds,
      bathrooms,
      checkInTime,
      checkOutTime,
      ...patch,
    });
  };

  return (
    <section className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-mitti-dark-brown">Basics</h2>
        <p className="text-sm text-mitti-dark-brown/70">
          These details help guests understand if your place fits their stay.
        </p>
      </div>

      {/* Capacity */}
      <div className="rounded-xl border border-mitti-khaki bg-white px-4">
        <Counter
          label="Guests"
          value={maxGuests}
          min={1}
          onChange={(v) => update({ maxGuests: v })}
        />
        <Counter
          label="Bedrooms"
          value={bedrooms}
          min={0}
          onChange={(v) => update({ bedrooms: v })}
        />
        <Counter
          label="Beds"
          value={beds}
          min={1}
          onChange={(v) => update({ beds: v })}
        />
        <Counter
          label="Bathrooms"
          value={bathrooms}
          min={0}
          onChange={(v) => update({ bathrooms: v })}
        />
      </div>

      {/* Check-in / Check-out */}
      <div className="rounded-xl border border-mitti-khaki bg-white p-4 space-y-4">
        <div className="flex items-center gap-2 font-medium text-mitti-dark-brown">
          <Clock size={16} />
          Check-in & check-out
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1 text-mitti-dark-brown">
              Check-in time
            </label>
            <input
              type="time"
              value={checkInTime}
              onChange={(e) => update({ checkInTime: e.target.value })}
              className="w-full rounded-lg border border-mitti-khaki px-3 py-2 cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-mitti-dark-brown">
              Check-out time
            </label>
            <input
              type="time"
              value={checkOutTime}
              onChange={(e) => update({ checkOutTime: e.target.value })}
              className="w-full rounded-lg border border-mitti-khaki px-3 py-2 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BasicsEditor;
