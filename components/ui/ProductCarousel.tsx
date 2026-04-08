"use client";

import { useState } from "react";
import type { Product } from "@/lib/types/store";
import ProductCard from "./ProductCard";

interface Props {
  products: Product[];
  onAddToCart?: (product: Product) => void;
  itemsPerPage?: number;
}

export default function ProductCarousel({ products, onAddToCart, itemsPerPage = 5 }: Props) {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  function goNext() {
    setPage((p) => (p + 1) % totalPages);
  }

  function goPrev() {
    setPage((p) => (p - 1 + totalPages) % totalPages);
  }

  if (products.length === 0) return null;

  return (
    <div className="relative group/carousel">
      {/* Left arrow */}
      {totalPages > 1 && (
        <button
          onClick={goPrev}
          className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-600 hover:text-[var(--store-primary)] transition-colors opacity-0 group-hover/carousel:opacity-100"
          aria-label="Anterior"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
      )}

      {/* Right arrow */}
      {totalPages > 1 && (
        <button
          onClick={goNext}
          className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-600 hover:text-[var(--store-primary)] transition-colors opacity-0 group-hover/carousel:opacity-100"
          aria-label="Siguiente"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      )}

      {/* Products grid with slide animation */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${page * 100}%)` }}
        >
          {/* Render pages of products */}
          {Array.from({ length: totalPages }).map((_, pageIdx) => (
            <div key={pageIdx} className="w-full shrink-0 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 px-0.5">
              {products
                .slice(pageIdx * itemsPerPage, (pageIdx + 1) * itemsPerPage)
                .map((product) => (
                  <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
                ))}
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                i === page ? "bg-[var(--store-primary)] scale-125" : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Página ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
