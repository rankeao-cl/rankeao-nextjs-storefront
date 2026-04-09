"use client";

import { useRef } from "react";
import type { Product } from "@/lib/types/store";
import CalabozoProductCard from "./CalabozoProductCard";

interface Props {
  title: string;
  products: Product[];
  onAddToCart?: (product: Product) => void;
  viewAllLink?: string;
}

export default function CalabozoProductCarousel({ title, products, onAddToCart, viewAllLink }: Props) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  if (!products || products.length === 0) return null;

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({ 
        left: direction === "left" ? -scrollAmount : scrollAmount, 
        behavior: "smooth" 
      });
    }
  };

  return (
    <div className="w-full font-sans mb-12">
      <div className="flex justify-between items-end mb-6 border-b-2 border-black pb-2 px-4 md:px-0 mx-auto max-w-7xl">
        <h2 className="text-2xl font-black uppercase text-black">
          {title}
        </h2>
        {viewAllLink && (
          <a href={viewAllLink} className="text-sm font-bold text-[#A00000] hover:underline uppercase">
            Ver Todos
          </a>
        )}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-0 group">
        
        {/* Left Arrow */}
        <button 
          onClick={() => scroll("left")}
          className="absolute left-2 md:-left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 border border-gray-200 shadow-md rounded-full p-2 text-black hover:bg-black hover:text-white transition-all opacity-0 invisible group-hover:opacity-100 group-hover:visible"
          aria-label="Anterior"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>

        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-4 pb-6 snap-x hide-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => (
            <div 
              key={product.id} 
              className="flex-none w-[240px] md:w-[280px] snap-start"
            >
              <CalabozoProductCard product={product} onAddToCart={onAddToCart} />
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button 
          onClick={() => scroll("right")}
          className="absolute right-2 md:-right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 border border-gray-200 shadow-md rounded-full p-2 text-black hover:bg-black hover:text-white transition-all opacity-0 invisible group-hover:opacity-100 group-hover:visible"
          aria-label="Siguiente"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>

      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </div>
  );
}
