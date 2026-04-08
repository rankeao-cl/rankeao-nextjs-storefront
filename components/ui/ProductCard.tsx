"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types/store";
import { formatPrice, getDiscountPercent } from "@/lib/utils/format";

interface Props {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: Props) {
  const [isAdding, setIsAdding] = useState(false);
  const name = product.name || product.title || "Producto";
  const imageUrl = product.image_url || product.images?.[0]?.url;
  const comparePrice = product.compare_at_price || product.compare_price;
  const discount = comparePrice
    ? getDiscountPercent(product.price || 0, comparePrice)
    : 0;
  const outOfStock = product.stock === 0 || product.in_stock === false;

  return (
    <div className="flex flex-col h-full text-center relative">
      {/* SALE badge - red circle top-right like bluecard */}
      {discount > 0 && (
        <span className="absolute top-2 right-2 z-10 bg-red-600 text-white text-[10px] font-bold w-10 h-10 rounded-full flex items-center justify-center shadow">
          -{discount}%
        </span>
      )}

      {/* Product image - clean, no border */}
      <Link href={`/producto/${product.id}`} className="block mb-3">
        <div className="relative aspect-square">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-contain p-2 hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
          )}
        </div>
      </Link>

      {/* Product name */}
      <Link href={`/producto/${product.id}`} className="block mb-2 px-1">
        <h3 className="text-xs font-medium text-gray-700 line-clamp-2 leading-snug hover:text-[var(--store-primary)] transition-colors">
          {name}
        </h3>
      </Link>

      {/* Price - like bluecard: compare price strikethrough + current price + discount % */}
      <div className="mt-auto px-1 mb-2">
        {comparePrice && comparePrice > (product.price || 0) ? (
          <>
            <p className="text-sm text-gray-400 line-through">
              {formatPrice(comparePrice, product.currency)}
            </p>
            <p className="text-base font-bold text-gray-900">
              {formatPrice(product.price, product.currency)}
            </p>
          </>
        ) : (
          <p className="text-base font-bold text-gray-900">
            {formatPrice(product.price, product.currency)}
          </p>
        )}
      </div>

      {/* Add to cart button - blue like bluecard */}
      <div className="px-1">
        {outOfStock ? (
          <span className="w-full flex items-center justify-center py-2 bg-gray-200 text-gray-500 text-xs font-semibold rounded">
            Agotado
          </span>
        ) : (
          <button
            onClick={async () => {
              if (isAdding) return;
              setIsAdding(true);
              try { await onAddToCart?.(product); } finally { setIsAdding(false); }
            }}
            disabled={isAdding}
            className="w-full flex items-center justify-center gap-1.5 py-2 bg-[var(--store-primary)] hover:brightness-110 text-white text-xs font-semibold rounded transition-all disabled:opacity-70"
          >
            {isAdding ? (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>
                Agregar
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
