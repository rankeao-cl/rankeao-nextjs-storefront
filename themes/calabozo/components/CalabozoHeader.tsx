"use client";

import Link from "next/link";
import Image from "next/image";
import { useTenant } from "@/context/TenantContext";
import { useCartStore } from "@/lib/stores/cart-store";
import type { TenantMenuItem } from "@/lib/types/tenant";

const DEFAULT_NAV: TenantMenuItem[] = [
  { label: "Inicio", href: "/", type: "link" },
  {
    label: "Categorías",
    href: "/catalogo",
    type: "dropdown",
    items: [
      { name: "ACCESORIOS - ARCHIVADORES, CARPETAS Y HOJAS", href: "/catalogo?category=ACCESORIOS+-+ARCHIVADORES%2C+CARPETAS+Y+HOJAS" },
      { name: "ACCESORIOS - PLAYMATS, DADOS Y BOLSAS", href: "/catalogo?category=ACCESORIOS+-+PLAYMATS%2C+DADOS+Y+BOLSAS" },
      { name: "ACCESORIOS - PORTAMAZOS", href: "/catalogo?category=ACCESORIOS+-+PORTAMAZOS" },
      { name: "ACCESORIOS - PROTECTORES", href: "/catalogo?category=ACCESORIOS+-+PROTECTORES" },
      { name: "EVENTOS", href: "/catalogo?category=EVENTOS" },
      { name: "JUEGOS DE MESA", href: "/catalogo?category=JUEGOS+DE+MESA" },
      { name: "JUEGOS DE ROL", href: "/catalogo?category=JUEGOS+DE+ROL" },
      { name: "LIBROS, COMICS, PELUCHES Y OTROS", href: "/catalogo?category=LIBROS%2C+COMICS%2C+PELUCHES+Y+OTROS" },
      { name: "LIVING CARD GAMES", href: "/catalogo?category=LIVING+CARD+GAMES" },
      { name: "PINTURAS Y FIGURAS", href: "/catalogo?category=PINTURAS+Y+FIGURAS" },
      { name: "PREVENTAS", href: "/catalogo?category=PREVENTAS" },
      { name: "TCG - ALTERED", href: "/catalogo?category=TCG+-+ALTERED" },
      { name: "TCG - MAGIC MAZOS ARMADOS", href: "/catalogo?category=TCG+-+MAGIC+MAZOS+ARMADOS" },
      { name: "TCG - MAGIC THE GATHERING SELLADO", href: "/catalogo?category=TCG+-+MAGIC+THE+GATHERING+SELLADO" },
      { name: "TCG - MITOS Y LEYENDAS", href: "/catalogo?category=TCG+-+MITOS+Y+LEYENDAS" },
      { name: "TCG - POKEMON", href: "/catalogo?category=TCG+-+POKEMON" },
      { name: "TCG - STAR WARS UNLIMITED", href: "/catalogo?category=TCG+-+STAR+WARS+UNLIMITED" },
      { name: "TCG - YU-GI-OH", href: "/catalogo?category=TCG+-+YU-GI-OH" },
    ],
  },
  { label: "Sobre Nosotros", href: "/nosotros", type: "link" },
  { label: "Términos de Uso", href: "/terminos", type: "link" },
];

export default function CalabozoHeader() {
  const tenant = useTenant();
  const itemCount = useCartStore((s) => s.itemCount);

  const navItems: TenantMenuItem[] = tenant.config?.menu_items?.length
    ? tenant.config.menu_items
    : DEFAULT_NAV;

  const configSocials = tenant.config?.social_links || {};
  const socialArray = tenant.social_links || [];
  const facebook =
    configSocials.facebook ||
    socialArray.find((s) => s.platform === "facebook")?.url;
  const instagram =
    configSocials.instagram ||
    socialArray.find((s) => s.platform === "instagram")?.url;

  return (
    <header className="w-full bg-black text-white font-sans border-b-4 border-[#C8102E]">
      <div className="max-w-[1920px] mx-auto w-full py-4 px-4 md:px-8 flex flex-col xl:flex-row md:flex-row items-center gap-6 md:gap-12">

        {/* Left: Logo */}
        <Link href="/" className="flex-shrink-0 flex items-center justify-center md:justify-start">
          <Image
            src={tenant.logo_url || "/assets/logos/LogoSuperior.png"}
            alt={tenant.name}
            width={280}
            height={90}
            className="w-48 md:w-56 xl:w-64 h-auto object-contain"
          />
        </Link>

        {/* Right: Search, Icons, Nav */}
        <div className="flex-1 w-full flex flex-col gap-4">

          {/* Top Row: Search & User Icons */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 w-full">

            {/* Search Bar */}
            <div className="flex-1 w-full relative">
              <form className="flex w-full h-10" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="text"
                  placeholder="Buscar"
                  className="flex-1 px-4 py-2 text-black bg-white text-[13px] border-none outline-none rounded-l-sm"
                />
                <button
                  type="submit"
                  className="bg-[#C8102E] text-white px-5 py-2 rounded-r-sm hover:bg-red-800 transition-colors flex items-center justify-center"
                  aria-label="Buscar"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </button>
              </form>
            </div>

            {/* User Icons */}
            <div className="flex items-center justify-center gap-6 md:gap-8 xl:pr-8">
              <Link href="/cuenta" className="flex flex-col items-center hover:opacity-80 transition-opacity">
                <svg className="w-6 h-6 mb-1 text-[#C8102E]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
                <span className="text-[10px] md:text-[11px] font-bold text-white tracking-wide">Mi cuenta</span>
              </Link>

              <Link href="/carrito" className="flex flex-col items-center hover:opacity-80 transition-opacity relative">
                <div className="relative">
                  <svg className="w-6 h-6 mb-1 text-[#C8102E]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                  </svg>
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-3 bg-white text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-black min-w-[18px] text-center">
                      {itemCount}
                    </span>
                  )}
                </div>
                <span className="text-[10px] md:text-[11px] font-bold text-white tracking-wide">Carrito</span>
              </Link>

              <Link href="/tracking" className="flex flex-col items-center hover:opacity-80 transition-opacity">
                <svg className="w-6 h-6 mb-1 text-[#C8102E]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 8h-3V4H3v13h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM8 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm12 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm-3-7h3.5l1.5 2H17v-2z" />
                </svg>
                <span className="text-[10px] md:text-[11px] font-bold text-white tracking-wide">Seguimiento</span>
              </Link>
            </div>
          </div>

          {/* Bottom Row: Navigation & Socials */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
            {/* Nav Menu */}
            <nav className="flex items-center justify-center md:justify-start text-[11px] md:text-[12px] xl:text-[13px] font-bold uppercase tracking-wider w-full md:flex-1 relative z-50">
              <div className="flex flex-wrap items-center gap-4 md:gap-6">
                {navItems.map((item) => {
                  if (item.type === "dropdown" && item.items?.length) {
                    return (
                      <div key={item.href} className="group relative py-2 flex items-center cursor-pointer">
                        <Link href={item.href} className="hover:text-[#C8102E] transition-colors">{item.label}</Link>
                        <div className="absolute top-full left-0 w-[420px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-2xl">
                          <div className="bg-white flex flex-col py-2 border-t-[3px] border-[#C8102E]">
                            {item.items.map((sub, idx) => (
                              <Link
                                key={idx}
                                href={sub.href}
                                className="px-5 py-2.5 text-[#1a1a1a] hover:bg-[#faeaea] text-[13px] font-[500] tracking-normal text-left transition-colors"
                              >
                                {sub.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return (
                    <Link key={item.href} href={item.href} className="hover:text-[#C8102E] transition-colors py-2">
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </nav>

            {/* Social Icons */}
            {(facebook || instagram) && (
              <div className="flex items-center gap-4 text-white xl:pr-8">
                {facebook && (
                  <a href={facebook} target="_blank" rel="noopener noreferrer" className="hover:text-[#C8102E] transition-colors" aria-label="Facebook">
                    <svg className="w-5 h-5 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
                  </a>
                )}
                {instagram && (
                  <a href={instagram} target="_blank" rel="noopener noreferrer" className="hover:text-[#C8102E] transition-colors" aria-label="Instagram">
                    <svg className="w-5 h-5 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
