"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTenant } from "@/context/TenantContext";

function IconInstagram() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function IconTikTok() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.28 6.28 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.75a8.17 8.17 0 004.77 1.52V6.84a4.82 4.82 0 01-1-.15z" />
    </svg>
  );
}

function IconFacebook() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 1.092.046 1.543.134v3.194a6 6 0 00-.862-.04c-1.227 0-1.702.465-1.702 1.672v2.598h3.168l-.612 3.668h-2.556v8.177A11.998 11.998 0 0023.539 12c0-6.627-5.373-12-12-12S-.461 5.373-.461 12c0 5.628 3.874 10.35 9.101 11.647l.461.044z" />
    </svg>
  );
}

export default function Footer() {
  const tenant = useTenant();

  const socialLinks = tenant.config?.social_links || {};
  const showSocial = socialLinks.instagram || socialLinks.tiktok || socialLinks.facebook;
  const schedule = tenant.config?.operating_schedules || [];

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="mt-auto bg-black text-white"
      style={{ borderTop: "1px solid #1a1a1a" }}
    >
      <div className="store-container py-12 md:py-16">
        
        {/* Links & Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
          
          {/* Column 1 — Brand & Description & Socials */}
          <div className="flex flex-col max-w-[280px]">
            <Image
              src={tenant.logo_url || "/assets/logos/LogoSuperior.png"}
              alt={tenant.name}
              width={100}
              height={40}
              className="h-10 w-auto object-contain mb-5"
            />
            <p className="text-xs leading-relaxed text-white font-medium mb-6">
              {tenant.description || `Tienda de Juegos de Cartas Coleccionables, Juegos de Mesa y Figuras de Anime. Envíos a todo Chile.`}
            </p>
            
            {showSocial && (
              <div className="flex gap-3">
                {socialLinks.facebook && (
                  <a
                    href={socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-7 h-7 flex items-center justify-center rounded-full bg-white text-black hover:opacity-80 transition-opacity"
                    aria-label="Facebook"
                  >
                    <IconFacebook />
                  </a>
                )}
                {socialLinks.instagram && (
                  <a
                    href={socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-7 h-7 flex items-center justify-center rounded-full bg-white text-black hover:opacity-80 transition-opacity"
                    aria-label="Instagram"
                  >
                    <IconInstagram />
                  </a>
                )}
                {socialLinks.tiktok && (
                  <a
                    href={socialLinks.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-7 h-7 flex items-center justify-center rounded-full bg-white text-black hover:opacity-80 transition-opacity"
                    aria-label="TikTok"
                  >
                    <IconTikTok />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Column 2 — Information */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-5 text-[#0ea5e9]">
              Información
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/nosotros" className="text-xs text-white font-medium hover:text-[#0ea5e9] transition-colors">
                  Nosotros
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 — Customer Service */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-5 text-[#0ea5e9]">
              Servicio al Cliente
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/terminos" className="text-xs text-white font-medium hover:text-[#0ea5e9] transition-colors">
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link href="/devoluciones" className="text-xs text-white font-medium hover:text-[#0ea5e9] transition-colors">
                  Políticas de Devolución
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-xs text-white font-medium hover:text-[#0ea5e9] transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 — Contact Forms */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-5 text-[#0ea5e9]">
              Contáctanos
            </h3>
            <ul className="space-y-4">
              {tenant.email && (
                <li className="flex items-start gap-2.5 group">
                  <svg className="w-4 h-4 shrink-0 text-white mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                  <a href={`mailto:${tenant.email}`} className="text-xs font-medium text-white group-hover:text-[#0ea5e9] transition-colors break-all">
                    {tenant.email}
                  </a>
                </li>
              )}
              {tenant.address && (
                <li className="flex items-start gap-2.5">
                  <svg className="w-4 h-4 shrink-0 text-white mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  <span className="text-xs font-medium text-white max-w-[200px]">
                    {tenant.address}{tenant.city ? `, ${tenant.city}` : ""}
                  </span>
                </li>
              )}
              {schedule.length > 0 && (
                <li className="flex items-start gap-2.5">
                  <svg className="w-4 h-4 shrink-0 text-white mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="flex flex-col text-xs font-medium text-white">
                    {schedule.map((s, i) => (
                      <span key={i}>
                        {s.days}: {s.hours}
                      </span>
                    ))}
                  </div>
                </li>
              )}
              {schedule.length === 0 && (
                <li className="flex items-start gap-2.5">
                  <svg className="w-4 h-4 shrink-0 text-white mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="flex flex-col text-xs font-medium text-white space-y-1">
                    <span>Lun a Sáb: 11:00 a 20:30hrs</span>
                    <span>Dom: Cerrado</span>
                  </div>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Custom Webpay / Footer logos section */}
        <div className="mt-16 flex flex-col items-center justify-center">
          <Image
            src="/pago_webpay_w.png"
            alt="Webpay Plus"
            width={120}
            height={40}
            className="h-10 w-auto object-contain mb-6 opacity-80"
          />
          
          <p className="text-[11px] font-medium text-white">
            {tenant.name} &copy; {new Date().getFullYear()} Creado por <span className="font-bold underline decoration-[rgba(255,255,255,0.4)] underline-offset-2">Rankeao</span>
          </p>
        </div>
      </div>
    </motion.footer>
  );
}
