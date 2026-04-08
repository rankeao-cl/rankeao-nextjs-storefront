"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useTenant } from "@/context/TenantContext";
import { getCart, updateCartItem, removeCartItem, clearCart } from "@/lib/api/store";
import { useCartStore } from "@/lib/stores/cart-store";
import { formatPrice } from "@/lib/utils/format";
import { TrashBin, ShoppingCart } from "@gravity-ui/icons";
import { toast } from "@heroui/react";
import { useAuthStore } from "@/lib/stores/auth-store";

export default function CartClient() {
  const tenant = useTenant();
  const queryClient = useQueryClient();
  const setItemCount = useCartStore((s) => s.setItemCount);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["cart", tenant.slug],
    queryFn: () => getCart(tenant.slug),
    enabled: isAuthenticated(),
  });

  const cart = data?.data;

  const updateMutation = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      updateCartItem(tenant.slug, itemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", tenant.slug] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (itemId: string) => removeCartItem(tenant.slug, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", tenant.slug] });
      toast.success("Producto eliminado");
    },
  });

  const clearMutation = useMutation({
    mutationFn: () => clearCart(tenant.slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", tenant.slug] });
      setItemCount(0);
      toast.success("Carrito vaciado");
    },
  });

  // If not authenticated, show empty cart with login prompt (not a blocker)
  if (!isAuthenticated() && !isLoading) {
    return (
      <div className="store-container py-16 text-center">
        <ShoppingCart className="w-16 h-16 text-muted mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-foreground mb-2">Carrito de compras</h1>
        <p className="text-muted mb-4">Inicia sesion para agregar productos a tu carrito</p>
        <div className="flex gap-3 justify-center">
          <Link href="/login" className="inline-block bg-[var(--store-primary)] text-white px-6 py-3 rounded-lg font-medium hover:brightness-110 transition-all">
            Iniciar sesion
          </Link>
          <Link href="/catalogo" className="inline-block bg-[var(--surface)] text-foreground px-6 py-3 rounded-lg font-medium hover:bg-[var(--surface-secondary)] transition-all">
            Ver catalogo
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="store-container py-8 animate-pulse space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-4 p-4 bg-[var(--surface)] rounded-xl">
            <div className="w-20 h-20 bg-[var(--surface-secondary)] rounded-lg" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-[var(--surface-secondary)] rounded w-2/3" />
              <div className="h-4 bg-[var(--surface)] rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="store-container py-16 text-center">
        <ShoppingCart className="w-16 h-16 text-muted mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-foreground mb-2">Carrito vacio</h1>
        <p className="text-muted mb-6">Agrega productos para comenzar</p>
        <Link href="/catalogo" className="inline-block bg-[var(--store-primary)] text-white px-6 py-3 rounded-lg font-medium hover:brightness-110 transition-all">
          Ver catalogo
        </Link>
      </div>
    );
  }

  return (
    <div className="store-container py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="section-title">Carrito de compras</h1>
        <button
          onClick={() => setShowClearConfirm(true)}
          className="text-sm text-danger hover:underline"
          disabled={clearMutation.isPending}
        >
          Vaciar carrito
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div key={item.id} className="flex gap-4 p-4 surface-card">
              <div className="relative w-20 h-20 bg-[var(--surface)] rounded-lg shrink-0 overflow-hidden">
                {item.image_url ? (
                  <Image src={item.image_url} alt={item.name} fill className="object-contain p-1" sizes="80px" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted text-xs">Sin img</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-foreground truncate">{item.name}</h3>
                <p className="text-lg font-bold text-[var(--store-primary)]">
                  {formatPrice(item.price * item.quantity)}
                </p>
                {item.quantity > 1 && (
                  <p className="text-xs text-muted">{formatPrice(item.price)} c/u</p>
                )}
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center border border-border rounded-lg overflow-hidden text-sm">
                    <button
                      onClick={() => updateMutation.mutate({ itemId: item.id, quantity: Math.max(1, item.quantity - 1) })}
                      className="px-2 py-1 hover:bg-[var(--surface)] text-foreground"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-foreground">{item.quantity}</span>
                    <button
                      onClick={() => updateMutation.mutate({ itemId: item.id, quantity: item.quantity + 1 })}
                      className="px-2 py-1 hover:bg-[var(--surface)] text-foreground"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeMutation.mutate(item.id)}
                    className="text-muted hover:text-danger transition-colors"
                    aria-label="Eliminar"
                  >
                    <TrashBin className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="surface-card p-6 h-fit sticky top-24">
          <h2 className="font-bold text-foreground text-lg mb-4">Resumen</h2>
          <div className="space-y-2 text-sm mb-4">
            <div className="flex justify-between text-foreground">
              <span>Subtotal</span>
              <span>{formatPrice(cart.subtotal)}</span>
            </div>
            {cart.discount > 0 && (
              <div className="flex justify-between text-success">
                <span>Descuento</span>
                <span>-{formatPrice(cart.discount)}</span>
              </div>
            )}
            {cart.coupon && (
              <div className="flex justify-between text-muted">
                <span>Cupon: {cart.coupon.code}</span>
              </div>
            )}
          </div>
          <div className="border-t border-border pt-4 mb-6">
            <div className="flex justify-between font-bold text-lg text-foreground">
              <span>Total</span>
              <span className="text-[var(--store-primary)]">{formatPrice(cart.total)}</span>
            </div>
          </div>
          <Link
            href="/checkout"
            className="block w-full text-center bg-[var(--store-primary)] text-white py-3 rounded-lg font-semibold hover:brightness-110 transition-all"
          >
            Ir al pago
          </Link>
        </div>
      </div>

      {/* Clear cart confirmation dialog */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setShowClearConfirm(false)}>
          <div className="bg-[var(--surface-solid)] rounded-xl p-6 max-w-sm w-full shadow-xl border border-border" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-foreground mb-2">Vaciar carrito</h3>
            <p className="text-sm text-muted mb-6">Estas seguro que deseas eliminar todos los productos del carrito? Esta accion no se puede deshacer.</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-foreground bg-[var(--surface)] rounded-lg hover:bg-[var(--surface-secondary)] transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => { clearMutation.mutate(); setShowClearConfirm(false); }}
                className="px-4 py-2 text-sm font-medium text-white bg-danger rounded-lg hover:brightness-110 transition-all"
              >
                Si, vaciar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
