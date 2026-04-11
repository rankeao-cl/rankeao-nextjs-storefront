"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useTenant } from "@/context/TenantContext";
import { getCart, createCheckout } from "@/lib/api/store";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useCartStore } from "@/lib/stores/cart-store";
import { formatPrice } from "@/lib/utils/format";
import { useRouter } from "next/navigation";
import { toast } from "@heroui/react";
import type { StoreCheckoutRequest } from "@/lib/types/store";
import { FadeUp } from "@/lib/motion";

type FieldErrors = Record<string, string>;

const REGIONES_CHILE = [
  "Arica y Parinacota",
  "Tarapaca",
  "Antofagasta",
  "Atacama",
  "Coquimbo",
  "Valparaiso",
  "Metropolitana",
  "O'Higgins",
  "Maule",
  "Nuble",
  "Bio Bio",
  "Araucania",
  "Los Rios",
  "Los Lagos",
  "Aysen",
  "Magallanes",
];

// Progress steps
const STEPS = [
  { label: "Entrega", icon: "truck" },
  { label: "Pago", icon: "card" },
  { label: "Confirmacion", icon: "check" },
];

function StepIcon({ type, active, completed }: { type: string; active: boolean; completed: boolean }) {
  const color = completed ? "white" : active ? "white" : "var(--muted)";
  if (type === "truck") {
    return (
      <svg className="w-4 h-4" fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    );
  }
  if (type === "card") {
    return (
      <svg className="w-4 h-4" fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
      </svg>
    );
  }
  return (
    <svg className="w-4 h-4" fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

export default function CheckoutClient() {
  const tenant = useTenant();
  const router = useRouter();
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setItemCount = useCartStore((s) => s.setItemCount);
  const authenticated = isAuthenticated();

  const username = useAuthStore((s) => s.username);
  const [deliveryMethod, setDeliveryMethod] = useState<"PICKUP" | "SHIPPING">("PICKUP");
  const [paymentMethod, setPaymentMethod] = useState<"TRANSFER" | "WEBPAY" | "MERCADOPAGO">("TRANSFER");
  const [address, setAddress] = useState({
    name: "",
    address: "",
    city: "",
    region: "",
    postal_code: "",
    country: "CL",
    phone: "",
  });
  const [buyerNotes, setBuyerNotes] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [acceptTerms, setAcceptTerms] = useState(false);

  const currentStep = deliveryMethod && paymentMethod ? 2 : deliveryMethod ? 1 : 0;

  const { data, isLoading } = useQuery({
    queryKey: ["cart", tenant.slug],
    queryFn: () => getCart(tenant.slug),
    enabled: authenticated,
  });

  const cart = data?.data;

  useEffect(() => {
    if (!authenticated) {
      router.replace("/login");
    }
  }, [authenticated, router]);

  useEffect(() => {
    if (authenticated && !isLoading && (!cart || cart.items.length === 0)) {
      router.replace("/carrito");
    }
  }, [authenticated, isLoading, cart, router]);

  const checkoutMutation = useMutation({
    mutationFn: (payload: StoreCheckoutRequest) =>
      createCheckout(tenant.slug, payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["cart", tenant.slug] });
      setItemCount(0);
      // If the payment provider returned a redirect URL (Webpay / MercadoPago), follow it.
      // Otherwise, go to the buyer orders page.
      const paymentUrl = (res?.data as { payment_url?: string })?.payment_url;
      const orderNumber = res?.data?.order?.order_number;
      if (paymentUrl) {
        toast.success("Redirigiendo al pago...");
        window.location.href = paymentUrl;
      } else {
        toast.success("Pedido creado exitosamente");
        router.push(orderNumber ? `/tracking?order=${orderNumber}` : "/cuenta/pedidos");
      }
    },
    onError: () => {
      toast.danger("Error al crear el pedido. Intenta nuevamente.");
    },
  });

  function validate(): FieldErrors {
    const errs: FieldErrors = {};
    if (!acceptTerms) errs.terms = "Debes aceptar los terminos y condiciones";
    if (deliveryMethod === "SHIPPING") {
      if (!address.name || address.name.length < 3)
        errs.name = "Nombre requerido (min 3 caracteres)";
      if (!address.address || address.address.length < 5)
        errs.address = "Direccion requerida";
      if (!address.city) errs.city = "Ciudad requerida";
      if (!address.region) errs.region = "Region requerida";
      if (!address.phone) {
        errs.phone = "Telefono requerido";
      } else if (!/^\+?569?\d{8}$/.test(address.phone.replace(/\s/g, ""))) {
        errs.phone = "Formato: +569XXXXXXXX";
      }
    }
    return errs;
  }

  function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const shippingAddress =
      deliveryMethod === "SHIPPING"
        ? {
            name: address.name.trim(),
            phone: address.phone.replace(/\s/g, ""),
            address: address.address.trim(),
            city: address.city.trim(),
            region: address.region.trim(),
            postal_code: address.postal_code?.trim() || undefined,
            country: address.country,
          }
        : undefined;

    const payload: StoreCheckoutRequest = {
      delivery_method: deliveryMethod,
      payment_method: paymentMethod,
      ...(buyerNotes.trim() ? { buyer_notes: buyerNotes.trim() } : {}),
      ...(shippingAddress ? { shipping_address: shippingAddress } : {}),
    };
    checkoutMutation.mutate(payload);
  }

  function fieldClass(field: string) {
    return `w-full text-sm rounded-xl px-4 py-3 focus:outline-none transition-all ${
      errors[field] ? "border-2 border-[var(--danger)]" : "border border-transparent"
    }`;
  }

  if (!authenticated) return null;

  if (isLoading) {
    return (
      <div className="store-container py-8 space-y-6">
        <div className="h-8 rounded-xl w-64 skeleton-shimmer" style={{ background: "var(--surface)" }} />
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl p-6 space-y-4" style={{ background: "var(--surface-solid)" }}>
              <div className="h-6 rounded-lg w-48 skeleton-shimmer" style={{ background: "var(--surface)" }} />
              <div className="h-14 rounded-xl skeleton-shimmer" style={{ background: "var(--surface)" }} />
              <div className="h-14 rounded-xl skeleton-shimmer" style={{ background: "var(--surface)" }} />
            </div>
          </div>
          <div className="rounded-2xl p-6 h-fit space-y-4" style={{ background: "var(--surface-solid)" }}>
            <div className="h-6 rounded-lg w-40 skeleton-shimmer" style={{ background: "var(--surface)" }} />
            <div className="h-4 rounded skeleton-shimmer" style={{ background: "var(--surface)" }} />
            <div className="h-4 rounded skeleton-shimmer" style={{ background: "var(--surface)" }} />
            <div className="h-12 rounded-full skeleton-shimmer" style={{ background: "var(--surface)" }} />
          </div>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) return null;

  return (
    <div className="store-container py-8 md:py-12">
      <FadeUp>
        <h1 className="section-title mb-2">Finalizar compra</h1>
        {username && (
          <p className="text-sm text-muted mb-6">
            Comprando como <span className="font-bold" style={{ color: "var(--store-primary)" }}>@{username}</span>
          </p>
        )}
      </FadeUp>

      {/* Progress steps */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex items-center justify-center gap-0 mb-10"
      >
        {STEPS.map((step, i) => {
          const completed = i < currentStep;
          const active = i === currentStep;
          return (
            <div key={step.label} className="flex items-center">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
                  style={{
                    background: completed || active ? "var(--store-primary)" : "var(--surface)",
                  }}
                >
                  <StepIcon type={step.icon} active={active} completed={completed} />
                </div>
                <span className="text-[11px] font-medium" style={{ color: completed || active ? "var(--store-primary)" : "var(--muted)" }}>
                  {step.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className="w-12 md:w-20 h-[2px] mx-2 mb-5 rounded-full transition-all"
                  style={{ background: completed ? "var(--store-primary)" : "var(--surface-secondary)" }}
                />
              )}
            </div>
          );
        })}
      </motion.div>

      <form onSubmit={handleCheckout} className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="rounded-2xl p-5 md:p-6"
            style={{ background: "var(--surface-solid)", boxShadow: "var(--shadow-card)" }}
          >
            <h2 className="font-bold text-lg mb-4" style={{ color: "var(--foreground)" }}>
              Metodo de entrega
            </h2>
            <div className="space-y-3">
              <label
                className="flex items-center gap-4 p-4 border-2 rounded-2xl cursor-pointer transition-all"
                style={{
                  borderColor: deliveryMethod === "PICKUP" ? "var(--store-primary)" : "var(--border)",
                  background: deliveryMethod === "PICKUP" ? "var(--store-primary-light)" : "transparent"
                }}
              >
                <input
                  type="radio"
                  name="delivery"
                  value="PICKUP"
                  checked={deliveryMethod === "PICKUP"}
                  onChange={() => setDeliveryMethod("PICKUP")}
                  className="accent-[var(--store-primary)]"
                />
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: "var(--surface)" }}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} style={{ color: "var(--muted)" }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: "var(--foreground)" }}>
                      Retiro en tienda
                    </p>
                    {tenant.address && (
                      <p className="text-sm" style={{ color: "var(--muted)" }}>
                        {tenant.address}{tenant.city ? `, ${tenant.city}` : ""}
                      </p>
                    )}
                  </div>
                </div>
              </label>
              <label
                className="flex items-center gap-4 p-4 border-2 rounded-2xl cursor-pointer transition-all"
                style={{
                  borderColor: deliveryMethod === "SHIPPING" ? "var(--store-primary)" : "var(--border)",
                  background: deliveryMethod === "SHIPPING" ? "var(--store-primary-light)" : "transparent"
                }}
              >
                <input
                  type="radio"
                  name="delivery"
                  value="SHIPPING"
                  checked={deliveryMethod === "SHIPPING"}
                  onChange={() => setDeliveryMethod("SHIPPING")}
                  className="accent-[var(--store-primary)]"
                />
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: "var(--surface)" }}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} style={{ color: "var(--muted)" }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: "var(--foreground)" }}>
                      Envio a domicilio
                    </p>
                    <p className="text-sm" style={{ color: "var(--muted)" }}>Costo segun destino</p>
                  </div>
                </div>
              </label>
            </div>

            {deliveryMethod === "SHIPPING" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
                className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3"
              >
                <div>
                  <input
                    placeholder="Nombre completo"
                    value={address.name}
                    onChange={(e) => setAddress({ ...address, name: e.target.value })}
                    autoComplete="name"
                    className={fieldClass("name")}
                    style={{ background: "var(--field-background)", color: "var(--foreground)" }}
                  />
                  {errors.name && (<p className="text-xs mt-1" style={{ color: "var(--danger)" }}>{errors.name}</p>)}
                </div>
                <div>
                  <input
                    placeholder="+569XXXXXXXX"
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    autoComplete="tel"
                    className={fieldClass("phone")}
                    style={{ background: "var(--field-background)", color: "var(--foreground)" }}
                  />
                  {errors.phone && (<p className="text-xs mt-1" style={{ color: "var(--danger)" }}>{errors.phone}</p>)}
                </div>
                <div className="sm:col-span-2">
                  <input
                    placeholder="Direccion"
                    value={address.address}
                    onChange={(e) => setAddress({ ...address, address: e.target.value })}
                    autoComplete="street-address"
                    className={fieldClass("address")}
                    style={{ background: "var(--field-background)", color: "var(--foreground)" }}
                  />
                  {errors.address && (<p className="text-xs mt-1" style={{ color: "var(--danger)" }}>{errors.address}</p>)}
                </div>
                <div>
                  <input
                    placeholder="Ciudad"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    autoComplete="address-level2"
                    className={fieldClass("city")}
                    style={{ background: "var(--field-background)", color: "var(--foreground)" }}
                  />
                  {errors.city && (<p className="text-xs mt-1" style={{ color: "var(--danger)" }}>{errors.city}</p>)}
                </div>
                <div className="relative">
                  <select
                    value={address.region}
                    onChange={(e) => setAddress({ ...address, region: e.target.value })}
                    className={`${fieldClass("region")} appearance-none pr-9 cursor-pointer`}
                    style={{ background: "var(--field-background)", color: "var(--foreground)" }}
                  >
                    <option value="">Selecciona region</option>
                    {REGIONES_CHILE.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} style={{ color: "var(--muted)" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                  {errors.region && (<p className="text-xs mt-1" style={{ color: "var(--danger)" }}>{errors.region}</p>)}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Payment */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="rounded-2xl p-5 md:p-6"
            style={{ background: "var(--surface-solid)", boxShadow: "var(--shadow-card)" }}
          >
            <h2 className="font-bold text-lg mb-4" style={{ color: "var(--foreground)" }}>
              Metodo de pago
            </h2>
            <div className="space-y-3">
              {[
                { value: "TRANSFER" as const, label: "Transferencia bancaria", desc: "Recibiras los datos bancarios por email", icon: "bank" },
                { value: "WEBPAY" as const, label: "Webpay (Transbank)", desc: "Pago inmediato con tarjeta", icon: "card" },
              ].map((pm) => (
                <label
                  key={pm.value}
                  className="flex items-center gap-4 p-4 border-2 rounded-2xl cursor-pointer transition-all"
                  style={{
                    borderColor: paymentMethod === pm.value ? "var(--store-primary)" : "var(--border)",
                    background: paymentMethod === pm.value ? "var(--store-primary-light)" : "transparent"
                  }}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={pm.value}
                    checked={paymentMethod === pm.value}
                    onChange={() => setPaymentMethod(pm.value)}
                    className="accent-[var(--store-primary)]"
                  />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: "var(--surface)" }}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} style={{ color: "var(--muted)" }}>
                        {pm.icon === "bank" ? (
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                        )}
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium" style={{ color: "var(--foreground)" }}>{pm.label}</p>
                      <p className="text-xs" style={{ color: "var(--muted)" }}>{pm.desc}</p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </motion.div>

          {/* Buyer Notes */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.22 }}
            className="rounded-2xl p-5 md:p-6"
            style={{ background: "var(--surface-solid)", boxShadow: "var(--shadow-card)" }}
          >
            <h2 className="font-bold text-base mb-3" style={{ color: "var(--foreground)" }}>
              Notas para el vendedor
            </h2>
            <textarea
              value={buyerNotes}
              onChange={(e) => setBuyerNotes(e.target.value)}
              placeholder="Instrucciones especiales, horario de entrega, etc. (opcional)"
              rows={3}
              className="w-full text-sm rounded-xl px-4 py-3 focus:outline-none transition-all border border-transparent resize-none"
              style={{ background: "var(--field-background)", color: "var(--foreground)" }}
            />
          </motion.div>

          {/* Terms */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="rounded-2xl p-5 md:p-6"
            style={{ background: "var(--surface-solid)", boxShadow: "var(--shadow-card)" }}
          >
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="accent-[var(--store-primary)] mt-1"
              />
              <span className="text-sm" style={{ color: "var(--foreground)" }}>
                He leido y acepto los{" "}
                <a href="/terminos" target="_blank" className="font-medium" style={{ color: "var(--store-primary)" }}>
                  terminos y condiciones
                </a>
                . Todos los precios incluyen IVA. Derecho a retracto de 10 dias habiles segun ley del consumidor.
              </span>
            </label>
            {errors.terms && (
              <p className="text-xs mt-2 ml-7" style={{ color: "var(--danger)" }}>{errors.terms}</p>
            )}
          </motion.div>
        </div>

        {/* Order summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl p-6 h-fit sticky top-24"
          style={{ background: "var(--surface-solid)", boxShadow: "var(--shadow-card)" }}
        >
          <h2 className="font-bold text-lg mb-4" style={{ color: "var(--foreground)" }}>
            Resumen del pedido
          </h2>
          <div className="space-y-2 text-sm mb-4">
            {cart.items.map((item) => (
              <div key={item.id} className="flex justify-between" style={{ color: "var(--foreground)" }}>
                <span className="truncate mr-2">{item.name} x{item.quantity}</span>
                <span className="shrink-0">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="pt-4 space-y-2 text-sm" style={{ borderTop: "1px solid var(--border)" }}>
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
            <div className="flex justify-between text-xs" style={{ color: "var(--muted)" }}>
              <span>IVA incluido</span>
            </div>
          </div>
          <div className="pt-4 mt-4 mb-6" style={{ borderTop: "1px solid var(--border)" }}>
            <div className="flex justify-between font-bold text-lg">
              <span style={{ color: "var(--foreground)" }}>Total</span>
              <span style={{ color: "var(--store-primary)" }}>{formatPrice(cart.total)}</span>
            </div>
          </div>
          <motion.button
            type="submit"
            disabled={checkoutMutation.isPending}
            className="w-full py-4 rounded-full font-semibold text-white transition-all disabled:opacity-50"
            style={{ background: "var(--store-primary)" }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {checkoutMutation.isPending ? (
              <span className="flex items-center justify-center gap-2">
                <motion.svg
                  className="w-5 h-5"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </motion.svg>
                Procesando...
              </span>
            ) : (
              "Confirmar pedido"
            )}
          </motion.button>

          {/* Trust badges */}
          <div className="mt-5 pt-5 space-y-2.5" style={{ borderTop: "1px solid var(--border)" }}>
            {[
              { icon: "lock", label: "Pago 100% seguro" },
              { icon: "shield", label: "Datos protegidos con SSL" },
              { icon: "card", label: "Webpay / Transferencia bancaria" },
            ].map((badge) => (
              <div key={badge.label} className="flex items-center gap-2.5 text-xs" style={{ color: "var(--muted)" }}>
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} style={{ color: "var(--success)" }}>
                  {badge.icon === "lock" && (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  )}
                  {badge.icon === "shield" && (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  )}
                  {badge.icon === "card" && (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                  )}
                </svg>
                {badge.label}
              </div>
            ))}
          </div>
        </motion.div>
      </form>
    </div>
  );
}
