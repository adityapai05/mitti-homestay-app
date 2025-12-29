"use client";

import ImageUploader from "@/components/shared/ImageUploader";

type Props = {
  value?: string[];
  onChange: (value: string[]) => void;
};

const StepPhotos = ({ value = [], onChange }: Props) => {
  const hasEnoughPhotos = value.length >= 5;

  return (
    <div className="w-full mt-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl font-semibold text-mitti-dark-brown">
            Add photos of your place
          </h1>
          <p className="mt-2 text-mitti-dark-brown">
            Upload at least 5 photos. Clear photos help guests understand your
            space better.
          </p>
        </div>

        {/* Image uploader */}
        <div className="bg-mitti-cream border border-mitti-khaki rounded-2xl p-6">
          <ImageUploader max={12} value={value} onChange={onChange} />
        </div>

        {/* Validation hint */}
        {!hasEnoughPhotos && (
          <p className="mt-4 text-sm text-mitti-dark-brown">
            Please upload at least 5 photos to continue.
          </p>
        )}

        {hasEnoughPhotos && (
          <p className="mt-4 text-sm text-mitti-dark-brown">
            Great! You have added enough photos.
          </p>
        )}
      </div>
    </div>
  );
};

export default StepPhotos;
