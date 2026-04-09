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

export default function ProductCard({ product, onAddToCart, priority = false }: Props) {
  const [isAdding, setIsAdding] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const name = product.name || product.title || "Producto";
  const imageUrl = product.image_url || product.images?.[0]?.url;
  const comparePrice = product.compare_at_price || product.compare_price;
  const discount = comparePrice
    ? getDiscountPercent(product.price || 0, comparePrice)
    : 0;
  const outOfStock = product.stock === 0 || product.in_stock === false;

  return (
    <motion.article
      className="group flex flex-col h-full"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Product image container */}
      <Link href={`/producto/${product.id}`} className="relative block select-none">
        <motion.div
           className="relative aspect-[4/3] rounded-2xl flex items-center justify-center pointer-events-none"
           style={{ 
             background: "var(--surface-solid)",
             overflow: "hidden" 
           }}
          animate={{
            boxShadow: isHovered
              ? "0 16px 48px -12px rgba(0,0,0,0.12)"
              : "var(--shadow-card)",
          }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Discount badge - Apple red, top-left */}
          {discount > 0 && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-3 left-3 z-10 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full"
              style={{ background: "#ff3b30" }}
            >
              -{discount}%
            </motion.span>
          )}

          {/* Out of stock overlay */}
          {outOfStock && (
            <div className="absolute inset-0 z-10 flex items-center justify-center backdrop-blur-sm" style={{ background: "rgba(255,255,255,0.8)" }}>
              <span 
                className="text-xs font-medium uppercase tracking-widest"
                style={{ color: "var(--muted)" }}
              >
                Agotado
              </span>
            </div>
          )}

          {/* Product Image */}
          <motion.div
            className="relative w-full h-full p-4"
            animate={{ scale: isHovered ? 1.06 : 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
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
              <div className="w-full h-full flex items-center justify-center" style={{ color: "var(--muted)" }}>
                <svg className="w-12 h-12 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </motion.div>

          {/* Quick add button - pill shape, centered, appears on hover */}
          {!outOfStock && onAddToCart && (
            <motion.div
              className="absolute bottom-3 left-3 right-3 z-20 flex justify-center pointer-events-auto"
              initial={{ opacity: 0, y: 10 }}
              animate={{ 
                opacity: isHovered ? 1 : 0, 
                y: isHovered ? 0 : 10 
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (isAdding) return;
                  setIsAdding(true);
                  Promise.resolve(onAddToCart(product)).finally(() => setIsAdding(false));
                }}
                disabled={isAdding}
                className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-full font-medium text-sm transition-all disabled:opacity-70"
                style={{ 
                  background: "var(--foreground)", 
                  color: "var(--background)",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.15)"
                }}
              >
                {isAdding ? (
                  <motion.svg
                    className="w-4 h-4"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </motion.svg>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Agregar
                  </>
                )}
              </button>
            </motion.div>
          )}
        </motion.div>
      </Link>

      {/* Product info - clean and minimal */}
      <div className="flex flex-col flex-1 pt-3.5 px-0.5">
        {/* Product name */}
        <Link href={`/producto/${product.id}`} className="block">
          <h3 
            className="text-sm font-medium line-clamp-2 leading-snug transition-colors duration-200"
            style={{ color: "var(--foreground)" }}
          >
            {name}
          </h3>
        </Link>

        {/* Price section */}
        <div className="mt-1.5">
          {comparePrice && comparePrice > (product.price || 0) ? (
            <div className="flex items-baseline gap-2">
              <span 
                className="text-base font-bold"
                style={{ color: "var(--foreground)" }}
              >
                {formatPrice(product.price, product.currency)}
              </span>
              <span 
                className="text-xs line-through"
                style={{ color: "var(--muted)" }}
              >
                {formatPrice(comparePrice, product.currency)}
              </span>
            </div>
          ) : (
            <span 
              className="text-base font-bold"
              style={{ color: "var(--foreground)" }}
            >
              {formatPrice(product.price, product.currency)}
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}
