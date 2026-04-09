"use client";

import { useTenant } from "@/context/TenantContext";
import { Calendar, MapPin, Trophy } from "lucide-react";

export default function TorneosContent() {
  const tenant = useTenant();

  return (
    <div className="store-container py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Trophy className="w-16 h-16 mx-auto mb-4 text-[var(--store-primary)] opacity-80" />
          <h1 className="section-title mb-4">Torneos y Eventos</h1>
          <p className="text-muted max-w-2xl mx-auto">
            Participa en los torneos oficiales y eventos organizados por {tenant.name}. Forma parte de la comunidad, pon a prueba tus habilidades y gana increíbles premios.
          </p>
        </div>

        <div className="surface-card p-8 text-center flex flex-col items-center">
          <Calendar className="w-12 h-12 text-foreground/40 mb-4" />
          <h2 className="text-xl font-bold mb-2">Próximamente</h2>
          <p className="text-muted mb-6">
            Estamos trabajando en nuestro calendario digital de eventos. Pronto podrás inscribirte y ver los próximos torneos directamente desde aquí.
          </p>
          
          {(tenant.address || tenant.city) && (
            <div className="bg-background/50 border border-border p-4 rounded-lg flex items-center justify-center gap-3 text-sm text-foreground/80 mt-4">
              <MapPin className="w-5 h-5 text-[var(--store-primary)]" />
              <span>
                Todos los eventos presenciales se realizan en: <br className="sm:hidden" />
                <strong className="text-foreground">{tenant.address}{tenant.city ? `, ${tenant.city}` : ""}</strong>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
