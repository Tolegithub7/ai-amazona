"use client";
import { useState } from "react";
import Image from "next/image";

export default function ProductImageGallery({ images = [], name }: { images: string[]; name: string }) {
  const [selected, setSelected] = useState(0);
  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
        <span className="text-muted-foreground">No image</span>
      </div>
    );
  }
  return (
    <div>
      <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
        <Image
          src={images[selected]}
          alt={name}
          width={400}
          height={400}
          className="object-contain rounded-lg"
          priority
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 mt-2 justify-center">
          {images.map((img, idx) => (
            <button
              key={img + idx}
              onClick={() => setSelected(idx)}
              className={`border rounded-md p-1 bg-background ${selected === idx ? "border-primary ring-2 ring-primary" : "border-muted"}`}
              aria-label={`Show image ${idx + 1}`}
              type="button"
            >
              <Image
                src={img}
                alt={name + " thumbnail " + (idx + 1)}
                width={64}
                height={64}
                className="object-contain rounded"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 