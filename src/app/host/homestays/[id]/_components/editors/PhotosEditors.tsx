"use client";

import ImageUploader from "@/components/shared/ImageUploader";

type PhotosEditorProps = {
  images: string[];
  onChange: (images: string[]) => void;
};

const PhotosEditor = ({ images, onChange }: PhotosEditorProps) => {
  const hasEnoughPhotos = images.length >= 5;

  return (
    <section className="space-y-5">
      {/* Section header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-mitti-dark-brown">
            Photos
          </h2>
          <p className="text-sm text-mitti-dark-brown/70">
            Manage photos shown to guests. The first photo is used as the cover.
          </p>
        </div>

        <div
          className={`text-sm font-medium ${
            hasEnoughPhotos ? "text-mitti-olive" : "text-amber-700"
          }`}
        >
          {images.length} / 5 minimum
        </div>
      </div>

      {/* Uploader container */}
      <div className="rounded-2xl border border-mitti-khaki bg-white p-5">
        <ImageUploader max={12} value={images} onChange={onChange} />
      </div>

      {/* Helper hint */}
      <div className="text-sm text-mitti-dark-brown/70">
        Tip: Use bright, landscape photos. Reorder photos to choose your cover.
      </div>
    </section>
  );
};

export default PhotosEditor;
