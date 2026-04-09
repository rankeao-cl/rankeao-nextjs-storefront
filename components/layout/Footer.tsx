"use client";

import Image from "next/image";
import Link from "next/link";
import { useTenant } from "@/context/TenantContext";

const DAY_LABELS_ES: Record<string, string> = {
  monday: "lunes",
  tuesday: "martes",
  wednesday: "miercoles",
  thursday: "jueves",
  friday: "viernes",
  saturday: "sabado",
  sunday: "domingo",
  lunes: "lunes",
  martes: "martes",
  miercoles: "miercoles",
  jueves: "jueves",
  viernes: "viernes",
  sabado: "sabado",
  domingo: "domingo",
};

function formatScheduleDay(day: string): string {
  const normalized = day.trim().toLowerCase().replace(/_/g, " ");
  return DAY_LABELS_ES[normalized] || normalized;
}

export default function Footer() {
  const tenant = useTenant();
  const config = tenant.config;

  return (
    <footer className="bg-[var(--footer-bg)] mt-auto border-t border-white/5">
      {/* Upper footer - main content */}
      <div className="store-container pt-14 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Column 1: Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Image
              src={
                config?.footer_logo_url ||
                tenant.logo_url ||
                "/assets/logos/LogoInferior.png"
              }
              alt={tenant.name}
              width={180}
              height={70}
              className="h-14 w-auto object-contain mb-5"
            />
            {tenant.description && (
              <p className="text-white/50 text-sm leading-relaxed mb-5 max-w-xs">
                {tenant.description}
              </p>
            )}
            {/* Social links inline */}
            {tenant.social_links && tenant.social_links.length > 0 && (
              <div className="flex gap-2.5">
                {tenant.social_links.map((link) => (
                  <a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-white/[0.06] hover:bg-[var(--store-primary)] text-white/50 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-105"
                    aria-label={link.platform}
                  >
                    {link.platform.toUpperCase() === "FACEBOOK" && (
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    )}
                    {link.platform.toUpperCase() === "INSTAGRAM" && (
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    )}
                    {link.platform.toUpperCase() === "WHATSAPP" && (
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    )}
                    {link.platform.toUpperCase() === "TIKTOK" && (
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                      </svg>
                    )}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Column 2: Quick links */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              Tienda
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/catalogo"
                  className="text-white/50 hover:text-white text-sm transition-colors duration-200 flex items-center gap-2"
                >
                  <span className="w-1 h-1 rounded-full bg-[var(--store-primary)]" />
                  Catalogo completo
                </Link>
              </li>
              <li>
                <Link
                  href="/catalogo?sort=recent"
                  className="text-white/50 hover:text-white text-sm transition-colors duration-200 flex items-center gap-2"
                >
                  <span className="w-1 h-1 rounded-full bg-[var(--store-primary)]" />
                  Novedades
                </Link>
              </li>
              <li>
                <Link
                  href="/catalogo?on_sale=true"
                  className="text-white/50 hover:text-white text-sm transition-colors duration-200 flex items-center gap-2"
                >
                  <span className="w-1 h-1 rounded-full bg-[var(--store-primary)]" />
                  Ofertas
                </Link>
              </li>
              <li>
                <Link
                  href="/catalogo?categoria=pre-orders"
                  className="text-white/50 hover:text-white text-sm transition-colors duration-200 flex items-center gap-2"
                >
                  <span className="w-1 h-1 rounded-full bg-[var(--store-primary)]" />
                  Preventas
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              Contacto
            </h3>
            <ul className="space-y-3">
              {tenant.phone && (
                <li>
                  <a
                    href={`https://wa.me/${tenant.phone.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/50 hover:text-white text-sm transition-colors duration-200 flex items-center gap-2.5"
                  >
                    <svg
                      className="w-4 h-4 text-green-400 shrink-0"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    </svg>
                    {tenant.phone}
                  </a>
                </li>
              )}
              {tenant.email && (
                <li>
                  <a
                    href={`mailto:${tenant.email}`}
                    className="text-white/50 hover:text-white text-sm transition-colors duration-200 flex items-center gap-2.5"
                  >
                    <svg
                      className="w-4 h-4 text-blue-400 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    {tenant.email}
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Column 4: Location & Hours */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              Ubicacion
            </h3>
            {tenant.address && (
              <p className="text-white/50 text-sm mb-1 flex items-start gap-2.5">
                <svg
                  className="w-4 h-4 text-[var(--store-primary)] shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>
                  {tenant.address}
                  {(tenant.city || tenant.region) && (
                    <>
                      <br />
                      {[tenant.city, tenant.region].filter(Boolean).join(", ")}
                    </>
                  )}
                </span>
              </p>
            )}
            {config?.google_maps_url && (
              <a
                href={config.google_maps_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-2 text-[var(--store-primary)] hover:brightness-125 text-sm font-medium transition-all"
              >
                Ver en Google Maps
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            )}
          </div>
        </div>

        {/* Schedules */}
        {tenant.schedules && tenant.schedules.length > 0 && (
          <div className="mt-8 pt-6 border-t border-white/[0.06]">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
              <svg
                className="w-4 h-4 text-[var(--store-primary)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Horarios de atencion
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
              {tenant.schedules.map((s, i) => {
                const day = s.day || s.day_of_week || "";
                const open = s.open_time || s.opens_at || "";
                const close = s.close_time || s.closes_at || "";
                const dayLabel = formatScheduleDay(day);
                return (
                  <div
                    key={i}
                    className="bg-white/[0.04] rounded-lg px-3 py-2 text-center"
                  >
                    <p className="text-white/70 text-xs font-semibold capitalize mb-0.5">
                      {dayLabel}
                    </p>
                    <p
                      className={`text-xs font-medium ${s.is_closed ? "text-red-400" : "text-white/50"}`}
                    >
                      {s.is_closed
                        ? "Cerrado"
                        : `${open.slice(0, 5)} - ${close.slice(0, 5)}`}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Payment methods */}
        <div className="mt-8 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-white/30 text-xs font-medium uppercase tracking-wider">
              Metodos de pago
            </span>
            <Image
              src={
                config?.payment_methods_image ||
                "/assets/logos/icon-payment-methods.png"
              }
              alt="Metodos de pago"
              width={220}
              height={40}
              className="h-7 w-auto object-contain opacity-80"
            />
          </div>
          <div className="flex items-center gap-2 text-white/60 text-xs font-medium">
            <svg
              className="w-4 h-4 text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            Compra 100% segura
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.06] bg-black">
        <div className="store-container py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-white/30 text-xs">
            &copy; {new Date().getFullYear()} {tenant.name}. Todos los derechos
            reservados.
          </p>
          <p className="text-white/20 text-xs">
            Potenciado por{" "}
            <a
              href="https://rankeao.cl"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/40 transition-colors font-medium"
            >
              Rankeao.cl
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
