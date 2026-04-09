"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTenant } from "@/context/TenantContext";

const DAY_LABELS_ES: Record<string, string> = {
  monday: "Lun", tuesday: "Mar", wednesday: "Mie", thursday: "Jue",
  friday: "Vie", saturday: "Sab", sunday: "Dom",
  lunes: "Lun", martes: "Mar", miercoles: "Mie", jueves: "Jue",
  viernes: "Vie", sabado: "Sab", domingo: "Dom",
};

function formatScheduleDay(day: string): string {
  const normalized = day.trim().toLowerCase().replace(/_/g, " ");
  return DAY_LABELS_ES[normalized] || normalized;
}

// Social icons - simplified
const SocialIcon = ({ platform }: { platform: string }) => {
  const icons: Record<string, JSX.Element> = {
    FACEBOOK: <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />,
    INSTAGRAM: <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />,
    WHATSAPP: <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />,
    TIKTOK: <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />,
  };
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      {icons[platform.toUpperCase()]}
    </svg>
  );
};

export default function Footer() {
  const tenant = useTenant();
  const config = tenant.config;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <footer 
      className="mt-auto border-t"
      style={{ borderColor: "var(--border)", background: "var(--surface-solid)" }}
    >
      {/* Main footer content */}
      <motion.div 
        className="store-container py-16 md:py-20"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Column 1: Brand */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <Image
              src={config?.footer_logo_url || tenant.logo_url || "/assets/logos/LogoInferior.png"}
              alt={tenant.name}
              width={140}
              height={56}
              className="h-12 w-auto object-contain mb-6"
            />
            {tenant.description && (
              <p 
                className="text-sm leading-relaxed mb-6 max-w-xs"
                style={{ color: "var(--muted)" }}
              >
                {tenant.description}
              </p>
            )}
            {/* Social links */}
            {tenant.social_links && tenant.social_links.length > 0 && (
              <div className="flex gap-3">
                {tenant.social_links.map((link) => (
                  <motion.a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
                    style={{ 
                      background: "var(--surface)",
                      color: "var(--muted)"
                    }}
                    whileHover={{ 
                      scale: 1.1,
                      background: "var(--store-primary)",
                      color: "white"
                    }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={link.platform}
                  >
                    <SocialIcon platform={link.platform} />
                  </motion.a>
                ))}
              </div>
            )}
          </motion.div>

          {/* Column 2: Quick links */}
          <motion.div variants={itemVariants}>
            <h3 
              className="font-semibold text-sm mb-6"
              style={{ color: "var(--foreground)" }}
            >
              Tienda
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/catalogo", label: "Catalogo completo" },
                { href: "/catalogo?sort=recent", label: "Novedades" },
                { href: "/catalogo?on_sale=true", label: "Ofertas" },
                { href: "/catalogo?categoria=pre-orders", label: "Preventas" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm transition-colors duration-200 link-arrow"
                    style={{ color: "var(--muted)" }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "var(--store-primary)"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "var(--muted)"}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 3: Contact */}
          <motion.div variants={itemVariants}>
            <h3 
              className="font-semibold text-sm mb-6"
              style={{ color: "var(--foreground)" }}
            >
              Contacto
            </h3>
            <ul className="space-y-4">
              {tenant.phone && (
                <li>
                  <a
                    href={`https://wa.me/${tenant.phone.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm flex items-center gap-3 transition-colors duration-200"
                    style={{ color: "var(--muted)" }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "var(--foreground)"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "var(--muted)"}
                  >
                    <span 
                      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: "var(--surface)" }}
                    >
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                      </svg>
                    </span>
                    {tenant.phone}
                  </a>
                </li>
              )}
              {tenant.email && (
                <li>
                  <a
                    href={`mailto:${tenant.email}`}
                    className="text-sm flex items-center gap-3 transition-colors duration-200"
                    style={{ color: "var(--muted)" }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "var(--foreground)"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "var(--muted)"}
                  >
                    <span 
                      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: "var(--surface)" }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="var(--store-primary)" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                    </span>
                    {tenant.email}
                  </a>
                </li>
              )}
            </ul>
          </motion.div>

          {/* Column 4: Location */}
          <motion.div variants={itemVariants}>
            <h3 
              className="font-semibold text-sm mb-6"
              style={{ color: "var(--foreground)" }}
            >
              Ubicacion
            </h3>
            {tenant.address && (
              <p 
                className="text-sm mb-4 flex items-start gap-3"
                style={{ color: "var(--muted)" }}
              >
                <span 
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: "var(--surface)" }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="var(--store-primary)" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                </span>
                <span>
                  {tenant.address}
                  {(tenant.city || tenant.region) && (
                    <><br />{[tenant.city, tenant.region].filter(Boolean).join(", ")}</>
                  )}
                </span>
              </p>
            )}
            {config?.google_maps_url && (
              <a
                href={config.google_maps_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium link-arrow"
                style={{ color: "var(--store-primary)" }}
              >
                Ver en Google Maps
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </a>
            )}
          </motion.div>
        </div>

        {/* Schedules - minimal style */}
        {tenant.schedules && tenant.schedules.length > 0 && (
          <motion.div 
            variants={itemVariants}
            className="mt-12 pt-8 border-t"
            style={{ borderColor: "var(--border)" }}
          >
            <h3 
              className="font-semibold text-sm mb-4 flex items-center gap-2"
              style={{ color: "var(--foreground)" }}
            >
              <svg className="w-4 h-4" fill="none" stroke="var(--store-primary)" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Horarios
            </h3>
            <div className="flex flex-wrap gap-2">
              {tenant.schedules.map((s, i) => {
                const day = s.day || s.day_of_week || "";
                const open = s.open_time || s.opens_at || "";
                const close = s.close_time || s.closes_at || "";
                return (
                  <div
                    key={i}
                    className="px-4 py-2 rounded-full text-xs"
                    style={{ 
                      background: "var(--surface)",
                      color: s.is_closed ? "var(--danger)" : "var(--muted)"
                    }}
                  >
                    <span className="font-medium" style={{ color: "var(--foreground)" }}>
                      {formatScheduleDay(day)}
                    </span>
                    {" "}
                    {s.is_closed ? "Cerrado" : `${open.slice(0, 5)} - ${close.slice(0, 5)}`}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Payment methods */}
        <motion.div 
          variants={itemVariants}
          className="mt-12 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="flex items-center gap-4">
            <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>
              Metodos de pago
            </span>
            <Image
              src={config?.payment_methods_image || "/assets/logos/icon-payment-methods.png"}
              alt="Metodos de pago"
              width={180}
              height={32}
              className="h-6 w-auto object-contain opacity-60"
            />
          </div>
          <div 
            className="flex items-center gap-2 text-xs font-medium"
            style={{ color: "var(--muted)" }}
          >
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            Compra 100% segura
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom bar */}
      <div 
        className="border-t"
        style={{ borderColor: "var(--border)", background: "var(--background)" }}
      >
        <div className="store-container py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs" style={{ color: "var(--muted)" }}>
            {new Date().getFullYear()} {tenant.name}. Todos los derechos reservados.
          </p>
          <p className="text-xs" style={{ color: "var(--muted)", opacity: 0.6 }}>
            Potenciado por{" "}
            <a
              href="https://rankeao.cl"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
              style={{ color: "var(--store-primary)" }}
            >
              Rankeao.cl
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
