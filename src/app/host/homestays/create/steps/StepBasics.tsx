"use client";

import { Minus, Plus } from "lucide-react";
import { useEffect, useMemo } from "react";

export type BasicsValue = {
  guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  checkInTime: string;
  checkOutTime: string;
};

type Props = {
  value?: BasicsValue;
  onChange: (value: BasicsValue) => void;
};

const Counter = ({
  label,
  description,
  value,
  min,
  onChange,
}: {
  label: string;
  description: string;
  value: number;
  min: number;
  onChange: (value: number) => void;
}) => {
  return (
    <div className="flex items-center justify-between py-4 border-b border-mitti-khaki">
      <div>
        <p className="font-medium text-mitti-dark-brown">{label}</p>
        <p className="text-sm text-mitti-dark-brown">{description}</p>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => value > min && onChange(value - 1)}
          disabled={value <= min}
          className="h-9 w-9 flex items-center justify-center rounded-full border border-mitti-khaki text-mitti-dark-brown disabled:opacity-40 cursor-pointer"
        >
          <Minus size={16} />
        </button>

        <span className="w-6 text-center text-mitti-dark-brown font-medium">
          {value}
        </span>

        <button
          type="button"
          onClick={() => onChange(value + 1)}
          className="h-9 w-9 flex items-center justify-center rounded-full border border-mitti-khaki text-mitti-dark-brown cursor-pointer"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
};

const StepBasics = ({ value, onChange }: Props) => {
  const data = useMemo<BasicsValue>(
    () =>
      value || {
        guests: 1,
        bedrooms: 1,
        beds: 1,
        bathrooms: 1,
        checkInTime: "14:00",
        checkOutTime: "11:00"
      },
    [value]
  );

  useEffect(() => {
    if (!value) {
      onChange(data);
    }
  }, [value, onChange, data]);

  const update = (field: keyof BasicsValue, val: number) => {
    onChange({
      ...data,
      [field]: val,
    });
  };

  return (
    <div className="w-full mt-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl font-semibold text-mitti-dark-brown">
            Share some basics about your place
          </h1>
          <p className="mt-2 text-mitti-dark-brown">
            You can update these details later if things change.
          </p>
        </div>

        <div className="bg-mitti-cream rounded-2xl border border-mitti-khaki px-4">
          <Counter
            label="Guests"
            description="How many guests can stay comfortably?"
            value={data.guests}
            min={1}
            onChange={(v) => update("guests", v)}
          />

          <Counter
            label="Bedrooms"
            description="Number of bedrooms available"
            value={data.bedrooms}
            min={0}
            onChange={(v) => update("bedrooms", v)}
          />

          <Counter
            label="Beds"
            description="Total number of beds"
            value={data.beds}
            min={1}
            onChange={(v) => update("beds", v)}
          />

          <Counter
            label="Bathrooms"
            description="Number of bathrooms"
            value={data.bathrooms}
            min={0}
            onChange={(v) => update("bathrooms", v)}
          />
        </div>
      </div>
    </div>
  );
};

export default StepBasics;
