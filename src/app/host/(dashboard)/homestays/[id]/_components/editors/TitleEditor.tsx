"use client";

type TitleEditorProps = {
  value: string;
  onChange: (title: string) => void;
};

const TITLE_MAX = 50;

const TitleEditor = ({ value, onChange }: TitleEditorProps) => {
  return (
    <section className="space-y-4">
      {/* Section header */}
      <div>
        <h2 className="text-lg font-semibold text-mitti-dark-brown">Title</h2>
        <p className="text-sm text-mitti-dark-brown/70">
          A short, clear title helps guests quickly understand your place.
        </p>
      </div>

      {/* Input */}
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, TITLE_MAX))}
          placeholder="A peaceful village home surrounded by fields"
          rows={2}
          className="
            w-full resize-none rounded-xl
            border border-mitti-khaki
            bg-white px-4 py-3
            text-base text-mitti-dark-brown
            outline-none transition
            focus:border-mitti-brown
            hover:border-mitti-brown
            cursor-text
          "
        />

        {/* Counter */}
        <div className="absolute bottom-2 right-3 text-xs text-mitti-dark-brown/60">
          {value.length}/{TITLE_MAX}
        </div>
      </div>

      {/* Helper */}
      <div className="text-sm text-mitti-dark-brown/70">
        Tip: Mention what makes your place special - location, vibe, or
        experience.
      </div>
    </section>
  );
};

export default TitleEditor;
