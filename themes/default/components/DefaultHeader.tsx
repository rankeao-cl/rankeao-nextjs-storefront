"use client";

import Link from "next/link";
import Image from "next/image";
import { useTenant } from "@/context/TenantContext";
import { useCartStore } from "@/lib/stores/cart-store";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function DefaultHeader() {
  const tenant = useTenant();
  const itemCount = useCartStore((s) => s.itemCount);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const logoSrc = tenant.logo_url || "/assets/logos/LogoSuperior.png";

  const navLinks = [
    { label: "Inicio", href: "/" },
    { label: "Catálogo", href: "/catalogo" },
    { label: "Torneos", href: "/torneos" },
    { label: "Nosotros", href: "/nosotros" },
  ];

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/catalogo?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full shadow-lg" style={{ background: "var(--surface-solid)", color: "var(--foreground)" }}>
        {/* Accent line using tenant primary color */}
        <div className="h-[3px] w-full" style={{ background: "var(--store-primary)" }} />
        
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16 md:h-[72px]">
            
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Image
                src={logoSrc}
                alt={tenant.name}
                width={180}
                height={60}
                className="h-9 md:h-11 w-auto object-contain"
                priority
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-2 rounded-lg text-[13px] font-semibold tracking-wide transition-all duration-200 ${
                      isActive
                        ? "bg-foreground/10 text-foreground"
                        : "text-muted hover:text-foreground hover:bg-foreground/5"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <form onSubmit={handleSearch} className="hidden md:flex items-center">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar productos..."
                    className="w-48 lg:w-56 h-9 pl-9 pr-3 rounded-lg text-sm outline-none transition-all"
                    style={{ background: "color-mix(in srgb, var(--foreground) 8%, transparent)", border: "1px solid color-mix(in srgb, var(--foreground) 10%, transparent)", color: "var(--foreground)" }}
                  />
                  <svg className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </form>

              {/* Account */}
              <Link
                href={isAuthenticated() ? "/cuenta" : "/login"}
                className="hidden sm:flex items-center justify-center w-9 h-9 rounded-lg text-muted hover:text-foreground hover:bg-foreground/10 transition-all"
                aria-label="Mi cuenta"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </Link>

              {/* Cart */}
              <Link
                href="/carrito"
                className="relative flex items-center justify-center w-9 h-9 rounded-lg text-muted hover:text-foreground hover:bg-foreground/10 transition-all"
                aria-label="Carrito"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1" style={{ background: "var(--store-primary)" }}>
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                )}
              </Link>

              {/* Mobile hamburger */}
              <button
                className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg text-muted hover:text-foreground hover:bg-foreground/10 transition-all"
                onClick={() => setMobileOpen(true)}
                aria-label="Menú"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-72 shadow-2xl flex flex-col animate-slide-in" style={{ background: "var(--surface-solid)", color: "var(--foreground)" }}>
            <div className="flex items-center justify-between p-4 border-b border-border">
              <span className="text-sm font-bold" style={{ color: "var(--foreground)" }}>Menú</span>
              <button onClick={() => setMobileOpen(false)} className="text-muted hover:text-foreground">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            {/* Mobile search */}
            <form onSubmit={(e) => { handleSearch(e); setMobileOpen(false); }} className="p-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar..."
                className="w-full h-10 px-4 rounded-lg text-sm outline-none"
                style={{ background: "color-mix(in srgb, var(--foreground) 8%, transparent)", border: "1px solid var(--border)", color: "var(--foreground)" }}
              />
            </form>

            <nav className="flex flex-col px-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? "bg-foreground/10 text-foreground"
                      : "text-muted hover:text-foreground hover:bg-foreground/5"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href={isAuthenticated() ? "/cuenta" : "/login"}
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 rounded-lg text-sm font-medium text-muted hover:text-foreground hover:bg-foreground/5 transition-colors"
              >
                {isAuthenticated() ? "Mi Cuenta" : "Iniciar Sesión"}
              </Link>
            </nav>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-in {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slide-in 0.25s ease-out;
        }
      `}</style>
    </>
  );
}
