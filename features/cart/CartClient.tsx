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

  // Empty cart icon
  const CartIcon = () => (
    <div 
      className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
      style={{ background: "var(--surface)" }}
    >
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} style={{ color: "var(--muted)" }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    </div>
  );

  if (!isAuthenticated() && !isLoading) {
    return (
      <div className="store-container py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <CartIcon />
          <h1 className="section-title mb-3">Tu carrito</h1>
          <p className="section-subtitle mx-auto mb-8">Inicia sesion para agregar productos</p>
          <div className="flex gap-3 justify-center flex-wrap">
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
      <div className="store-container py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {[1, 2, 3].map((i) => (
              <div 
                key={i} 
                className="flex gap-4 p-5 rounded-2xl skeleton-shimmer"
                style={{ background: "var(--surface-solid)" }}
              >
                <div 
                  className="w-24 h-24 rounded-xl skeleton-shimmer"
                  style={{ background: "var(--surface)" }}
                />
                <div className="flex-1 space-y-3">
                  <div className="h-4 rounded w-2/3 skeleton-shimmer" style={{ background: "var(--surface)" }} />
                  <div className="h-5 rounded w-1/3 skeleton-shimmer" style={{ background: "var(--surface)" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
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
          <CartIcon />
          <h1 className="section-title mb-3">Tu carrito esta vacio</h1>
          <p className="section-subtitle mx-auto mb-8">Agrega productos para comenzar</p>
          <Link href="/catalogo" className="btn-primary">
            Explorar catalogo
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="store-container py-8 md:py-12">
      <FadeUp>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="section-title">Tu carrito</h1>
            <p className="section-subtitle mt-1">{cart.items.length} producto{cart.items.length !== 1 ? "s" : ""}</p>
          </div>
          <motion.button
            onClick={() => setShowClearConfirm(true)}
            className="text-sm font-medium px-4 py-2 rounded-full transition-colors"
            style={{ color: "var(--danger)", background: "rgba(239, 68, 68, 0.1)" }}
            disabled={clearMutation.isPending}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Vaciar carrito
          </motion.button>
        </div>
      </FadeUp>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {cart.items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.4, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
                className="flex gap-4 md:gap-6 p-4 md:p-5 rounded-2xl"
                style={{ background: "var(--surface-solid)", border: "1px solid var(--border)" }}
              >
                {/* Image */}
                <Link 
                  href={`/producto/${item.product_id || item.id}`}
                  className="relative w-20 h-20 md:w-24 md:h-24 rounded-xl shrink-0 overflow-hidden"
                  style={{ background: "var(--surface-tertiary)" }}
                >
                  {item.image_url ? (
                    <Image 
                      src={item.image_url} 
                      alt={item.name} 
                      fill 
                      className="object-contain p-2" 
                      sizes="96px" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center" style={{ color: "var(--muted)" }}>
                      <svg className="w-8 h-8 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                      </svg>
                    </div>
                  )}
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Link 
                    href={`/producto/${item.product_id || item.id}`}
                    className="text-sm md:text-base font-medium line-clamp-2 transition-colors"
                    style={{ color: "var(--foreground)" }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "var(--store-primary)"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "var(--foreground)"}
                  >
                    {item.name}
                  </Link>
                  
                  <p 
                    className="text-lg md:text-xl font-bold mt-1"
                    style={{ color: "var(--store-primary)" }}
                  >
                    {formatPrice(item.price * item.quantity)}
                  </p>
                  {item.quantity > 1 && (
                    <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                      {formatPrice(item.price)} c/u
                    </p>
                  )}

                  {/* Quantity controls */}
                  <div className="flex items-center gap-4 mt-3">
                    <div 
                      className="flex items-center rounded-full overflow-hidden"
                      style={{ background: "var(--surface)" }}
                    >
                      <motion.button
                        onClick={() => updateMutation.mutate({ itemId: item.id, quantity: Math.max(1, item.quantity - 1) })}
                        className="px-3 py-1.5 transition-colors"
                        style={{ color: "var(--foreground)" }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                        </svg>
                      </motion.button>
                      <span 
                        className="px-3 py-1.5 text-sm font-medium min-w-[32px] text-center"
                        style={{ color: "var(--foreground)" }}
                      >
                        {item.quantity}
                      </span>
                      <motion.button
                        onClick={() => updateMutation.mutate({ itemId: item.id, quantity: item.quantity + 1 })}
                        className="px-3 py-1.5 transition-colors"
                        style={{ color: "var(--foreground)" }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                      </motion.button>
                    </div>

                    <motion.button
                      onClick={() => removeMutation.mutate(item.id)}
                      className="p-2 rounded-full transition-colors"
                      style={{ color: "var(--muted)" }}
                      whileHover={{ scale: 1.1, color: "var(--danger)" }}
                      whileTap={{ scale: 0.9 }}
                      aria-label="Eliminar"
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
          className="h-fit sticky top-24 p-6 rounded-2xl"
          style={{ background: "var(--surface-solid)", border: "1px solid var(--border)" }}
        >
          <h2 className="font-semibold text-lg mb-6" style={{ color: "var(--foreground)" }}>
            Resumen del pedido
          </h2>
          
          <div className="space-y-3 text-sm mb-6">
            <div className="flex justify-between">
              <span style={{ color: "var(--muted)" }}>Subtotal</span>
              <span style={{ color: "var(--foreground)" }}>{formatPrice(cart.subtotal)}</span>
            </div>
            {cart.discount > 0 && (
              <div className="flex justify-between" style={{ color: "var(--success)" }}>
                <span>Descuento</span>
                <span>-{formatPrice(cart.discount)}</span>
              </div>
            )}
            {cart.coupon && (
              <div className="flex justify-between" style={{ color: "var(--muted)" }}>
                <span>Cupon aplicado</span>
                <span className="font-medium">{cart.coupon.code}</span>
              </div>
            )}
          </div>

          <div 
            className="pt-4 mb-6"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            <div className="flex justify-between items-baseline">
              <span className="font-semibold" style={{ color: "var(--foreground)" }}>Total</span>
              <span 
                className="text-2xl font-bold"
                style={{ color: "var(--store-primary)" }}
              >
                {formatPrice(cart.total)}
              </span>
            </div>
          </div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/checkout"
              className="block w-full text-center py-4 rounded-full font-medium text-white"
              style={{ background: "var(--store-primary)" }}
            >
              Continuar al pago
            </Link>
          </motion.div>

          <Link
            href="/catalogo"
            className="block w-full text-center py-3 mt-3 text-sm font-medium link-arrow justify-center"
            style={{ color: "var(--muted)" }}
          >
            Seguir comprando
          </Link>
        </motion.div>
      </div>

      {/* Clear cart confirmation modal */}
      <AnimatePresence>
        {showClearConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
            onClick={() => setShowClearConfirm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="rounded-2xl p-6 max-w-sm w-full"
              style={{ background: "var(--surface-solid)", border: "1px solid var(--border)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--foreground)" }}>
                Vaciar carrito
              </h3>
              <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
                Estas seguro? Esta accion eliminara todos los productos de tu carrito.
              </p>
              <div className="flex gap-3 justify-end">
                <motion.button
                  onClick={() => setShowClearConfirm(false)}
                  className="px-5 py-2.5 text-sm font-medium rounded-full"
                  style={{ background: "var(--surface)", color: "var(--foreground)" }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancelar
                </motion.button>
                <motion.button
                  onClick={() => { clearMutation.mutate(); setShowClearConfirm(false); }}
                  className="px-5 py-2.5 text-sm font-medium text-white rounded-full"
                  style={{ background: "var(--danger)" }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Si, vaciar
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
