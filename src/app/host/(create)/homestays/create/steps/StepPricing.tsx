"use client";

type Props = {
  value?: number;
  onChange: (value: number) => void;
};

const MIN_PRICE = 150;
const MAX_PRICE = 10000;

const StepPricing = ({ value, onChange }: Props) => {
  return (
    <div className="w-full">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl font-semibold text-mitti-dark-brown">
            Set your price per night
          </h1>
          <p className="mt-2 text-mitti-dark-brown">
            Choose a fair price for your home. You can always change it later.
          </p>
        </div>

        {/* Price input */}
        <div className="bg-mitti-cream border border-mitti-khaki rounded-2xl p-6">
          <label className="block text-sm font-medium text-mitti-dark-brown mb-2">
            Price per night (INR)
          </label>

          <div className="flex items-center gap-3">
            <span className="text-xl font-medium text-mitti-dark-brown">₹</span>
            <input
              type="number"
              min={MIN_PRICE}
              max={MAX_PRICE}
              value={value ?? ""}
              onChange={(e) => onChange(Number(e.target.value))}
              placeholder="e.g. 2500"
              className="w-full px-4 py-3 rounded-xl bg-mitti-beige border border-mitti-khaki text-lg text-mitti-dark-brown outline-none focus:border-mitti-brown"
            />
          </div>

          {/* Helper text */}
          <p className="mt-4 text-sm text-mitti-dark-brown">
            Tip: Many rural homestays start between ₹500 and ₹3,000 per night,
            depending on location and amenities.
          </p>
        </div>

        {/* Guest preview */}
        {value && value >= MIN_PRICE && (
          <div className="mt-6 p-4 border border-mitti-khaki rounded-xl bg-mitti-cream">
            <p className="text-mitti-dark-brown">
              Guests will see:
              <span className="font-medium"> ₹{value} per night</span>
            </p>
          </div>
        )}

        {/* Validation hint */}
        {value !== undefined && (value < MIN_PRICE || value > MAX_PRICE) && (
          <p className="mt-4 text-sm text-mitti-error">
            Price must be between ₹{MIN_PRICE} and ₹{MAX_PRICE}.
          </p>
        )}
      </div>
    </div>
  );
};

export default StepPricing;
