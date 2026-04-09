"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "@/lib/types/store";
import { formatPrice, getDiscountPercent } from "@/lib/utils/format";

interface Props {
  product: Product;
  onAddToCart?: (product: Product) => void;
  priority?: boolean;
}

export default function CalabozoProductCard({ product, onAddToCart, priority = false }: Props) {
  const [isAdding, setIsAdding] = useState(false);
  
  const name = product.name || product.title || "Producto";
  const imageUrl = product.image_url || product.images?.[0]?.url;
  const comparePrice = product.compare_at_price || product.compare_price;
  const discount = comparePrice
    ? getDiscountPercent(product.price || 0, comparePrice)
    : 0;
  const outOfStock = product.stock === 0 || product.in_stock === false;

  return (
    <article className="group flex flex-col h-full bg-white rounded-md border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Product image container */}
      <Link href={`/producto/${product.id}`} className="relative block select-none">
        <div className="relative aspect-square flex items-center justify-center p-4 bg-white pointer-events-none">
          {/* Discount badge - Calabozo Red */}
          {discount > 0 && (
            <span className="absolute top-2 left-2 z-10 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm bg-[#A00000]">
              -{discount}%
            </span>
          )}

          {/* Out of stock overlay */}
          {outOfStock && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 backdrop-blur-[1px]">
              <span className="text-xs font-bold text-gray-800 bg-gray-200 px-3 py-1 rounded-sm border border-gray-300">
                Agotado
              </span>
            </div>
          )}

          {/* Product Image */}
          <div className="relative w-full h-full transition-transform duration-500 group-hover:scale-105">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={name}
                fill
                className="object-contain"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                priority={priority}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
        </div>
      </Link>

      {/* Product info */}
      <div className="flex flex-col flex-1 p-4 bg-white border-t border-gray-100">
        <Link href={`/producto/${product.id}`} className="block flex-1 mb-3">
          <h3 className="text-sm font-bold uppercase line-clamp-2 text-[#A00000] hover:text-red-700 transition-colors">
            {name}
          </h3>
        </Link>

        {/* Price section */}
        <div className="mb-4">
          {comparePrice && comparePrice > (product.price || 0) ? (
            <div className="flex flex-col">
              <span className="text-xs line-through text-gray-400 font-medium">
                {formatPrice(comparePrice, product.currency)}
              </span>
              <span className="text-lg font-black text-black">
                {formatPrice(product.price, product.currency)}
              </span>
            </div>
          ) : (
            <span className="text-lg font-black text-black">
              {formatPrice(product.price, product.currency)}
            </span>
          )}
        </div>

        {/* Dual Actions */}
        <div className="flex gap-2 mt-auto">
            <Link 
                href={`/producto/${product.id}`}
                className="flex-1 flex items-center justify-center border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 text-xs font-bold uppercase rounded-sm py-2 transition-colors"
            >
                Ver
            </Link>
          {!outOfStock && onAddToCart && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (isAdding) return;
                setIsAdding(true);
                Promise.resolve(onAddToCart(product)).finally(() => setIsAdding(false));
              }}
              disabled={isAdding}
              className="flex-1 flex items-center justify-center bg-[#A00000] hover:bg-red-800 text-white text-xs font-bold uppercase rounded-sm py-2 transition-colors disabled:opacity-70"
            >
              {isAdding ? "..." : "Agregar"}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
