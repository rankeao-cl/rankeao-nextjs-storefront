"use client";

import type { Product } from "@/lib/types/store";
import ProductGrid from "@/components/ui/ProductGrid";
import Link from "next/link";

interface Props {
  title: string;
  products: Product[];
  viewAllHref?: string;
  onAddToCart?: (product: Product) => void;
}

export default function ProductSection({ title, products, viewAllHref, onAddToCart }: Props) {
  if (products.length === 0) return null;

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="section-title">{title}</h2>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="text-sm text-[var(--store-primary)] hover:underline font-medium"
          >
            Ver todos
          </Link>
        )}
      </div>
      <ProductGrid products={products} onAddToCart={onAddToCart} />
    </section>
  );
}
