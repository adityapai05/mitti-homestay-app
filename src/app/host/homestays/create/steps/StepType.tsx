"use client";

import { DoorOpen, Home } from "lucide-react";

type Props = {
  value?: "ROOM" | "HOME";
  onChange: (value: "ROOM" | "HOME") => void;
};

const StepType = ({ value, onChange }: Props) => {
  return (
    <div className="w-full">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl font-semibold text-mitti-dark-brown">
            What type of place will guests have?
          </h1>
          <p className="mt-2 text-mitti-dark-brown">
            Choose whether guests will have a private room or the entire place.
          </p>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ROOM */}
          <button
            type="button"
            onClick={() => onChange("ROOM")}
            className={`
              flex flex-col gap-6 p-8 rounded-2xl border text-left cursor-pointer transition
              ${
                value === "ROOM"
                  ? "border-mitti-brown bg-mitti-cream shadow-md"
                  : "border-mitti-khaki bg-mitti-cream hover:shadow-sm"
              }
            `}
          >
            <div className="flex items-center justify-center h-14 w-14 rounded-full bg-mitti-khaki text-mitti-dark-brown">
              <DoorOpen size={26} />
            </div>

            <div>
              <h3 className="text-xl font-medium text-mitti-dark-brown">
                A room
              </h3>
              <p className="mt-1 text-mitti-dark-brown">
                Guests have their own room, but share common spaces like the kitchen or living area.
              </p>
            </div>
          </button>

          {/* HOME */}
          <button
            type="button"
            onClick={() => onChange("HOME")}
            className={`
              flex flex-col gap-6 p-8 rounded-2xl border text-left cursor-pointer transition
              ${
                value === "HOME"
                  ? "border-mitti-brown bg-mitti-cream shadow-md"
                  : "border-mitti-khaki bg-mitti-cream hover:shadow-sm"
              }
            `}
          >
            <div className="flex items-center justify-center h-14 w-14 rounded-full bg-mitti-khaki text-mitti-dark-brown">
              <Home size={26} />
            </div>

            <div>
              <h3 className="text-xl font-medium text-mitti-dark-brown">
                An entire home
              </h3>
              <p className="mt-1 text-mitti-dark-brown">
                Guests have the whole place to themselves, including all rooms and amenities.
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StepType;
