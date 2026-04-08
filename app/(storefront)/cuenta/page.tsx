"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useCartStore } from "@/lib/stores/cart-store";
import Link from "next/link";
import { Person, ArrowRightFromSquare, ShoppingCart, Magnifier } from "@gravity-ui/icons";

export default function CuentaPage() {
  const router = useRouter();
  const { email, username, isAuthenticated, logout } = useAuthStore();
  const setItemCount = useCartStore((s) => s.setItemCount);

  if (!isAuthenticated()) {
    router.push("/login?redirect=/cuenta");
    return null;
  }

  function handleLogout() {
    logout();
    setItemCount(0);
    router.push("/");
  }

  return (
    <div className="store-container py-12">
      <div className="max-w-lg mx-auto">
        <h1 className="section-title mb-8 text-center">Mi cuenta</h1>

        <div className="surface-card p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-[var(--store-primary)] flex items-center justify-center text-white">
              <Person className="w-7 h-7" />
            </div>
            <div>
              {username && (
                <p className="font-bold text-foreground text-lg">{username}</p>
              )}
              <p className="text-muted text-sm">{email}</p>
            </div>
          </div>

          <div className="space-y-3">
            <Link
              href="/tracking"
              className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-[var(--surface)] transition-colors"
            >
              <Magnifier className="w-5 h-5 text-muted" />
              <div>
                <p className="font-medium text-foreground text-sm">Seguimiento de pedidos</p>
                <p className="text-xs text-muted">Consulta el estado de tus compras</p>
              </div>
            </Link>

            <Link
              href="/carrito"
              className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-[var(--surface)] transition-colors"
            >
              <ShoppingCart className="w-5 h-5 text-muted" />
              <div>
                <p className="font-medium text-foreground text-sm">Mi carrito</p>
                <p className="text-xs text-muted">Ver productos en tu carrito</p>
              </div>
            </Link>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3 border border-danger text-danger rounded-lg font-medium hover:bg-danger/10 transition-colors"
        >
          <ArrowRightFromSquare className="w-5 h-5" />
          Cerrar sesion
        </button>
      </div>
    </div>
  );
}
