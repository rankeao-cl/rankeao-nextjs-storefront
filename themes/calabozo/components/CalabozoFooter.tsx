"use client";

import Link from "next/link";
import Image from "next/image";
import { useTenant } from "@/context/TenantContext";
import { motion } from "framer-motion";

export default function CalabozoFooter() {
  const tenant = useTenant();
  const schedule = tenant.config?.operating_schedules || [];

  return (
    <footer className="mt-auto bg-[#111111] text-white">
      {/* Decorative top border / banner area */}
      <div className="h-4 w-full bg-[#A00000]"></div>

      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center mb-12">
            <Image
              src={tenant.logo_url || "/assets/logos/LogoSuperior.png"}
              alt={tenant.name}
              width={200}
              height={80}
              className="h-16 w-auto object-contain mb-4"
            />
            {tenant.description && (
                <p className="text-gray-400 text-sm max-w-lg text-center leading-relaxed">
                  {tenant.description}
                </p>
            )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 border-t border-gray-800 pt-12">
          
          {/* Column 1 — Navigation */}
          <div>
            <h3 className="text-lg font-bold uppercase tracking-wider mb-5 text-white flex items-center gap-2">
              <span className="w-2 h-2 bg-[#A00000]"></span> Menú Principal
            </h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-sm text-gray-400 hover:text-[#A00000] transition-colors">Inicio</Link></li>
              <li><Link href="/catalogo" className="text-sm text-gray-400 hover:text-[#A00000] transition-colors">Catálogo de Productos</Link></li>
              <li><Link href="/torneos" className="text-sm text-gray-400 hover:text-[#A00000] transition-colors">Eventos Presenciales</Link></li>
              <li><Link href="/contacto" className="text-sm text-gray-400 hover:text-[#A00000] transition-colors">Contacto</Link></li>
            </ul>
          </div>

          {/* Column 2 — Information */}
          <div>
            <h3 className="text-lg font-bold uppercase tracking-wider mb-5 text-white flex items-center gap-2">
              <span className="w-2 h-2 bg-[#A00000]"></span> Información Útil
            </h3>
            <ul className="space-y-3">
              <li><Link href="/nosotros" className="text-sm text-gray-400 hover:text-[#A00000] transition-colors">Sobre Nosotros</Link></li>
              <li><Link href="/terminos" className="text-sm text-gray-400 hover:text-[#A00000] transition-colors">Términos y Condiciones</Link></li>
              <li><Link href="/devoluciones" className="text-sm text-gray-400 hover:text-[#A00000] transition-colors">Políticas de Devolución</Link></li>
              <li><Link href="/privacidad" className="text-sm text-gray-400 hover:text-[#A00000] transition-colors">Políticas de Privacidad</Link></li>
            </ul>
          </div>

          {/* Column 3 — Contacto */}
          <div>
            <h3 className="text-lg font-bold uppercase tracking-wider mb-5 text-white flex items-center gap-2">
              <span className="w-2 h-2 bg-[#A00000]"></span> ¿Dudas? Contáctanos
            </h3>
            <ul className="space-y-4">
              {tenant.email && (
                <li className="flex items-start gap-3 text-gray-400">
                  <svg className="w-5 h-5 shrink-0 text-[#A00000]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  <a href={`mailto:${tenant.email}`} className="text-sm hover:text-[#A00000] transition-colors break-all">
                    {tenant.email}
                  </a>
                </li>
              )}
              {tenant.phone && (
                <li className="flex items-start gap-3 text-gray-400">
                  <svg className="w-5 h-5 shrink-0 text-[#A00000]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  <a href={`tel:${tenant.phone}`} className="text-sm hover:text-[#A00000] transition-colors">
                    {tenant.phone}
                  </a>
                </li>
              )}
              {tenant.address && (
                <li className="flex items-start gap-3 text-gray-400">
                  <svg className="w-5 h-5 shrink-0 text-[#A00000]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <span className="text-sm max-w-[200px]">
                    {tenant.address}{tenant.city ? `, ${tenant.city}` : ""}
                  </span>
                </li>
              )}
            </ul>
          </div>

        </div>

        {/* Custom Webpay / Footer logos section */}
        <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col items-center justify-center">
            <span className="text-xs text-gray-500 mb-2 uppercase font-bold tracking-widest">Medios de Pago Seguros</span>
            <Image
                src="/pago_webpay_w.png"
                alt="Webpay Plus"
                width={150}
                height={50}
                className="h-8 w-auto object-contain mb-8 opacity-60 hover:opacity-100 transition-opacity"
            />
          
          <p className="text-xs text-gray-600">
            {tenant.name} &copy; {new Date().getFullYear()} Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
