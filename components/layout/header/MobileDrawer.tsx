"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTenant } from "@/context/TenantContext";
import { useAuthStore } from "@/lib/stores/auth-store";
import type { MenuItem } from "./menu-types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
}

function IconArrowLeft({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
  );
}

function IconChevronDown({ className = "w-3 h-3" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  );
}

function IconSearch({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  );
}

function IconUser({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
      />
    </svg>
  );
}

export default function MobileDrawer({ isOpen, onClose, menuItems }: Props) {
  const tenant = useTenant();
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [query, setQuery] = useState("");

  const logoSrc = tenant.logo_url || "/assets/logos/LogoSuperior.png";

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim()) {
        router.push(`/catalogo?q=${encodeURIComponent(query.trim())}`);
        onClose();
        setQuery("");
      }
    },
    [query, router, onClose]
  );

  function toggleSubMenu(index: number) {
    setExpandedIndex((prev) => (prev === index ? null : index));
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`
          fixed inset-0 z-[70] bg-black/50 transition-opacity duration-300 lg:hidden
          ${isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}
        `}
        onClick={onClose}
      />

      {/* Slide panel */}
      <div
        className={`
          fixed top-0 left-0 bottom-0 z-[80] w-[85vw] max-w-sm bg-[var(--surface-solid)] shadow-2xl
          transform transition-transform duration-300 ease-out lg:hidden overflow-y-auto
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Close header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors text-sm font-medium"
          >
            <IconArrowLeft className="w-4 h-4" />
            Cerrar Menu
          </button>
          <Link href="/" onClick={onClose} className="shrink-0">
            <Image
              src={logoSrc}
              alt={tenant.name}
              width={60}
              height={30}
              className="h-7 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Mobile search */}
        <div className="p-4 border-b border-[var(--border)]">
          <form onSubmit={handleSearch} className="flex rounded-lg overflow-hidden">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar productos..."
              className="flex-1 bg-[var(--surface)] text-[var(--foreground)] placeholder:text-[var(--muted)] px-3 py-2.5 text-sm focus:outline-none transition-colors"
            />
            <button
              type="submit"
              className="bg-[var(--store-primary)] hover:brightness-110 text-white px-4 transition-all"
              aria-label="Buscar"
            >
              <IconSearch className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Mobile menu items */}
        <nav className="p-4 space-y-0">
          {menuItems.map((item, idx) => {
            const hasChildren =
              (item.type === "mega" && item.columns && item.columns.length > 0) ||
              (item.type === "dropdown" && item.items && item.items.length > 0);

            const isExpanded = expandedIndex === idx;

            return (
              <div key={idx} className="border-b border-[var(--border)]/50 last:border-b-0">
                {hasChildren ? (
                  <>
                    <button
                      onClick={() => toggleSubMenu(idx)}
                      className="flex items-center justify-between w-full py-3 text-sm font-semibold text-[var(--foreground)] hover:text-[var(--store-primary)] transition-colors"
                    >
                      <span>{item.label}</span>
                      <IconChevronDown
                        className={`w-4 h-4 opacity-60 transition-transform duration-200 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <div
                      className={`overflow-hidden transition-all duration-300 ease-out ${
                        isExpanded ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      {item.type === "mega" &&
                        item.columns?.map((col) => (
                          <div key={col.title} className="mb-3">
                            <p className="pl-4 py-1.5 text-xs font-bold text-[var(--muted)] uppercase tracking-wider">
                              {col.title}
                            </p>
                            {col.items.map((sub) => (
                              <Link
                                key={sub.name}
                                href={sub.href}
                                onClick={onClose}
                                className="block pl-8 py-1.5 text-sm text-[var(--muted)] hover:text-[var(--store-primary)] transition-colors"
                              >
                                {sub.name}
                              </Link>
                            ))}
                          </div>
                        ))}

                      {item.type === "dropdown" &&
                        item.items?.map((sub) => (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            onClick={onClose}
                            className="block pl-6 py-2 text-sm text-[var(--muted)] hover:text-[var(--store-primary)] transition-colors"
                          >
                            {sub.name}
                          </Link>
                        ))}
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="block py-3 text-sm font-semibold text-[var(--foreground)] hover:text-[var(--store-primary)] transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            );
          })}
        </nav>

        {/* Mobile menu footer links */}
        <div className="p-4 mt-2 border-t border-[var(--border)] space-y-1">
          <Link
            href={isAuthenticated() ? "/cuenta" : "/login"}
            onClick={onClose}
            className="flex items-center gap-3 py-2.5 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            <IconUser className="w-4 h-4" />
            {isAuthenticated() ? "Mi Cuenta" : "Iniciar Sesion"}
          </Link>
          <Link
            href="/nosotros"
            onClick={onClose}
            className="block py-2.5 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            Sobre nosotros
          </Link>
          <Link
            href="/terminos"
            onClick={onClose}
            className="block py-2.5 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            Terminos de uso
          </Link>
        </div>
      </div>
    </>
  );
}
