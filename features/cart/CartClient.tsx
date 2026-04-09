"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useTenant } from "@/context/TenantContext";
import { getCart, updateCartItem, removeCartItem, clearCart } from "@/lib/api/store";
import { useCartStore } from "@/lib/stores/cart-store";
import { formatPrice } from "@/lib/utils/format";
import { toast } from "@heroui/react";
import { useAuthStore } from "@/lib/stores/auth-store";
import { FadeUp } from "@/lib/motion";

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

  // If not authenticated, show empty cart with login prompt
  if (!isAuthenticated() && !isLoading) {
    return (
      <div className="store-container py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: "var(--surface)" }}
          >
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} style={{ color: "var(--muted)" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--foreground)" }}>
            Carrito de compras
          </h1>
          <p className="text-sm mb-8" style={{ color: "var(--muted)" }}>
            Inicia sesion para agregar productos a tu carrito
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/login" className="btn-primary">
              Iniciar sesion
            </Link>
            <Link href="/catalogo" className="btn-secondary">
              Ver catalogo
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="store-container py-8 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-4 p-5 rounded-2xl skeleton-shimmer" style={{ background: "var(--surface-solid)" }}>
            <div className="w-20 h-20 rounded-xl" style={{ background: "var(--surface)" }} />
            <div className="flex-1 space-y-3">
              <div className="h-4 rounded-lg w-2/3" style={{ background: "var(--surface)" }} />
              <div className="h-4 rounded-lg w-1/3" style={{ background: "var(--surface)" }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="store-container py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: "var(--surface)" }}
          >
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} style={{ color: "var(--muted)" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--foreground)" }}>
            Carrito vacio
          </h1>
          <p className="text-sm mb-8" style={{ color: "var(--muted)" }}>
            Agrega productos para comenzar
          </p>
          <Link href="/catalogo" className="btn-primary">
            Ver catalogo
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="store-container py-8 md:py-12">
      <FadeUp>
        <div className="flex items-center justify-between mb-8">
          <h1 className="section-title">Carrito de compras</h1>
          <button
            onClick={() => setShowClearConfirm(true)}
            className="text-sm font-medium transition-colors"
            style={{ color: "var(--danger)" }}
            disabled={clearMutation.isPending}
          >
            Vaciar carrito
          </button>
        </div>
      </FadeUp>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          <AnimatePresence mode="popLayout">
            {cart.items.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100, height: 0, marginBottom: 0 }}
                transition={{ 
                  duration: 0.4, 
                  delay: index * 0.05,
                  ease: [0.22, 1, 0.36, 1] 
                }}
                className="flex gap-4 p-4 md:p-5 rounded-2xl"
                style={{ 
                  background: "var(--surface-solid)",
                  boxShadow: "var(--shadow-card)"
                }}
              >
                <div className="relative w-20 h-20 rounded-xl shrink-0 overflow-hidden" style={{ background: "var(--surface-tertiary)" }}>
                  {item.image_url ? (
                    <Image src={item.image_url} alt={item.name} fill className="object-contain p-1" sizes="80px" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs" style={{ color: "var(--muted)" }}>
                      <svg className="w-6 h-6 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium truncate" style={{ color: "var(--foreground)" }}>
                    {item.name}
                  </h3>
                  <p className="text-lg font-bold mt-0.5" style={{ color: "var(--foreground)" }}>
                    {formatPrice(item.price * item.quantity)}
                  </p>
                  {item.quantity > 1 && (
                    <p className="text-xs" style={{ color: "var(--muted)" }}>{formatPrice(item.price)} c/u</p>
                  )}
                  <div className="flex items-center gap-3 mt-2.5">
                    {/* Pill quantity stepper */}
                    <div 
                      className="flex items-center rounded-full overflow-hidden text-sm"
                      style={{ background: "var(--surface)" }}
                    >
                      <motion.button
                        onClick={() => updateMutation.mutate({ itemId: item.id, quantity: Math.max(1, item.quantity - 1) })}
                        className="px-3 py-1.5 font-medium"
                        style={{ color: "var(--foreground)" }}
                        whileTap={{ scale: 0.9 }}
                      >
                        −
                      </motion.button>
                      <span className="px-2 py-1.5 font-medium min-w-[2rem] text-center" style={{ color: "var(--foreground)" }}>
                        {item.quantity}
                      </span>
                      <motion.button
                        onClick={() => updateMutation.mutate({ itemId: item.id, quantity: item.quantity + 1 })}
                        className="px-3 py-1.5 font-medium"
                        style={{ color: "var(--foreground)" }}
                        whileTap={{ scale: 0.9 }}
                      >
                        +
                      </motion.button>
                    </div>
                    {/* Remove button */}
                    <motion.button
                      onClick={() => removeMutation.mutate(item.id)}
                      className="transition-colors"
                      style={{ color: "var(--muted)" }}
                      aria-label="Eliminar"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl p-6 h-fit sticky top-24"
          style={{ 
            background: "var(--surface-solid)",
            boxShadow: "var(--shadow-card)"
          }}
        >
          <h2 className="font-bold text-lg mb-4" style={{ color: "var(--foreground)" }}>
            Resumen
          </h2>
          <div className="space-y-2 text-sm mb-4">
            <div className="flex justify-between" style={{ color: "var(--foreground)" }}>
              <span>Subtotal</span>
              <span>{formatPrice(cart.subtotal)}</span>
            </div>
            {cart.discount > 0 && (
              <div className="flex justify-between" style={{ color: "var(--success)" }}>
                <span>Descuento</span>
                <span>-{formatPrice(cart.discount)}</span>
              </div>
            )}
            {cart.coupon && (
              <div className="flex justify-between" style={{ color: "var(--muted)" }}>
                <span>Cupon: {cart.coupon.code}</span>
              </div>
            )}
          </div>
          <div className="pt-4 mb-6" style={{ borderTop: "1px solid var(--border)" }}>
            <div className="flex justify-between font-bold text-lg">
              <span style={{ color: "var(--foreground)" }}>Total</span>
              <span style={{ color: "var(--store-primary)" }}>{formatPrice(cart.total)}</span>
            </div>
          </div>
          <Link
            href="/checkout"
            className="block w-full text-center py-4 rounded-full font-semibold text-white transition-all"
            style={{ background: "var(--store-primary)" }}
          >
            Ir al pago
          </Link>
        </motion.div>
      </div>

      {/* Clear cart confirmation dialog */}
      <AnimatePresence>
        {showClearConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)" }}
            onClick={() => setShowClearConfirm(false)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl p-6 max-w-sm w-full"
              style={{ 
                background: "var(--surface-solid)",
                boxShadow: "var(--shadow-elevated)"
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold mb-2" style={{ color: "var(--foreground)" }}>
                Vaciar carrito
              </h3>
              <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
                Estas seguro que deseas eliminar todos los productos del carrito? Esta accion no se puede deshacer.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="px-5 py-2.5 text-sm font-medium rounded-full transition-colors"
                  style={{ background: "var(--surface)", color: "var(--foreground)" }}
                >
                  Cancelar
                </button>
                <button
                  onClick={() => { clearMutation.mutate(); setShowClearConfirm(false); }}
                  className="px-5 py-2.5 text-sm font-medium text-white rounded-full transition-all"
                  style={{ background: "var(--danger)" }}
                >
                  Si, vaciar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
