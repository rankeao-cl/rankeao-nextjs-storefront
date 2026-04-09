"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import type { Product } from "@/lib/types/store";
import ProductCard from "./ProductCard";

interface Props {
  products: Product[];
  onAddToCart?: (product: Product) => void;
  title?: string;
  subtitle?: string;
  viewAllLink?: string;
}

export default function ProductCarousel({ 
  products, 
  onAddToCart, 
  title, 
  subtitle,
  viewAllLink 
}: Props) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollability = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 10
      );
    }
  };

  useEffect(() => {
    checkScrollability();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScrollability);
      window.addEventListener("resize", checkScrollability);
      return () => {
        container.removeEventListener("scroll", checkScrollability);
        window.removeEventListener("resize", checkScrollability);
      };
    }
  }, [products]);

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (container) {
      const cardWidth = container.querySelector("article")?.parentElement?.offsetWidth || 200;
      const scrollAmount = cardWidth * 2 + 24;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (products.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="relative"
    >
      {/* Section header */}
      {(title || viewAllLink) && (
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            {title && (
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="section-title text-balance"
              >
                {title}
              </motion.h2>
            )}
            {subtitle && (
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="section-subtitle mt-2"
              >
                {subtitle}
              </motion.p>
            )}
          </div>
          {viewAllLink && (
            <motion.a
              href={viewAllLink}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="link-arrow shrink-0 text-sm"
            >
              Ver todo
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </motion.a>
          )}
        </div>
      )}

      {/* Carousel container */}
      <div className="relative group/carousel">
        {/* Navigation arrows */}
        <motion.button
          onClick={() => scroll("left")}
          disabled={!canScrollLeft}
          initial={{ opacity: 0 }}
          animate={{ opacity: canScrollLeft ? 1 : 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="absolute -left-4 md:-left-6 top-[40%] -translate-y-1/2 z-10 w-12 h-12 rounded-full flex items-center justify-center transition-colors hidden md:flex"
          style={{ 
            background: "var(--surface-solid)",
            color: "var(--foreground)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            pointerEvents: canScrollLeft ? "auto" : "none"
          }}
          aria-label="Anterior"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </motion.button>

        <motion.button
          onClick={() => scroll("right")}
          disabled={!canScrollRight}
          initial={{ opacity: 0 }}
          animate={{ opacity: canScrollRight ? 1 : 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="absolute -right-4 md:-right-6 top-[40%] -translate-y-1/2 z-10 w-12 h-12 rounded-full flex items-center justify-center transition-colors hidden md:flex"
          style={{ 
            background: "var(--surface-solid)",
            color: "var(--foreground)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            pointerEvents: canScrollRight ? "auto" : "none"
          }}
          aria-label="Siguiente"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </motion.button>

        {/* Scrollable product list */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 md:gap-6 overflow-x-auto scroll-smooth pb-4 -mx-1 px-1 snap-x snap-mandatory no-scrollbar"
        >
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                duration: 0.5, 
                delay: Math.min(index * 0.05, 0.3),
                ease: [0.22, 1, 0.36, 1] 
              }}
              className="w-[calc(50%-8px)] sm:w-[calc(33.333%-16px)] md:w-[calc(25%-18px)] lg:w-[calc(20%-19px)] flex-shrink-0 snap-start"
            >
              <ProductCard 
                product={product} 
                onAddToCart={onAddToCart}
                priority={index < 4}
              />
            </motion.div>
          ))}
        </div>

        {/* Mobile scroll gradients */}
        <div 
          className="absolute right-0 top-0 bottom-4 w-16 pointer-events-none md:hidden transition-opacity duration-300"
          style={{ 
            background: "linear-gradient(to left, var(--background), transparent)",
            opacity: canScrollRight ? 1 : 0
          }}
        />
        <div 
          className="absolute left-0 top-0 bottom-4 w-16 pointer-events-none md:hidden transition-opacity duration-300"
          style={{ 
            background: "linear-gradient(to right, var(--background), transparent)",
            opacity: canScrollLeft ? 1 : 0
          }}
        />
      </div>
    </motion.section>
  );
}
