"use client";

import { Leaf, Home, Mountain, Waves, Sprout, Grid } from "lucide-react";

const categories = [
  {
    value: "FARM_STAY",
    title: "Farm stay",
    description: "Experience life close to farms and nature",
    icon: Sprout,
  },
  {
    value: "ECO_LODGE",
    title: "Eco lodge",
    description: "Sustainable stays surrounded by nature",
    icon: Leaf,
  },
  {
    value: "TRADITIONAL_HOME",
    title: "Traditional home",
    description: "Stay in a culturally rich local home",
    icon: Home,
  },
  {
    value: "MOUNTAIN_RETREAT",
    title: "Mountain retreat",
    description: "Peaceful stays in the hills or mountains",
    icon: Mountain,
  },
  {
    value: "LAKESIDE",
    title: "Lakeside",
    description: "Relaxing stays near lakes or backwaters",
    icon: Waves,
  },
  {
    value: "OTHER",
    title: "Other",
    description: "Something unique that doesn’t fit above",
    icon: Grid,
  },
];

type Props = {
  value?: string;
  onChange: (value: string) => void;
};

const StepCategory = ({ value, onChange }: Props) => {
  return (
    <div className="flex items-center justify-center w-full mt-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl font-semibold text-mitti-dark-brown">
            Which of these best describes your place?
          </h1>
          <p className="mt-2 text-mitti-dark-brown">
            Choose the category that fits your homestay best.
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            const isSelected = value === category.value;

            return (
              <button
                key={category.value}
                type="button"
                onClick={() => onChange(category.value)}
                className={`
                  flex flex-col items-start gap-4 p-6 rounded-2xl border
                  transition text-left cursor-pointer
                  ${
                    isSelected
                      ? "border-mitti-brown bg-mitti-cream shadow-md"
                      : "border-mitti-khaki bg-mitti-cream hover:shadow-sm"
                  }
                `}
              >
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-mitti-khaki text-mitti-dark-brown">
                  <Icon size={22} />
                </div>

                <div>
                  <h3 className="text-lg font-medium text-mitti-dark-brown">
                    {category.title}
                  </h3>
                  <p className="text-sm text-mitti-dark-brown mt-1">
                    {category.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StepCategory;
