'use client'
import { Button } from "@/components/ui/button";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import Image from "next/image";
import { useState, useCallback } from "react";

interface ImageGalleryProps {
  images: string[];
  alt?: string;
}

export const ImageGallery = ({ images, alt = "Car image" }: ImageGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = useCallback(() => {
    setCurrentIndex((i) => (i + 1) % images.length);
  }, [images.length]);

  const prev = useCallback(() => {
    setCurrentIndex((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  const goToImage = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Handle empty images array
  if (!images || images.length === 0) {
    return (
      <div className="space-y-4">
        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-muted flex items-center justify-center">
          <p className="text-muted-foreground">No images available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image Display */}
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-muted shadow-sm">
        <Image
          src={images[currentIndex]}
          alt={`${alt} - Image ${currentIndex + 1} of ${images.length}`}
          fill
          priority={currentIndex === 0}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
          className="object-cover"
          quality={90}
        />
        
        {/* Navigation Buttons - Only show if multiple images */}
        {images.length > 1 && (
          <>
            <Button
              onClick={prev}
              variant="secondary"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/90 shadow-lg backdrop-blur-sm transition-all hover:bg-background hover:scale-110"
              aria-label="Previous image"
            >
              <IconChevronLeft className="h-5 w-5" />
            </Button>
            
            <Button
              onClick={next}
              variant="secondary"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/90 shadow-lg backdrop-blur-sm transition-all hover:bg-background hover:scale-110"
              aria-label="Next image"
            >
              <IconChevronRight className="h-5 w-5" />
            </Button>

            {/* Image Counter */}
            <div className="absolute bottom-4 right-4 rounded-full bg-background/90 px-3 py-1.5 text-sm font-medium shadow-lg backdrop-blur-sm">
              {currentIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>
      
      {/* Thumbnail Grid - Only show if multiple images */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3 sm:gap-4">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => goToImage(idx)}
              className={`relative aspect-video overflow-hidden rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                idx === currentIndex
                  ? 'ring-2 ring-primary ring-offset-2 opacity-100'
                  : 'opacity-60 hover:opacity-100 hover:ring-2 hover:ring-muted-foreground/50'
              }`}
              aria-label={`View image ${idx + 1}`}
            >
              <Image
                src={img}
                alt={`${alt} thumbnail ${idx + 1}`}
                fill
                sizes="(max-width: 768px) 25vw, 200px"
                className="object-cover"
                quality={75}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}