"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { CategoryTile as CategoryTileType } from "@/lib/types/tenant";
import { useRef } from "react";

interface Props {
  tile: CategoryTileType;
}

export default function CategoryTile({ tile }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  
  // Mouse position tracking for subtle 3D effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["2deg", "-2deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-2deg", "2deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <Link
      ref={ref}
      href={tile.link_url || "/catalogo"}
      className="block"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="relative aspect-[4/3] rounded-2xl overflow-hidden"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          boxShadow: "0 10px 30px -10px rgba(0,0,0,0.15)",
        }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Background Image */}
        <Image
          src={tile.image_url}
          alt={tile.title || "Categoria"}
          fill
          className="object-cover transition-transform duration-700 ease-out"
          sizes="(max-width: 640px) 100vw, 33vw"
        />
        
        {/* Gradient overlay */}
        <div 
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 40%, transparent 100%)"
          }}
        />

        {/* Content */}
        {tile.title && (
          <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-6">
            <motion.span 
              className="text-white font-semibold text-base md:text-lg"
              initial={{ y: 10, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              {tile.title}
            </motion.span>
            <motion.span
              className="inline-flex items-center gap-1 text-white/80 text-sm mt-1 link-arrow"
              initial={{ y: 10, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              Explorar
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </motion.span>
          </div>
        )}
      </motion.div>
    </Link>
  );
}
