"use client";

import Link from "next/link";
import type { Product } from "@/lib/types/store";
import ProductCard from "./ProductCard";

interface Props {
  products: Product[];
  onAddToCart?: (product: Product) => void;
}

export default function ProductGrid({ products, onAddToCart }: Props) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <svg className="w-16 h-16 text-muted mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <h3 className="text-lg font-bold text-foreground mb-2">No se encontraron productos</h3>
        <p className="text-muted text-sm mb-6 max-w-md mx-auto">
          Intenta buscar con otros terminos o explora nuestro catalogo completo
        </p>
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {["Magic", "Pokemon", "Yu-Gi-Oh!", "Sleeves", "Booster"].map((term) => (
            <Link
              key={term}
              href={`/catalogo?q=${encodeURIComponent(term)}`}
              className="text-sm bg-[var(--surface)] text-foreground px-4 py-2 rounded-full hover:bg-[var(--surface-secondary)] transition-colors"
            >
              {term}
            </Link>
          ))}
        </div>
        <Link href="/catalogo" className="text-[var(--store-primary)] hover:underline text-sm font-medium">
          Ver todo el catalogo
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
}
