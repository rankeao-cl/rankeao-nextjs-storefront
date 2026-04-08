"use client";

import Link from "next/link";
import Image from "next/image";
import { useTenant } from "@/context/TenantContext";
import { useCartStore } from "@/lib/stores/cart-store";
import { useAuthStore } from "@/lib/stores/auth-store";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/lib/api/store";

// ---------------------------------------------------------------------------
// Menu data structure -- configurable per tenant
// ---------------------------------------------------------------------------

interface MenuSubItem {
  name: string;
  href: string;
}

interface MegaColumn {
  title: string;
  items: MenuSubItem[];
}

interface MenuItem {
  label: string;
  href: string;
  type: "mega" | "dropdown" | "link";
  columns?: MegaColumn[];
  items?: MenuSubItem[];
}

const MENU_ITEMS: MenuItem[] = [
  {
    label: "JUEGOS DE CARTAS",
    href: "/catalogo?categoria=sealed",
    type: "mega",
    columns: [
      {
        title: "Pokemon",
        items: [
          { name: "Ver todo", href: "/catalogo?q=pokemon" },
          { name: "Sellado", href: "/catalogo?q=pokemon+sellado" },
          { name: "Accesorios Pokemon", href: "/catalogo?q=pokemon+accesorios" },
        ],
      },
      {
        title: "Magic: The Gathering",
        items: [
          { name: "Ver todo", href: "/catalogo?q=magic" },
          { name: "Mazos Armados", href: "/catalogo?categoria=starter-decks" },
          { name: "Sellado", href: "/catalogo?q=magic+sellado" },
        ],
      },
      {
        title: "Yu-Gi-Oh!",
        items: [{ name: "Ver todo", href: "/catalogo?q=yugioh" }],
      },
      {
        title: "Mitos y Leyendas",
        items: [{ name: "Ver todo", href: "/catalogo?q=mitos" }],
      },
    ],
  },
  {
    label: "JUEGOS DE MESA",
    href: "/catalogo?categoria=board-games",
    type: "dropdown",
    items: [
      { name: "Clasicos", href: "/catalogo?q=clasicos" },
      { name: "Para la Familia", href: "/catalogo?q=familia" },
      { name: "Party Games", href: "/catalogo?q=party+games" },
      { name: "Juegos de Rol", href: "/catalogo?q=juegos+de+rol" },
      { name: "Ver Todo", href: "/catalogo?categoria=board-games" },
    ],
  },
  {
    label: "ACCESORIOS",
    href: "/catalogo?categoria=accessories",
    type: "dropdown",
    items: [
      { name: "Protectores", href: "/catalogo?q=protectores" },
      { name: "Playmats", href: "/catalogo?q=playmats" },
      { name: "Carpetas", href: "/catalogo?q=carpetas" },
      { name: "Deck Boxes", href: "/catalogo?q=deck+boxes" },
    ],
  },
  {
    label: "FIGURAS",
    href: "/catalogo?categoria=figures-miniatures",
    type: "dropdown",
    items: [
      { name: "Dragon Ball", href: "/catalogo?q=dragon+ball" },
      { name: "One Piece", href: "/catalogo?q=one+piece" },
      { name: "Naruto", href: "/catalogo?q=naruto" },
      { name: "Ver Todo", href: "/catalogo?categoria=figures-miniatures" },
    ],
  },
  {
    label: "PLAYMATS",
    href: "/catalogo?categoria=playmats",
    type: "link",
  },
  {
    label: "PREVENTAS",
    href: "/catalogo?categoria=pre-orders",
    type: "link",
  },
  {
    label: "TORNEOS",
    href: "/torneos",
    type: "link",
  },
];

// ---------------------------------------------------------------------------
// SVG Icons (inline to avoid external dependency issues)
// ---------------------------------------------------------------------------

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

function IconSearch({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  );
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

function IconChevronDown({ className = "w-3 h-3" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  );
}

function IconX({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function IconHamburger({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
  );
}

function IconArrowLeft({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Header Component
// ---------------------------------------------------------------------------

export default function Header() {
  const tenant = useTenant();
  const pathname = usePathname();
  const itemCount = useCartStore((s) => s.itemCount);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const router = useRouter();

  // State
  const [promoDismissed, setPromoDismissed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false);
  const [mobileExpandedIndex, setMobileExpandedIndex] = useState<number | null>(null);

  // Refs
  const searchInputRef = useRef<HTMLInputElement>(null);
  const cartDropdownRef = useRef<HTMLDivElement>(null);

  const logoSrc = tenant.logo_url || "/assets/logos/LogoSuperior.png";

  // Fetch categories (available for dynamic menu in the future)
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 10 * 60 * 1000,
  });

  // Focus search input when overlay opens
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Close cart dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (cartDropdownRef.current && !cartDropdownRef.current.contains(e.target as Node)) {
        setCartDropdownOpen(false);
      }
    }
    if (cartDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [cartDropdownOpen]);

  // Close search on Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setCartDropdownOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim()) {
        router.push(`/catalogo?q=${encodeURIComponent(query.trim())}`);
        setSearchOpen(false);
        setMobileMenuOpen(false);
        setQuery("");
      }
    },
    [query, router]
  );

  function toggleMobileSubMenu(index: number) {
    setMobileExpandedIndex((prev) => (prev === index ? null : index));
  }

  // Promo bar text
  const promoText =
    tenant.config?.promo_bar_text ||
    `Envios a Todo Chile! Retiro en tienda ${tenant.address || ""}, ${tenant.city || ""}.`;

  return (
    <>
      {/* Entire header: one gradient block from-black to transparent, over the hero */}
      <header className={`sticky top-0 z-50 ${pathname === "/" ? "bg-transparent absolute left-0 right-0 bg-gradient-to-b from-black via-black/60 to-transparent pb-6" : "bg-gray-900"}`}>

        {/* Promo bar inside the gradient */}
        {!promoDismissed && (
          <div className="text-white text-center py-1.5 px-10 text-[11px] md:text-xs relative">
            <p className="leading-snug opacity-80">{promoText}</p>
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
              aria-label="Cerrar"
              onClick={() => setPromoDismissed(true)}
            >
              <IconX className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* ------ Logo (left) ------ */}
            <Link href="/" className="shrink-0">
              <Image
                src={logoSrc}
                alt={tenant.name}
                width={140}
                height={60}
                className="h-14 w-auto object-contain"
                priority
              />
            </Link>

            {/* ------ Desktop Navigation (center-right) ------ */}
            <nav className="hidden lg:flex items-center ml-8 gap-0">
              {MENU_ITEMS.map((item, idx) => {
                // MEGA MENU item
                if (item.type === "mega" && item.columns) {
                  return (
                    <div key={idx} className="relative group">
                      <Link
                        href={item.href}
                        className="flex items-center gap-1 px-3 py-5 text-[13px] font-bold tracking-wide uppercase text-white/80 hover:text-white transition-colors"
                      >
                        {item.label}
                        <IconChevronDown className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
                      </Link>
                      {/* Mega dropdown -- full width grid */}
                      <div
                        className="
                          absolute top-full left-1/2 -translate-x-1/2 pt-0
                          opacity-0 invisible
                          group-hover:opacity-100 group-hover:visible
                          transition-all duration-200 ease-out
                          z-50
                        "
                        style={{ width: "calc(100vw - 2rem)", maxWidth: "1200px" }}
                      >
                        <div
                          className="bg-white rounded-b-lg shadow-2xl border border-gray-200 border-t-2 border-t-blue-600 p-6"
                          style={{
                            display: "grid",
                            gridTemplateColumns: `repeat(${item.columns.length}, 1fr)`,
                            gap: "2rem",
                          }}
                        >
                          {item.columns.map((col) => (
                            <div key={col.title}>
                              <h4 className="font-bold text-gray-900 text-sm mb-3 pb-2 border-b border-gray-200">
                                {col.title}
                              </h4>
                              <ul className="space-y-1.5">
                                {col.items.map((sub) => (
                                  <li key={sub.name}>
                                    <Link
                                      href={sub.href}
                                      className="block text-sm text-gray-600 hover:text-blue-600 hover:pl-1 py-0.5 transition-all duration-150"
                                    >
                                      {sub.name}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                }

                // SIMPLE DROPDOWN item
                if (item.type === "dropdown" && item.items) {
                  return (
                    <div key={idx} className="relative group">
                      <Link
                        href={item.href}
                        className="flex items-center gap-1 px-3 py-5 text-[13px] font-bold tracking-wide uppercase text-white/80 hover:text-white transition-colors"
                      >
                        {item.label}
                        <IconChevronDown className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
                      </Link>
                      {/* Simple vertical dropdown */}
                      <div
                        className="
                          absolute top-full left-0 pt-0
                          opacity-0 invisible
                          group-hover:opacity-100 group-hover:visible
                          transition-all duration-200 ease-out
                          z-50 min-w-[200px]
                        "
                      >
                        <div className="bg-white rounded-b-lg shadow-2xl border border-gray-200 border-t-2 border-t-blue-600 py-2">
                          {item.items.map((sub) => (
                            <Link
                              key={sub.name}
                              href={sub.href}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                }

                // DIRECT LINK item (no dropdown)
                return (
                  <Link
                    key={idx}
                    href={item.href}
                    className="px-3 py-5 text-[13px] font-bold tracking-wide uppercase text-white/80 hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* ------ Right Actions: Login, Search, Cart, Hamburger ------ */}
            <div className="flex items-center gap-1">
              {/* Login / Account icon */}
              <Link
                href={isAuthenticated() ? "/cuenta" : "/login"}
                className="hidden sm:flex items-center justify-center w-10 h-10 text-white/70 hover:text-white transition-colors rounded-full hover:bg-white/10"
                aria-label="Mi cuenta"
              >
                <IconUser className="w-5 h-5" />
              </Link>

              {/* Search icon -- opens overlay */}
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center justify-center w-10 h-10 text-white/70 hover:text-white transition-colors rounded-full hover:bg-white/10"
                aria-label="Buscar"
              >
                <IconSearch className="w-5 h-5" />
              </button>

              {/* Cart icon with badge + dropdown */}
              <div className="relative" ref={cartDropdownRef}>
                <button
                  onClick={() => setCartDropdownOpen(!cartDropdownOpen)}
                  className="relative flex items-center justify-center w-10 h-10 text-white/70 hover:text-white transition-colors rounded-full hover:bg-white/10"
                  aria-label="Carrito de compras"
                >
                  <IconBag className="w-5 h-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 leading-none">
                      {itemCount > 99 ? "99+" : itemCount}
                    </span>
                  )}
                </button>

                {/* Cart dropdown preview */}
                {cartDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 overflow-hidden">
                    <div className="p-4 border-b border-gray-100">
                      <h3 className="font-semibold text-gray-900 text-sm">Carrito de Compras</h3>
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
                        onClick={() => setCartDropdownOpen(false)}
                        className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 px-4 rounded-lg transition-colors"
                      >
                        Continuar
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Hamburger -- mobile only */}
              <button
                className="lg:hidden flex items-center justify-center w-10 h-10 text-white/70 hover:text-white transition-colors rounded-full hover:bg-white/10"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Abrir menu"
              >
                <IconHamburger className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ================================================================ */}
      {/* 3. SEARCH OVERLAY                                                */}
      {/* ================================================================ */}
      <div
        className={`
          fixed inset-0 z-[60] transition-all duration-300
          ${searchOpen ? "visible opacity-100" : "invisible opacity-0 pointer-events-none"}
        `}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSearchOpen(false)} />

        {/* Search bar container */}
        <div
          className={`
            relative w-full bg-gray-900 shadow-2xl transition-transform duration-300
            ${searchOpen ? "translate-y-0" : "-translate-y-full"}
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
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 transition-colors font-medium text-sm"
                  aria-label="Buscar"
                >
                  Buscar
                </button>
              </div>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="text-white/70 hover:text-white transition-colors p-2"
                aria-label="Cerrar busqueda"
              >
                <IconX className="w-6 h-6" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ================================================================ */}
      {/* 4. MOBILE MENU -- slide-in panel                                 */}
      {/* ================================================================ */}
      {/* Backdrop */}
      <div
        className={`
          fixed inset-0 z-[70] bg-black/50 transition-opacity duration-300 lg:hidden
          ${mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}
        `}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Slide panel */}
      <div
        className={`
          fixed top-0 left-0 bottom-0 z-[80] w-[85vw] max-w-sm bg-gray-900 shadow-2xl
          transform transition-transform duration-300 ease-out lg:hidden overflow-y-auto
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Close header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm font-medium"
          >
            <IconArrowLeft className="w-4 h-4" />
            Cerrar Menu
          </button>
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="shrink-0">
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
        <div className="p-4 border-b border-white/10">
          <form onSubmit={handleSearch} className="flex rounded-lg overflow-hidden">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar productos..."
              className="flex-1 bg-white/10 text-white placeholder:text-white/40 px-3 py-2.5 text-sm focus:outline-none focus:bg-white/15 transition-colors"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 transition-colors"
              aria-label="Buscar"
            >
              <IconSearch className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Mobile menu items */}
        <nav className="p-4 space-y-0">
          {MENU_ITEMS.map((item, idx) => {
            const hasChildren =
              (item.type === "mega" && item.columns && item.columns.length > 0) ||
              (item.type === "dropdown" && item.items && item.items.length > 0);

            const isExpanded = mobileExpandedIndex === idx;

            return (
              <div key={idx} className="border-b border-white/5 last:border-b-0">
                {hasChildren ? (
                  <>
                    {/* Expandable parent */}
                    <button
                      onClick={() => toggleMobileSubMenu(idx)}
                      className="flex items-center justify-between w-full py-3 text-sm font-semibold text-white/90 hover:text-white transition-colors"
                    >
                      <span>{item.label}</span>
                      <IconChevronDown
                        className={`w-4 h-4 opacity-60 transition-transform duration-200 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Collapsible children */}
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-out ${
                        isExpanded ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      {item.type === "mega" &&
                        item.columns?.map((col) => (
                          <div key={col.title} className="mb-3">
                            <p className="pl-4 py-1.5 text-xs font-bold text-white/60 uppercase tracking-wider">
                              {col.title}
                            </p>
                            {col.items.map((sub) => (
                              <Link
                                key={sub.name}
                                href={sub.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="block pl-8 py-1.5 text-sm text-white/50 hover:text-white transition-colors"
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
                            onClick={() => setMobileMenuOpen(false)}
                            className="block pl-6 py-2 text-sm text-white/50 hover:text-white transition-colors"
                          >
                            {sub.name}
                          </Link>
                        ))}
                    </div>
                  </>
                ) : (
                  // Direct link (no children)
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-3 text-sm font-semibold text-white/90 hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            );
          })}
        </nav>

        {/* Mobile menu footer links */}
        <div className="p-4 mt-2 border-t border-white/10 space-y-1">
          <Link
            href={isAuthenticated() ? "/cuenta" : "/login"}
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 py-2.5 text-sm text-white/60 hover:text-white transition-colors"
          >
            <IconUser className="w-4 h-4" />
            {isAuthenticated() ? "Mi Cuenta" : "Iniciar Sesion"}
          </Link>
          <Link
            href="/nosotros"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2.5 text-sm text-white/60 hover:text-white transition-colors"
          >
            Sobre nosotros
          </Link>
          <Link
            href="/terminos"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2.5 text-sm text-white/60 hover:text-white transition-colors"
          >
            Terminos de uso
          </Link>
        </div>
      </div>
    </>
  );
}
