"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useTenant } from "@/context/TenantContext";
import { useCartStore } from "@/lib/stores/cart-store";
import { useAuthStore } from "@/lib/stores/auth-store";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/lib/api/store";
import type { Tenant } from "@/lib/types/tenant";

import {
  PromoBar,
  DesktopNav,
  SearchOverlay,
  CartDropdown,
  MobileDrawer,
} from "./header/index";
import type { MenuItem } from "./header/menu-types";

// ---------------------------------------------------------------------------
// Default menu data
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
  { label: "PLAYMATS", href: "/catalogo?categoria=playmats", type: "link" },
  { label: "PREVENTAS", href: "/catalogo?categoria=pre-orders", type: "link" },
  { label: "TORNEOS", href: "/torneos", type: "link" },
];

function buildTenantMenuItems(tenant: Tenant): MenuItem[] {
  if (tenant.config?.menu_items?.length) {
    return tenant.config.menu_items;
  }

  const tiles = (tenant.config?.category_tiles ?? []).filter((tile) => !!tile.link_url);

  if (tiles.length > 0) {
    const tenantItems: MenuItem[] = tiles.slice(0, 8).map((tile) => ({
      label: (tile.title || "Catalogo").toUpperCase(),
      href: tile.link_url || "/catalogo",
      type: "link",
    }));

    const hasTournaments = tenantItems.some((item) => item.href === "/torneos");
    if (!hasTournaments) {
      tenantItems.push({ label: "TORNEOS", href: "/torneos", type: "link" });
    }

    return tenantItems;
  }

  return DEFAULT_MENU_ITEMS;
}

// ---------------------------------------------------------------------------
// SVG Icons - Simplified, thinner strokes for Apple style
// ---------------------------------------------------------------------------

function IconUser({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  );
}

function IconSearch({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  );
}

function IconBag({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  );
}

function IconHamburger({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
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
  const { scrollY } = useScroll();

  // State
  const [promoDismissed, setPromoDismissed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  const logoSrc = tenant.logo_url || "/assets/logos/LogoSuperior.png";

  // Track scroll for header style change
  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      setHasScrolled(latest > 50);
    });
    return unsubscribe;
  }, [scrollY]);

  // Animation values
  const headerBg = useTransform(
    scrollY,
    [0, 100],
    ["rgba(255,255,255,0)", "rgba(255,255,255,0.85)"]
  );
  const headerBorder = useTransform(
    scrollY,
    [0, 100],
    ["rgba(0,0,0,0)", "rgba(0,0,0,0.08)"]
  );

  useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 10 * 60 * 1000,
  });

  const menuItems: MenuItem[] = buildTenantMenuItems(tenant);

  const promoText =
    tenant.config?.promo_bar_text ||
    `Envios a Todo Chile! Retiro en tienda ${tenant.address || ""}, ${tenant.city || ""}.`;

  const isHome = pathname === "/";
  const isTransparent = isHome && !hasScrolled;

  // Text is always white matching Blue Card Store reference
  const textColorClass = "text-white";
  const textMutedClass = "text-white/80";

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300`}
        style={{
          backgroundColor: isTransparent ? "transparent" : "#000000",
          backgroundImage: isTransparent ? "linear-gradient(rgba(0, 0, 0, 0.7) 0px, rgba(0, 0, 0, 0) 90%, rgba(0, 0, 0, 0) 100%)" : "none",
          backdropFilter: "blur(0px)",
          WebkitBackdropFilter: "blur(0px)",
        }}
      >
        {/* Promo bar - Hidden on scroll */}
        <AnimatePresence>
          {!promoDismissed && !hasScrolled && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0, transition: { duration: 0.2 } }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <PromoBar text={promoText} onDismiss={() => setPromoDismissed(true)} />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="store-container">
          <div className={`flex items-center justify-between transition-all duration-300 ${hasScrolled ? "h-14 md:h-16" : "h-16 md:h-24"}`}>
            {/* Logo */}
            <Link href="/" className="shrink-0 flex items-center">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <Image
                  src={logoSrc}
                  alt={tenant.name}
                  width={160}
                  height={60}
                  className={`w-auto object-contain transition-all duration-300 ${hasScrolled ? "h-8 md:h-10" : "h-12 md:h-16"}`}
                  priority
                />
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <DesktopNav menuItems={menuItems} scrolled={hasScrolled} isHome={isHome} />

            {/* Right Actions */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* Login / Account icon */}
              <Link
                href={isAuthenticated() ? "/cuenta" : "/login"}
                className={`hidden sm:flex items-center justify-center w-10 h-10 ${textMutedClass} hover:${textColorClass} transition-colors rounded-full hover:bg-black/5`}
                aria-label="Mi cuenta"
              >
                <IconUser className="w-5 h-5" />
              </Link>

              {/* Search icon */}
              <motion.button
                onClick={() => setSearchOpen(true)}
                className={`flex items-center justify-center w-10 h-10 ${textMutedClass} hover:${textColorClass} transition-colors rounded-full hover:bg-black/5`}
                aria-label="Buscar"
                whileTap={{ scale: 0.95 }}
              >
                <IconSearch className="w-5 h-5" />
              </motion.button>

              {/* Cart icon with badge */}
              <div className="relative">
                <motion.button
                  onClick={() => setCartDropdownOpen(!cartDropdownOpen)}
                  className={`relative flex items-center justify-center w-10 h-10 ${textMutedClass} hover:${textColorClass} transition-colors rounded-full hover:bg-black/5`}
                  aria-label="Carrito de compras"
                  whileTap={{ scale: 0.95 }}
                >
                  <IconBag className="w-5 h-5" />
                  {itemCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-0.5 -right-0.5 text-white text-[10px] font-semibold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 leading-none"
                      style={{ background: "var(--store-primary)" }}
                    >
                      {itemCount > 99 ? "99+" : itemCount}
                    </motion.span>
                  )}
                </motion.button>

                <CartDropdown
                  isOpen={cartDropdownOpen}
                  onClose={() => setCartDropdownOpen(false)}
                />
              </div>

              {/* Hamburger -- mobile only */}
              <motion.button
                className={`lg:hidden flex items-center justify-center w-10 h-10 ${textMutedClass} hover:${textColorClass} transition-colors rounded-full hover:bg-black/5`}
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Abrir menu"
                whileTap={{ scale: 0.95 }}
              >
                <IconHamburger className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Spacer to prevent content from going under fixed header on non-home pages */}
      {!isHome && <div className={`h-16 md:h-20 ${!promoDismissed ? "mt-8" : ""}`} />}

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
