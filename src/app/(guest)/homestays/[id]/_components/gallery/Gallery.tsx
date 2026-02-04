"use client";

import { useState } from "react";
import GalleryGrid from "./GalleryGrid";
import GalleryModal from "./GalleryModal";

interface GalleryProps {
  images: string[];
  name: string;
}

export default function Gallery({ images, name }: GalleryProps) {
  const [open, setOpen] = useState(false);

  if (images.length === 0) return null;

  return (
    <>
      <GalleryGrid images={images} name={name} onOpen={() => setOpen(true)} />
      <GalleryModal
        open={open}
        onClose={() => setOpen(false)}
        images={images}
        name={name}
      />
    </>
  );
}
