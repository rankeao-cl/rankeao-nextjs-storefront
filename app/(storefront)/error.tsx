"use client";

import { useEffect } from "react";

export default function StorefrontError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Storefront error:", error);
  }, [error]);

  return (
    <div className="store-container py-16 text-center">
      <h1 className="text-3xl font-bold text-foreground mb-4">Algo salio mal</h1>
      <p className="text-muted mb-8 max-w-md mx-auto">
        Ocurrio un error inesperado. Por favor intenta nuevamente.
      </p>
      <div className="flex gap-3 justify-center">
        <button
          onClick={reset}
          className="bg-[var(--store-primary)] text-white px-6 py-3 rounded-lg font-medium hover:brightness-110 transition-all"
        >
          Reintentar
        </button>
        <a href="/" className="bg-[var(--surface)] text-foreground px-6 py-3 rounded-lg font-medium hover:bg-[var(--surface-secondary)] transition-all">
          Volver al inicio
        </a>
      </div>
    </div>
  );
}
