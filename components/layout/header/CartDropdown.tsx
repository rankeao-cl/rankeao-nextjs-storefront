"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { useCartStore } from "@/lib/stores/cart-store";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

function IconBag({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
      />
    </svg>
  );
}

export default function CartDropdown({ isOpen, onClose }: Props) {
  const itemCount = useCartStore((s) => s.itemCount);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div ref={dropdownRef} className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
          <IconBag className="w-4 h-4" />
          Carrito de Compras
        </h3>
      </div>
      <div className="p-4">
        {itemCount === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">Tu carrito esta vacio</p>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              {itemCount} {itemCount === 1 ? "producto" : "productos"} en tu carrito
            </p>
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <span className="font-semibold text-gray-900 text-sm">Subtotal</span>
              <span className="font-semibold text-gray-900 text-sm">--</span>
            </div>
          </div>
        )}
      </div>
      <div className="p-4 bg-gray-50 border-t border-gray-100">
        <Link
          href="/carrito"
          onClick={onClose}
          className="block w-full text-center bg-[var(--store-primary)] hover:brightness-110 text-white text-sm font-semibold py-2.5 px-4 rounded-lg transition-all"
        >
          Ver carrito
        </Link>
      </div>
    </div>
  );
}
