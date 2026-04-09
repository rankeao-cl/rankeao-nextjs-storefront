"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, Magnifier, ShoppingCart, Person } from "@gravity-ui/icons";
import { useCartStore } from "@/lib/stores/cart-store";
import { useAuthStore } from "@/lib/stores/auth-store";

const NAV_ITEMS = [
  { href: "/", icon: House, label: "Inicio" },
  { href: "/catalogo", icon: Magnifier, label: "Catalogo" },
  { href: "/carrito", icon: ShoppingCart, label: "Carrito", showBadge: true },
  { href: "/login", icon: Person, label: "Cuenta", authHref: "/cuenta" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const itemCount = useCartStore((s) => s.itemCount);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-lg border-t border-white/10 z-50 safe-area-bottom">
      <div className="flex items-center justify-around h-16">
        {NAV_ITEMS.map((item) => {
          const href = item.authHref && isAuthenticated() ? item.authHref : item.href;
          const isActive = pathname === href || (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={href}
              className={`flex flex-col items-center justify-center gap-1 w-16 py-2 transition-colors ${
                isActive ? "text-[var(--store-primary)]" : "text-white/50 hover:text-white/80"
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.showBadge && itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[var(--store-primary)] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
              {isActive && (
                <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-[var(--store-primary)]" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
