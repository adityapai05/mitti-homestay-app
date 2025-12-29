"use client";

type DescriptionEditorProps = {
  value: string;
  onChange: (description: string) => void;
};

const DESCRIPTION_MAX = 500;

const DescriptionEditor = ({
  value,
  onChange,
}: DescriptionEditorProps) => {
  return (
    <section className="space-y-4">
      {/* Section header */}
      <div>
        <h2 className="text-lg font-semibold text-mitti-dark-brown">
          Description
        </h2>
        <p className="text-sm text-mitti-dark-brown/70">
          Help guests imagine their stay. Share the atmosphere, surroundings,
          and what makes your place special.
        </p>
      </div>

      {/* Editor */}
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) =>
            onChange(e.target.value.slice(0, DESCRIPTION_MAX))
          }
          placeholder="Our home is located in a quiet village surrounded by farms and greenery. Guests wake up to birds, fresh air, and a slower pace of life..."
          rows={8}
          className="
            w-full resize-none rounded-xl
            border border-mitti-khaki
            bg-white px-4 py-3
            text-sm sm:text-base text-mitti-dark-brown
            outline-none transition
            focus:border-mitti-brown
            hover:border-mitti-brown
            cursor-text
          "
        />

        {/* Character counter */}
        <div className="absolute bottom-2 right-3 text-xs text-mitti-dark-brown/60">
          {value.length}/{DESCRIPTION_MAX}
        </div>
      </div>

      {/* Writing guidance */}
      <div className="text-sm text-mitti-dark-brown/70 space-y-1">
        <p>Good descriptions usually include:</p>
        <ul className="list-disc list-inside">
          <li>What the surroundings feel like</li>
          <li>Who the place is ideal for</li>
          <li>Any unique experiences guests can expect</li>
        </ul>
      </div>
    </section>
  );
};

export default DescriptionEditor;
