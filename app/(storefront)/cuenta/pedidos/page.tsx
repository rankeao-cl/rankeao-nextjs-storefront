"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useAuthStore } from "@/lib/stores/auth-store";
import { getMyOrders, cancelOrder, confirmDelivery } from "@/lib/api/store";
import { formatPrice } from "@/lib/utils/format";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Link from "next/link";
import type { StoreOrder } from "@/lib/types/store";

const STATUS_LABELS: Record<string, string> = {
  PENDING_PAYMENT: "Pago pendiente",
  PAID: "Pagado",
  PROCESSING: "En proceso",
  READY: "Listo para envío",
  SHIPPED: "Enviado",
  DELIVERED: "Entregado",
  COMPLETED: "Completado",
  CANCELLED: "Cancelado",
  REFUNDED: "Reembolsado",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING_PAYMENT: "var(--warning)",
  PAID: "var(--store-primary)",
  PROCESSING: "var(--store-primary)",
  READY: "var(--accent)",
  SHIPPED: "var(--accent)",
  DELIVERED: "var(--success)",
  COMPLETED: "var(--success)",
  CANCELLED: "var(--danger)",
  REFUNDED: "var(--warning)",
};

function OrderCardSkeleton() {
  return (
    <div className="surface-card rounded-card p-5 animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-2">
          <div className="h-4 w-32 rounded bg-[var(--surface-secondary)]" />
          <div className="h-3 w-24 rounded bg-[var(--surface)]" />
        </div>
        <div className="h-6 w-20 rounded-full bg-[var(--surface-secondary)]" />
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-3 w-48 rounded bg-[var(--surface)]" />
        <div className="h-3 w-36 rounded bg-[var(--surface)]" />
      </div>
      <div className="flex justify-between items-center pt-3 border-t border-border">
        <div className="h-4 w-20 rounded bg-[var(--surface-secondary)]" />
        <div className="h-8 w-28 rounded-lg bg-[var(--surface)]" />
      </div>
    </div>
  );
}

function OrderCard({ order }: { order: StoreOrder }) {
  const queryClient = useQueryClient();
  const statusColor = STATUS_COLORS[order.status] || "var(--muted)";
  const canCancel = order.status === "PENDING_PAYMENT";
  const canConfirm = order.status === "SHIPPED" || order.status === "DELIVERED";

  const cancelMut = useMutation({
    mutationFn: () => cancelOrder(order.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["my-orders"] }),
  });

  const confirmMut = useMutation({
    mutationFn: () => confirmDelivery(order.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["my-orders"] }),
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="surface-card rounded-card p-5"
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="font-bold text-sm" style={{ color: "var(--foreground)" }}>
            Pedido #{order.order_number || order.id.slice(0, 8).toUpperCase()}
          </p>
          {order.created_at && (
            <p className="text-xs text-muted mt-0.5">
              {new Date(order.created_at).toLocaleDateString("es-CL", {
                year: "numeric", month: "long", day: "numeric"
              })}
            </p>
          )}
        </div>
        <span
          className="px-2.5 py-1 rounded-full text-xs font-semibold"
          style={{ background: `color-mix(in srgb, ${statusColor} 12%, transparent)`, color: statusColor }}
        >
          {STATUS_LABELS[order.status] || order.status}
        </span>
      </div>

      {/* Items summary */}
      <div className="mb-3 space-y-1">
        {order.items && order.items.length > 0 ? (
          <>
            {order.items.slice(0, 2).map((item, i) => (
              <p key={i} className="text-sm text-muted truncate">
                {item.product_name} <span className="text-muted/60">×{item.quantity}</span>
              </p>
            ))}
            {order.items.length > 2 && (
              <p className="text-xs text-muted">+{order.items.length - 2} producto(s) más</p>
            )}
          </>
        ) : order.item_summary ? (
          <p className="text-sm text-muted truncate">{order.item_summary}</p>
        ) : null}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border">
        <span className="font-bold" style={{ color: "var(--store-primary)" }}>
          {formatPrice(order.total)}
        </span>
        <div className="flex items-center gap-2">
          <Link
            href={`/tracking?order=${order.order_number || order.id}`}
            className="text-xs px-3 py-1.5 rounded-lg border transition-colors"
            style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
          >
            Ver seguimiento
          </Link>
          {canCancel && (
            <button
              onClick={() => cancelMut.mutate()}
              disabled={cancelMut.isPending}
              className="text-xs px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
              style={{ background: "color-mix(in srgb, var(--danger) 10%, transparent)", color: "var(--danger)" }}
            >
              {cancelMut.isPending ? "Cancelando..." : "Cancelar"}
            </button>
          )}
          {canConfirm && (
            <button
              onClick={() => confirmMut.mutate()}
              disabled={confirmMut.isPending}
              className="text-xs px-3 py-1.5 rounded-lg text-white transition-colors disabled:opacity-50"
              style={{ background: "var(--success)" }}
            >
              {confirmMut.isPending ? "..." : "Confirmar entrega"}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function MisPedidosPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated()) router.push("/login?redirect=/cuenta/pedidos");
  }, [isAuthenticated, router]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["my-orders"],
    queryFn: () => getMyOrders(),
    enabled: isAuthenticated(),
  });

  const orders: StoreOrder[] = (data?.data as { orders?: StoreOrder[] })?.orders ?? [];

  return (
    <div className="store-container py-12">
      <div className="max-w-2xl mx-auto">
        <Breadcrumb items={[
          { label: "Inicio", href: "/" },
          { label: "Mi cuenta", href: "/cuenta" },
          { label: "Mis pedidos" },
        ]} />
        <h1 className="section-title mb-8">Mis pedidos</h1>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => <OrderCardSkeleton key={i} />)}
          </div>
        ) : error ? (
          <div className="surface-card rounded-card p-12 text-center">
            <p className="font-medium" style={{ color: "var(--danger)" }}>No se pudieron cargar tus pedidos.</p>
            <p className="text-sm text-muted mt-1">Intenta de nuevo más tarde.</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="surface-card rounded-card p-16 text-center flex flex-col items-center gap-4">
            <svg className="w-14 h-14 text-muted opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
            </svg>
            <div>
              <h3 className="text-lg font-bold mb-1" style={{ color: "var(--foreground)" }}>No tienes pedidos aún</h3>
              <p className="text-sm text-muted">Cuando realices una compra aparecerá aquí.</p>
            </div>
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white mt-2"
              style={{ background: "var(--store-primary)" }}
            >
              Ver catálogo
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
