"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { CarouselSlide } from "@/lib/types/tenant";

interface Props {
  slides: CarouselSlide[];
  autoplay?: boolean;
  interval?: number;
}

export default function ImageCarousel({ slides, autoplay = true, interval = 6000 }: Props) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const paginate = useCallback((newDirection: number) => {
    setDirection(newDirection);
    setCurrent((c) => {
      if (newDirection === 1) return (c + 1) % slides.length;
      return (c - 1 + slides.length) % slides.length;
    });
  }, [slides.length]);

  const next = useCallback(() => paginate(1), [paginate]);
  const prev = useCallback(() => paginate(-1), [paginate]);

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

  const currentSlide = slides[current];

  // Crossfade animation variants
  const variants = {
    enter: (dir: number) => ({
      opacity: 0,
      scale: 1.05,
      x: dir > 0 ? 20 : -20,
    }),
    center: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
    exit: (dir: number) => ({
      opacity: 0,
      scale: 0.98,
      x: dir > 0 ? -20 : 20,
      transition: { duration: 0.5, ease: "easeIn" },
    }),
  };

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ background: "var(--background)" }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Hero container with aspect ratio */}
      <div className="relative w-full min-h-[60vh] md:min-h-[80vh]">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={current}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0"
          >
            {currentSlide.link_url ? (
              <a href={currentSlide.link_url} className="block w-full h-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentSlide.image_url}
                  alt={currentSlide.alt_text || ""}
                  className="w-full h-full object-cover"
                />
              </a>
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={currentSlide.image_url}
                alt={currentSlide.alt_text || ""}
                className="w-full h-full object-cover"
              />
            )}
            
            {/* Gradient overlay for text readability */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(to top, var(--background) 0%, transparent 40%)"
              }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Slide content overlay - if slide has title/subtitle */}
        {(currentSlide.title || currentSlide.subtitle) && (
          <div className="absolute inset-0 flex items-end z-10 pointer-events-none">
            <div className="store-container w-full pb-20 md:pb-28">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`content-${current}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="max-w-2xl"
                >
                  {currentSlide.title && (
                    <h2 
                      className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance"
                      style={{ color: "var(--foreground)" }}
                    >
                      {currentSlide.title}
                    </h2>
                  )}
                  {currentSlide.subtitle && (
                    <p 
                      className="mt-4 text-lg md:text-xl max-w-lg"
                      style={{ color: "var(--muted)" }}
                    >
                      {currentSlide.subtitle}
                    </p>
                  )}
                  {currentSlide.link_url && currentSlide.link_text && (
                    <a 
                      href={currentSlide.link_url}
                      className="inline-flex items-center gap-2 mt-6 text-base font-medium pointer-events-auto link-arrow"
                      style={{ color: "var(--store-primary)" }}
                    >
                      {currentSlide.link_text}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      {/* Navigation - minimal Apple style */}
      {slides.length > 1 && (
        <>
          {/* Arrow buttons - only visible on hover/focus */}
          <button
            onClick={prev}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full flex items-center justify-center transition-all opacity-0 hover:opacity-100 focus:opacity-100 group-hover:opacity-100"
            style={{ 
              background: "var(--surface-solid)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            }}
            aria-label="Anterior"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} style={{ color: "var(--foreground)" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={next}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full flex items-center justify-center transition-all opacity-0 hover:opacity-100 focus:opacity-100 group-hover:opacity-100"
            style={{ 
              background: "var(--surface-solid)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            }}
            aria-label="Siguiente"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} style={{ color: "var(--foreground)" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Progress dots - minimal style */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setDirection(i > current ? 1 : -1);
                  setCurrent(i);
                }}
                className="relative w-2 h-2 rounded-full transition-all duration-300"
                style={{ 
                  background: i === current ? "var(--foreground)" : "var(--muted)",
                  opacity: i === current ? 1 : 0.4,
                  transform: i === current ? "scale(1.2)" : "scale(1)"
                }}
                aria-label={`Ir a slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
