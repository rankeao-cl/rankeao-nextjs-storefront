"use client";

import { useTenant } from "@/context/TenantContext";
import Image from "next/image";

export default function NosotrosContent() {
  const tenant = useTenant();

  return (
    <div className="store-container py-12">
      <div className="max-w-3xl mx-auto">
        {tenant.banner_url && (
          <div className="relative aspect-[3/1] rounded-card overflow-hidden mb-8">
            <Image src={tenant.banner_url} alt={tenant.name} fill className="object-cover" sizes="100vw" />
          </div>
        )}

        <h1 className="section-title mb-6">Sobre {tenant.name}</h1>

        {tenant.description ? (
          <div className="prose prose-invert max-w-none">
            <p className="text-foreground/80 whitespace-pre-wrap leading-relaxed">{tenant.description}</p>
          </div>
        ) : (
          <p className="text-muted">Informacion no disponible.</p>
        )}

        {/* Location */}
        {(tenant.address || tenant.city) && (
          <div className="mt-10 surface-card p-6">
            <h2 className="font-bold text-foreground text-lg mb-4">Ubicacion</h2>
            {tenant.address && <p className="text-foreground/80 text-sm">{tenant.address}</p>}
            {(tenant.city || tenant.region) && (
              <p className="text-muted text-sm">{[tenant.city, tenant.region].filter(Boolean).join(", ")}</p>
            )}
            {tenant.config?.google_maps_url && (
              <a href={tenant.config.google_maps_url} target="_blank" rel="noopener noreferrer"
                className="inline-block mt-3 text-[var(--store-primary)] hover:underline text-sm">
                Abrir en Google Maps
              </a>
            )}
          </div>
        )}

        {/* Schedule */}
        {tenant.schedules && tenant.schedules.length > 0 && (
          <div className="mt-6 surface-card p-6">
            <h2 className="font-bold text-foreground text-lg mb-4">Horarios</h2>
            <div className="space-y-2">
              {tenant.schedules.map((s, i) => {
                const day = s.day || s.day_of_week || "";
                const open = s.open_time || s.opens_at || "";
                const close = s.close_time || s.closes_at || "";
                return (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-foreground capitalize">{day.toLowerCase()}</span>
                    <span className="text-muted">{s.is_closed ? "Cerrado" : `${open.slice(0,5)} - ${close.slice(0,5)}`}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
