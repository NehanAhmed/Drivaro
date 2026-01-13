'use client'
import { Button } from "@/components/ui/button";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { useState } from "react";

// Image Gallery Component (Client)
export const ImageGallery = ({ images }: { images: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => setCurrentIndex((i) => (i + 1) % images.length);
  const prev = () => setCurrentIndex((i) => (i - 1 + images.length) % images.length);

  return (
    <div className="space-y-4">
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-muted">
        <img
          src={images[currentIndex]}
          alt="Car"
          className="h-full w-full object-cover"
        />
        {images.length > 1 && (
          <>
            <Button
              onClick={prev}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-background/90 p-2 shadow-lg backdrop-blur-sm transition-colors hover:bg-background"
            >
              <IconChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              onClick={next}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-background/90 p-2 shadow-lg backdrop-blur-sm transition-colors hover:bg-background"
            >
              <IconChevronRight className="h-5 w-5" />
            </Button>
          </>
        )}
      </div>
      
      <div className="grid grid-cols-4 gap-3">
        {images.map((img, idx) => (
          <Button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`aspect-video overflow-hidden rounded-lg transition-all ${
              idx === currentIndex
                ? 'ring-2 ring-primary ring-offset-2'
                : 'opacity-60 hover:opacity-100'
            }`}
          >
            <img src={img} alt={`Thumbnail ${idx + 1}`} className="h-full w-full object-cover" />
          </Button>
        ))}
      </div>
    </div>
  );
}