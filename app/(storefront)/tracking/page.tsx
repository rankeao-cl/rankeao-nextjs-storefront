"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useTenant } from "@/context/TenantContext";
import { getOrder, getOrderByTracking } from "@/lib/api/store";
import { useAuthStore } from "@/lib/stores/auth-store";
import { formatPrice } from "@/lib/utils/format";
import { Magnifier } from "@gravity-ui/icons";
import type { StoreOrder } from "@/lib/types/store";
import Breadcrumb from "@/components/ui/Breadcrumb";

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

const STATUS_STEPS = ["PENDING_PAYMENT", "PAID", "SHIPPED", "DELIVERED", "COMPLETED"] as const;

function OrderTimeline({ status }: { status: string }) {
  const currentIndex = STATUS_STEPS.indexOf(status as (typeof STATUS_STEPS)[number]);
  const isCancelled = status === "CANCELLED" || status === "REFUNDED";

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between relative">
        {/* Progress line */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-[var(--surface-secondary)]" />
        <div
          className="absolute top-4 left-0 h-0.5 bg-[var(--store-primary)] transition-all duration-500"
          style={{ width: isCancelled ? "0%" : `${Math.max(0, currentIndex) / (STATUS_STEPS.length - 1) * 100}%` }}
        />

        {STATUS_STEPS.map((step, i) => {
          const isCompleted = !isCancelled && i <= currentIndex;
          const isCurrent = !isCancelled && i === currentIndex;
          return (
            <div key={step} className="relative flex flex-col items-center z-10">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                isCompleted
                  ? "bg-[var(--store-primary)] text-white"
                  : "bg-[var(--surface-solid)] border-2 border-[var(--surface-secondary)] text-muted"
              } ${isCurrent ? "ring-4 ring-[var(--store-primary-light)]" : ""}`}>
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                ) : (
                  i + 1
                )}
              </div>
              <span className={`text-[10px] md:text-xs font-medium mt-2 text-center max-w-[70px] ${isCompleted ? "text-[var(--store-primary)]" : "text-muted"}`}>
                {STATUS_LABELS[step] || step}
              </span>
            </div>
          );
        })}
      </div>
      {isCancelled && (
        <div className="mt-4 text-center">
          <span className="inline-flex items-center gap-1.5 text-sm font-medium bg-danger/10 text-danger px-3 py-1.5 rounded-full">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            {STATUS_LABELS[status] || status}
          </span>
        </div>
      )}
    </div>
  );
}

export default function TrackingPage() {
  const tenant = useTenant();
  const searchParams = useSearchParams();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [orderNumber, setOrderNumber] = useState("");
  const [order, setOrder] = useState<StoreOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchOrder = useCallback(async (query: string) => {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setOrder(null);

    // If authenticated and query looks like a UUID, try the authenticated endpoint first
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (isAuthenticated() && uuidPattern.test(query.trim())) {
      try {
        const res = await getOrder(query.trim());
        const found = res?.data?.order;
        if (found) {
          setOrder(found);
          setLoading(false);
          return;
        }
      } catch {
        // fall through to order_number search
      }
    }

    // Try order-number tracking endpoint
    try {
      const res = await getOrderByTracking(tenant.slug, query.trim());
      const found = res?.data?.order;
      if (found) setOrder(found);
      else setError("No se encontró la orden");
    } catch {
      setError("No se pudo encontrar la orden. Verifica el número e intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }, [tenant.slug, isAuthenticated]);

  useEffect(() => {
    const orderParam = searchParams.get("order");
    if (orderParam) {
      setOrderNumber(orderParam);
      searchOrder(orderParam);
    }
  }, [searchParams, searchOrder]);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    searchOrder(orderNumber);
  }

  const shipment = order?.shipment;
  const trackingNumber = shipment?.tracking_number;
  const trackingUrl = shipment?.tracking_url;

  return (
    <div className="store-container py-12">
      <div className="max-w-2xl mx-auto">
        <Breadcrumb items={[{ label: "Inicio", href: "/" }, { label: "Seguimiento de pedido" }]} />
        <h1 className="section-title mb-6 text-center">Seguimiento de pedido</h1>
        <p className="text-muted text-center mb-8">
          Ingresa tu número de pedido para ver el estado de tu compra
        </p>

        <form onSubmit={handleSearch} className="flex gap-2 mb-8">
          <input
            type="text"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="Número de pedido"
            className="flex-1 bg-[var(--field-background)] text-foreground border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--store-primary)]"
          />
          <button type="submit" disabled={loading}
            className="bg-[var(--store-primary)] text-white px-6 rounded-lg hover:brightness-110 transition-all disabled:opacity-50">
            <Magnifier className="w-5 h-5" />
          </button>
        </form>

        {error && (
          <div className="text-center text-danger text-sm mb-4">{error}</div>
        )}

        {order && (
          <div className="surface-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-muted">Pedido</p>
                <p className="font-bold text-foreground text-lg">#{order.order_number || order.id}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                order.status === "COMPLETED" || order.status === "DELIVERED" ? "bg-success/10 text-success" :
                order.status === "CANCELLED" || order.status === "REFUNDED" ? "bg-danger/10 text-danger" :
                order.status === "SHIPPED" || order.status === "READY" ? "bg-warning/10 text-warning" :
                "bg-[var(--surface)] text-foreground"
              }`}>
                {STATUS_LABELS[order.status] || order.status}
              </span>
            </div>

            <OrderTimeline status={order.status} />

            {trackingNumber && (
              <div className="mb-4">
                <p className="text-sm text-muted">Número de seguimiento</p>
                <p className="text-foreground font-medium">{trackingNumber}</p>
                {trackingUrl && (
                  <a href={trackingUrl} target="_blank" rel="noopener noreferrer"
                    className="text-[var(--store-primary)] hover:underline text-sm">
                    Ver seguimiento del courier
                  </a>
                )}
              </div>
            )}

            {order.items && order.items.length > 0 && (
              <div className="border-t border-border pt-4 space-y-2">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm text-foreground">
                    <span>{item.product_name} x{item.quantity}</span>
                    <span>{formatPrice(item.unit_price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            )}
            {(!order.items || order.items.length === 0) && order.item_summary && (
              <div className="border-t border-border pt-4">
                <p className="text-sm text-muted">{order.item_summary}</p>
              </div>
            )}

            <div className="border-t border-border pt-4 mt-4">
              <div className="flex justify-between font-bold text-foreground">
                <span>Total</span>
                <span className="text-[var(--store-primary)]">{formatPrice(order.total)}</span>
              </div>
            </div>

            {order.buyer_notes && (
              <div className="mt-4 p-3 rounded-xl" style={{ background: "var(--surface)" }}>
                <p className="text-xs text-muted mb-1 font-medium">Tus notas para el vendedor</p>
                <p className="text-sm text-foreground italic">"{order.buyer_notes}"</p>
              </div>
            )}

            {order.created_at && (
              <p className="text-xs text-muted mt-4">
                Fecha: {new Date(order.created_at).toLocaleDateString("es-CL", { year: "numeric", month: "long", day: "numeric" })}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
