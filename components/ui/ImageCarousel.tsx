"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { CarouselSlide } from "@/lib/types/tenant";

interface Props {
  slides: CarouselSlide[];
  autoplay?: boolean;
  interval?: number;
}

export default function ImageCarousel({ slides, autoplay = true, interval = 5000 }: Props) {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (!autoplay || slides.length <= 1) return;
    const timer = setInterval(next, interval);
    return () => clearInterval(timer);
  }, [autoplay, interval, next, slides.length]);

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function handleTouchMove(e: React.TouchEvent) {
    touchEndX.current = e.touches[0].clientX;
  }
  function handleTouchEnd() {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); }
  }

  if (slides.length === 0) return null;

  return (
    <div
      className="relative w-full overflow-hidden bg-black"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides - like Owl Carousel: translate3d, image width:100% height:auto */}
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, i) => {
          const img = (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={slide.image_url}
              alt={slide.alt_text || ""}
              className="w-full block min-h-[75vh] md:min-h-screen object-cover"
              loading={i === 0 ? "eager" : "lazy"}
            />
          );

          return (
            <div key={i} className="w-full shrink-0">
              {slide.link_url ? (
                <a href={slide.link_url}>{img}</a>
              ) : (
                img
              )}
            </div>
          );
        })}
      </div>

      {/* Nav arrows - like Owl Carousel ‹ › */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-0 top-0 bottom-0 w-12 md:w-16 z-10 flex items-center justify-center text-white text-3xl md:text-4xl opacity-60"
            aria-label="Previous"
          >
            ‹
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-0 bottom-0 w-12 md:w-16 z-10 flex items-center justify-center text-white text-3xl md:text-4xl opacity-60"
            aria-label="Next"
          >
            ›
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-3 h-3 rounded-full border-2 border-white transition-all ${
                  i === current ? "bg-white" : "bg-transparent hover:bg-white/50"
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
