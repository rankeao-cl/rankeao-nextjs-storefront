"use client";

import { useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  query: string;
  setQuery: (q: string) => void;
}

function IconX({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

export default function SearchOverlay({ isOpen, onClose, query, setQuery }: Props) {
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim()) {
        router.push(`/catalogo?q=${encodeURIComponent(query.trim())}`);
        onClose();
        setQuery("");
      }
    },
    [query, router, onClose, setQuery]
  );

  return (
    <div
      className={`
        fixed inset-0 z-[60] transition-all duration-300
        ${isOpen ? "visible opacity-100" : "invisible opacity-0 pointer-events-none"}
      `}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Search bar container */}
      <div
        className={`
          relative w-full bg-[var(--surface-solid-secondary)] shadow-2xl transition-transform duration-300
          ${isOpen ? "translate-y-0" : "-translate-y-full"}
        `}
      >
        <div className="max-w-3xl mx-auto px-4 py-6">
          <form onSubmit={handleSearch} className="flex items-center gap-3">
            <div className="flex-1 flex items-center bg-white rounded-lg overflow-hidden shadow-inner">
              <input
                ref={searchInputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar productos..."
                className="flex-1 px-4 py-3 text-gray-900 text-base placeholder:text-gray-400 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-[var(--store-primary)] hover:brightness-110 text-white px-5 py-3 transition-all font-medium text-sm"
                aria-label="Buscar"
              >
                Buscar
              </button>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors p-2"
              aria-label="Cerrar busqueda"
            >
              <IconX className="w-6 h-6" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
