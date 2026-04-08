"use client";

import Link from "next/link";
import Image from "next/image";
import { useTenant } from "@/context/TenantContext";
import { useCartStore } from "@/lib/stores/cart-store";
import { useAuthStore } from "@/lib/stores/auth-store";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/lib/api/store";

import { PromoBar, DesktopNav, SearchOverlay, CartDropdown, MobileDrawer } from "./header";
import type { MenuItem } from "./header/menu-types";

// ---------------------------------------------------------------------------
// Default menu data -- can be overridden by tenant.config.menu_items
// ---------------------------------------------------------------------------

const DEFAULT_MENU_ITEMS: MenuItem[] = [
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
// SVG Icons
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

function IconHamburger({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
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

  // State
  const [promoDismissed, setPromoDismissed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false);

  const logoSrc = tenant.logo_url || "/assets/logos/LogoSuperior.png";

  // Fetch categories (available for dynamic menu in the future)
  useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 10 * 60 * 1000,
  });

  // Use tenant menu items if available, otherwise use defaults
  const menuItems: MenuItem[] = tenant.config?.menu_items?.length
    ? tenant.config.menu_items
    : DEFAULT_MENU_ITEMS;

  // Promo bar text
  const promoText =
    tenant.config?.promo_bar_text ||
    `Envios a Todo Chile! Retiro en tienda ${tenant.address || ""}, ${tenant.city || ""}.`;

  const isHome = pathname === "/";

  return (
    <>
      <header className={`sticky top-0 z-50 ${isHome ? "bg-transparent absolute left-0 right-0 bg-gradient-to-b from-black via-black/60 to-transparent pb-6" : "bg-[var(--header-bg)]"}`}>
        {/* Promo bar */}
        {!promoDismissed && (
          <PromoBar text={promoText} onDismiss={() => setPromoDismissed(true)} />
        )}

        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
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

            {/* Desktop Navigation */}
            <DesktopNav menuItems={menuItems} />

            {/* Right Actions */}
            <div className="flex items-center gap-1">
              {/* Login / Account icon */}
              <Link
                href={isAuthenticated() ? "/cuenta" : "/login"}
                className="hidden sm:flex items-center justify-center w-10 h-10 text-white/70 hover:text-white transition-colors rounded-full hover:bg-white/10"
                aria-label="Mi cuenta"
              >
                <IconUser className="w-5 h-5" />
              </Link>

              {/* Search icon */}
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center justify-center w-10 h-10 text-white/70 hover:text-white transition-colors rounded-full hover:bg-white/10"
                aria-label="Buscar"
              >
                <IconSearch className="w-5 h-5" />
              </button>

              {/* Cart icon with badge */}
              <div className="relative">
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

                <CartDropdown isOpen={cartDropdownOpen} onClose={() => setCartDropdownOpen(false)} />
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

      {/* Search Overlay */}
      <SearchOverlay
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        query={query}
        setQuery={setQuery}
      />

      {/* Mobile Menu Drawer */}
      <MobileDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        menuItems={menuItems}
      />
    </>
  );
}
