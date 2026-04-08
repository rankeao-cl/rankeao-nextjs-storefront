"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTenant } from "@/context/TenantContext";
import { getCart, createCheckout } from "@/lib/api/store";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useCartStore } from "@/lib/stores/cart-store";
import { formatPrice } from "@/lib/utils/format";
import { useRouter } from "next/navigation";
import { toast } from "@heroui/react";
import type { StoreCheckoutRequest } from "@/lib/types/store";

type FieldErrors = Record<string, string>;

const REGIONES_CHILE = [
  "Arica y Parinacota", "Tarapaca", "Antofagasta", "Atacama", "Coquimbo",
  "Valparaiso", "Metropolitana", "O'Higgins", "Maule", "Nuble", "Bio Bio",
  "Araucania", "Los Rios", "Los Lagos", "Aysen", "Magallanes",
];

export default function CheckoutClient() {
  const tenant = useTenant();
  const router = useRouter();
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setItemCount = useCartStore((s) => s.setItemCount);

  const [deliveryMethod, setDeliveryMethod] = useState<"PICKUP" | "SHIPPING">("PICKUP");
  const [paymentMethod, setPaymentMethod] = useState<"TRANSFER" | "WEBPAY" | "MERCADOPAGO">("TRANSFER");
  const [address, setAddress] = useState({ name: "", address_line_1: "", city: "", region: "", postal_code: "", country: "CL", phone: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [acceptTerms, setAcceptTerms] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["cart", tenant.slug],
    queryFn: () => getCart(tenant.slug),
    enabled: isAuthenticated(),
  });

  const cart = data?.data;

  const checkoutMutation = useMutation({
    mutationFn: (payload: StoreCheckoutRequest) => createCheckout(tenant.slug, payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["cart", tenant.slug] });
      setItemCount(0);
      toast.success("Pedido creado exitosamente");
      const orderId = res?.data?.order?.id;
      router.push(orderId ? `/tracking?order=${orderId}` : "/");
    },
    onError: () => {
      toast.danger("Error al crear el pedido. Intenta nuevamente.");
    },
  });

  function validate(): FieldErrors {
    const errs: FieldErrors = {};
    if (!acceptTerms) errs.terms = "Debes aceptar los terminos y condiciones";
    if (deliveryMethod === "SHIPPING") {
      if (!address.name || address.name.length < 3) errs.name = "Nombre requerido (min 3 caracteres)";
      if (!address.address_line_1 || address.address_line_1.length < 5) errs.address = "Direccion requerida";
      if (!address.city) errs.city = "Ciudad requerida";
      if (!address.region) errs.region = "Region requerida";
      if (address.phone && !/^\+?569?\d{8}$/.test(address.phone.replace(/\s/g, ""))) {
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

    const payload: StoreCheckoutRequest = {
      delivery_method: deliveryMethod,
      payment_method: paymentMethod,
      ...(deliveryMethod === "SHIPPING" ? { shipping_address: address } : {}),
    };
    checkoutMutation.mutate(payload);
  }

  function fieldClass(field: string) {
    return `w-full bg-[var(--field-background)] text-foreground border ${
      errors[field] ? "border-danger" : "border-border"
    } rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--store-primary)]`;
  }

  if (!isAuthenticated()) {
    router.push("/login");
    return null;
  }

  if (isLoading) {
    return (
      <div className="store-container py-8 animate-pulse space-y-6">
        <div className="h-8 bg-[var(--surface-secondary)] rounded w-64" />
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="surface-card p-6 space-y-4">
              <div className="h-6 bg-[var(--surface-secondary)] rounded w-48" />
              <div className="h-12 bg-[var(--surface)] rounded" />
              <div className="h-12 bg-[var(--surface)] rounded" />
            </div>
          </div>
          <div className="surface-card p-6 h-fit space-y-4">
            <div className="h-6 bg-[var(--surface-secondary)] rounded w-40" />
            <div className="h-4 bg-[var(--surface)] rounded" />
            <div className="h-4 bg-[var(--surface)] rounded" />
            <div className="h-12 bg-[var(--surface-secondary)] rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    router.push("/carrito");
    return null;
  }

  return (
    <div className="store-container py-8">
      <h1 className="section-title mb-8">Finalizar compra</h1>

      <form onSubmit={handleCheckout} className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery */}
          <div className="surface-card p-6">
            <h2 className="font-bold text-foreground text-lg mb-4">Metodo de entrega</h2>
            <div className="space-y-3">
              <label className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${deliveryMethod === "PICKUP" ? "border-[var(--store-primary)] bg-[var(--store-primary-light)]" : "border-border hover:bg-[var(--surface)]"}`}>
                <input type="radio" name="delivery" value="PICKUP" checked={deliveryMethod === "PICKUP"} onChange={() => setDeliveryMethod("PICKUP")} className="accent-[var(--store-primary)]" />
                <div>
                  <p className="font-medium text-foreground">Retiro en tienda</p>
                  {tenant.address && <p className="text-sm text-muted">{tenant.address}, {tenant.city}</p>}
                </div>
              </label>
              <label className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${deliveryMethod === "SHIPPING" ? "border-[var(--store-primary)] bg-[var(--store-primary-light)]" : "border-border hover:bg-[var(--surface)]"}`}>
                <input type="radio" name="delivery" value="SHIPPING" checked={deliveryMethod === "SHIPPING"} onChange={() => setDeliveryMethod("SHIPPING")} className="accent-[var(--store-primary)]" />
                <div>
                  <p className="font-medium text-foreground">Envio a domicilio</p>
                  <p className="text-sm text-muted">Costo segun destino</p>
                </div>
              </label>
            </div>

            {deliveryMethod === "SHIPPING" && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <input placeholder="Nombre completo" value={address.name} onChange={(e) => setAddress({ ...address, name: e.target.value })} autoComplete="name" className={fieldClass("name")} />
                  {errors.name && <p className="text-danger text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <input placeholder="+569XXXXXXXX" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} autoComplete="tel" className={fieldClass("phone")} />
                  {errors.phone && <p className="text-danger text-xs mt-1">{errors.phone}</p>}
                </div>
                <div className="sm:col-span-2">
                  <input placeholder="Direccion" value={address.address_line_1} onChange={(e) => setAddress({ ...address, address_line_1: e.target.value })} autoComplete="street-address" className={fieldClass("address")} />
                  {errors.address && <p className="text-danger text-xs mt-1">{errors.address}</p>}
                </div>
                <div>
                  <input placeholder="Ciudad" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} autoComplete="address-level2" className={fieldClass("city")} />
                  {errors.city && <p className="text-danger text-xs mt-1">{errors.city}</p>}
                </div>
                <div className="relative">
                  <select value={address.region} onChange={(e) => setAddress({ ...address, region: e.target.value })} className={`${fieldClass("region")} appearance-none pr-9 cursor-pointer`}>
                    <option value="">Selecciona region</option>
                    {REGIONES_CHILE.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  {errors.region && <p className="text-danger text-xs mt-1">{errors.region}</p>}
                </div>
              </div>
            )}
          </div>

          {/* Payment */}
          <div className="surface-card p-6">
            <h2 className="font-bold text-foreground text-lg mb-4">Metodo de pago</h2>
            <div className="space-y-3">
              <label className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${paymentMethod === "TRANSFER" ? "border-[var(--store-primary)] bg-[var(--store-primary-light)]" : "border-border hover:bg-[var(--surface)]"}`}>
                <input type="radio" name="payment" value="TRANSFER" checked={paymentMethod === "TRANSFER"} onChange={() => setPaymentMethod("TRANSFER")} className="accent-[var(--store-primary)]" />
                <div className="flex items-center gap-3">
                  <svg className="w-8 h-6 text-muted shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                  <div>
                    <p className="font-medium text-foreground">Transferencia bancaria</p>
                    <p className="text-xs text-muted">Recibiras los datos bancarios por email</p>
                  </div>
                </div>
              </label>
              <label className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${paymentMethod === "WEBPAY" ? "border-[var(--store-primary)] bg-[var(--store-primary-light)]" : "border-border hover:bg-[var(--surface)]"}`}>
                <input type="radio" name="payment" value="WEBPAY" checked={paymentMethod === "WEBPAY"} onChange={() => setPaymentMethod("WEBPAY")} className="accent-[var(--store-primary)]" />
                <div className="flex items-center gap-3">
                  <svg className="w-8 h-6 text-muted shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20" strokeLinecap="round"/></svg>
                  <div>
                    <p className="font-medium text-foreground">Webpay (Transbank)</p>
                    <p className="text-xs text-muted">Pago inmediato con tarjeta de credito o debito</p>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Terms */}
          <div className="surface-card p-6">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} className="accent-[var(--store-primary)] mt-1" />
              <span className="text-sm text-foreground">
                He leido y acepto los{" "}
                <a href="/terminos" target="_blank" className="text-[var(--store-primary)] hover:underline">terminos y condiciones</a>.
                Todos los precios incluyen IVA. Derecho a retracto de 10 dias habiles segun ley del consumidor.
              </span>
            </label>
            {errors.terms && <p className="text-danger text-xs mt-2 ml-7">{errors.terms}</p>}
          </div>
        </div>

        {/* Order summary */}
        <div className="surface-card p-6 h-fit sticky top-24">
          <h2 className="font-bold text-foreground text-lg mb-4">Resumen del pedido</h2>
          <div className="space-y-2 text-sm mb-4">
            {cart.items.map((item) => (
              <div key={item.id} className="flex justify-between text-foreground">
                <span className="truncate mr-2">{item.name} x{item.quantity}</span>
                <span className="shrink-0">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-foreground"><span>Subtotal</span><span>{formatPrice(cart.subtotal)}</span></div>
            {cart.discount > 0 && (
              <div className="flex justify-between text-success"><span>Descuento</span><span>-{formatPrice(cart.discount)}</span></div>
            )}
            <div className="flex justify-between text-muted text-xs"><span>IVA incluido</span></div>
          </div>
          <div className="border-t border-border pt-4 mt-4 mb-6">
            <div className="flex justify-between font-bold text-lg text-foreground">
              <span>Total</span>
              <span className="text-[var(--store-primary)]">{formatPrice(cart.total)}</span>
            </div>
          </div>
          <button
            type="submit"
            disabled={checkoutMutation.isPending}
            className="w-full bg-[var(--store-primary)] text-white py-3 rounded-lg font-semibold hover:brightness-110 transition-all disabled:opacity-50"
          >
            {checkoutMutation.isPending ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
                Procesando...
              </span>
            ) : "Confirmar pedido"}
          </button>

          {/* Trust badges */}
          <div className="mt-4 pt-4 border-t border-border space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted">
              <svg className="w-4 h-4 text-success shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              Pago 100% seguro
            </div>
            <div className="flex items-center gap-2 text-xs text-muted">
              <svg className="w-4 h-4 text-success shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              Datos protegidos con SSL
            </div>
            <div className="flex items-center gap-2 text-xs text-muted">
              <svg className="w-4 h-4 text-muted shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20" strokeLinecap="round"/></svg>
              Webpay / Transferencia bancaria
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
