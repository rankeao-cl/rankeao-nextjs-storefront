"use client";

import CartInitializer from "@/components/CartInitializer";
import Link from "next/link";
import { useTenant } from "@/context/TenantContext";

export function StorefrontLayout({ children }: { children: React.ReactNode }) {
  const tenant = useTenant();
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-gray-900">
      <CartInitializer />
      <header className="bg-white border-b py-4 px-6 flex justify-between items-center shadow-sm">
        <h1 className="text-xl font-bold">{tenant?.name || "Default Theme Store"}</h1>
        <nav className="flex gap-4">
            <Link href="/" className="hover:underline">Home</Link>
            <Link href="/catalogo" className="hover:underline">Catalog</Link>
        </nav>
      </header>
      <main id="main-content" className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="bg-gray-200 py-6 text-center text-sm text-gray-600">
        &copy; {new Date().getFullYear()} {tenant?.name}. Default Theme.
      </footer>
    </div>
  );
}
