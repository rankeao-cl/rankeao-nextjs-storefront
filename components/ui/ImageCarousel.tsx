"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { CarouselSlide } from "@/lib/types/tenant";

interface Props {
  slides: CarouselSlide[];
  autoplay?: boolean;
  interval?: number;
  heightClass?: string;
}

export default function ImageCarousel({ slides, autoplay = true, interval = 6000, heightClass = "h-[100svh]" }: Props) {
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

  const variants = {
    enter: (_dir: number) => ({
      opacity: 0,
      scale: 1.04,
    }),
    center: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
    },
    exit: (_dir: number) => ({
      opacity: 0,
      scale: 0.98,
      transition: { duration: 0.5, ease: "easeIn" as const },
    }),
  };

  return (
    <div
      className="relative w-full overflow-hidden group"
      style={{ background: "var(--background)" }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Hero container — height controlled by prop */}
      <div className={`relative w-full ${heightClass}`}>
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
            

          </motion.div>
        </AnimatePresence>

        {/* Slide content overlay */}
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
                      className="hero-title text-balance"
                    >
                      {currentSlide.title}
                    </h2>
                  )}
                  {currentSlide.subtitle && (
                    <p className="hero-subtitle">
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

      {/* Navigation */}
      {slides.length > 1 && (
        <>
          {/* Arrow buttons — appear on hover */}
          <button
            onClick={prev}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100"
            style={{ 
              background: "var(--surface-solid)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.08)"
            }}
            aria-label="Anterior"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} style={{ color: "var(--foreground)" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={next}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100"
            style={{ 
              background: "var(--surface-solid)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.08)"
            }}
            aria-label="Siguiente"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} style={{ color: "var(--foreground)" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Line indicators — Apple style */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setDirection(i > current ? 1 : -1);
                  setCurrent(i);
                }}
                className="relative h-[3px] rounded-full transition-all duration-500 ease-out"
                style={{ 
                  width: i === current ? "32px" : "14px",
                  background: i === current ? "var(--foreground)" : "var(--muted)",
                  opacity: i === current ? 0.9 : 0.3,
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
