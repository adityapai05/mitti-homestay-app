"use client";

type Props = {
  title?: string;
  description?: string;
  onChange: (value: { title: string; description: string }) => void;
};

const TITLE_MAX = 50;
const DESCRIPTION_MAX = 500;

const StepAbout = ({
  title = "",
  description = "",
  onChange,
}: Props) => {
  return (
    <div className="w-full mt-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl font-semibold text-mitti-dark-brown">
            Tell guests about your place
          </h1>
          <p className="mt-2 text-mitti-dark-brown">
            Share what makes your home special. A warm, honest description helps
            guests feel welcome even before they arrive.
          </p>
        </div>

        {/* Title */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-mitti-dark-brown mb-2">
            Title
          </label>
          <textarea
            value={title}
            onChange={(e) =>
              onChange({
                title: e.target.value.slice(0, TITLE_MAX),
                description,
              })
            }
            placeholder="A peaceful village home surrounded by fields"
            rows={2}
            className="w-full resize-none rounded-2xl border border-mitti-khaki bg-mitti-cream px-4 py-3 text-lg text-mitti-dark-brown outline-none focus:border-mitti-brown"
          />
          <div className="flex justify-end mt-1">
            <span className="text-sm text-mitti-dark-brown">
              {title.length}/{TITLE_MAX}
            </span>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-mitti-dark-brown mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) =>
              onChange({
                title,
                description: e.target.value.slice(0, DESCRIPTION_MAX),
              })
            }
            placeholder="Our home is located in a quiet village, surrounded by farms and greenery. Guests can enjoy fresh air, home-cooked food, and a slower pace of life."
            rows={6}
            className="w-full resize-none rounded-2xl border border-mitti-khaki bg-mitti-cream px-4 py-3 text-mitti-dark-brown outline-none focus:border-mitti-brown"
          />
          <div className="flex justify-end mt-1">
            <span className="text-sm text-mitti-dark-brown">
              {description.length}/{DESCRIPTION_MAX}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepAbout;
