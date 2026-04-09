import Link from "next/link";

export default function StorefrontNotFound() {
  return (
    <div className="store-container py-16 text-center">
      <h1 className="text-6xl font-bold text-[var(--store-primary)] mb-4">404</h1>
      <h2 className="text-2xl font-bold text-foreground mb-4">Pagina no encontrada</h2>
      <p className="text-muted mb-8 max-w-md mx-auto">
        La pagina que buscas no existe o fue movida.
      </p>
      <div className="flex gap-3 justify-center">
        <Link href="/catalogo" className="bg-[var(--store-primary)] text-white px-6 py-3 rounded-lg font-medium hover:brightness-110 transition-all">
          Ver catalogo
        </Link>
        <Link href="/" className="bg-[var(--surface)] text-foreground px-6 py-3 rounded-lg font-medium hover:bg-[var(--surface-secondary)] transition-all">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
