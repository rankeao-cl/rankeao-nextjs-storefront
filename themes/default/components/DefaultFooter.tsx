"use client";

import Link from "next/link";
import Image from "next/image";
import { useTenant } from "@/context/TenantContext";

export default function DefaultFooter() {
  const tenant = useTenant();
  const socialLinks = tenant.config?.social_links || {};
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0a0a0a] text-white border-t border-white/5">
      {/* Accent gradient line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-violet-600 via-blue-500 to-cyan-400" />
      
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
          
          {/* Brand */}
          <div className="md:col-span-1">
            <Image
              src={tenant.logo_url || "/assets/logos/LogoSuperior.png"}
              alt={tenant.name}
              width={140}
              height={50}
              className="h-10 w-auto object-contain mb-4"
            />
            <p className="text-xs leading-relaxed text-white/50 max-w-[260px]">
              {tenant.description || "Tu tienda de juegos de cartas, juegos de mesa y coleccionables. Envíos a todo Chile."}
            </p>
            
            {/* Social Icons */}
            {(socialLinks.instagram || socialLinks.facebook || socialLinks.tiktok) && (
              <div className="flex gap-3 mt-5">
                {socialLinks.facebook && (
                  <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/15 flex items-center justify-center text-white/50 hover:text-white transition-all"
                    aria-label="Facebook">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
                  </a>
                )}
                {socialLinks.instagram && (
                  <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/15 flex items-center justify-center text-white/50 hover:text-white transition-all"
                    aria-label="Instagram">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  </a>
                )}
                {socialLinks.tiktok && (
                  <a href={socialLinks.tiktok} target="_blank" rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/15 flex items-center justify-center text-white/50 hover:text-white transition-all"
                    aria-label="TikTok">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.28 6.28 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.75a8.17 8.17 0 004.77 1.52V6.84a4.82 4.82 0 01-1-.15z"/></svg>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-4">Tienda</h3>
            <ul className="space-y-2.5">
              <li><Link href="/catalogo" className="text-sm text-white/60 hover:text-white transition-colors">Catálogo</Link></li>
              <li><Link href="/catalogo?sort=popular" className="text-sm text-white/60 hover:text-white transition-colors">Más Populares</Link></li>
              <li><Link href="/catalogo?sort=recent" className="text-sm text-white/60 hover:text-white transition-colors">Novedades</Link></li>
              <li><Link href="/torneos" className="text-sm text-white/60 hover:text-white transition-colors">Torneos</Link></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-4">Información</h3>
            <ul className="space-y-2.5">
              <li><Link href="/nosotros" className="text-sm text-white/60 hover:text-white transition-colors">Sobre Nosotros</Link></li>
              <li><Link href="/terminos" className="text-sm text-white/60 hover:text-white transition-colors">Términos y Condiciones</Link></li>
              <li><Link href="/tracking" className="text-sm text-white/60 hover:text-white transition-colors">Seguimiento de Pedido</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-4">Contacto</h3>
            <ul className="space-y-3">
              {tenant.email && (
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 shrink-0 text-white/30 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                  <a href={`mailto:${tenant.email}`} className="text-sm text-white/60 hover:text-white transition-colors break-all">{tenant.email}</a>
                </li>
              )}
              {tenant.address && (
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 shrink-0 text-white/30 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  <span className="text-sm text-white/60">{tenant.address}{tenant.city ? `, ${tenant.city}` : ""}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-white/30">
            {tenant.name} © {year}. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4">
            <Image
              src="/pago_webpay_w.png"
              alt="Webpay Plus"
              width={80}
              height={28}
              className="h-6 w-auto object-contain opacity-40"
            />
            <span className="text-[11px] text-white/30">
              Creado por <span className="font-semibold text-white/50">Rankeao</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
