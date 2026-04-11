"use client";

import { useState } from "react";
import Link from "next/link";
import { useTenant } from "@/context/TenantContext";
import { forgotPassword } from "@/lib/api/auth";
import { toast } from "@heroui/react";
import Image from "next/image";

export default function RecuperarPage() {
  const tenant = useTenant();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      await forgotPassword(email.trim());
      setSent(true);
      toast.success("Correo enviado. Revisa tu bandeja de entrada.");
    } catch {
      toast.danger("No se pudo enviar el correo. Verifica tu email e intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--background)" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Image
            src={tenant.logo_url || "/assets/logos/LogoSuperior.png"}
            alt={tenant.name}
            width={180}
            height={60}
            className="h-16 w-auto mx-auto object-contain"
          />
        </div>

        <div className="surface-card p-8 space-y-5">
          <h2 className="text-xl font-bold text-foreground text-center">Recuperar contraseña</h2>

          {sent ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-foreground text-sm">
                Hemos enviado un correo a <strong>{email}</strong> con las instrucciones para restablecer tu contraseña.
              </p>
              <p className="text-muted text-xs">
                Si no lo ves en tu bandeja de entrada, revisa la carpeta de spam.
              </p>
              <Link
                href="/login"
                className="inline-block text-[var(--store-primary)] hover:underline text-sm font-medium"
              >
                Volver al inicio de sesion
              </Link>
            </div>
          ) : (
            <>
              <p className="text-muted text-sm text-center">
                Ingresa tu correo electronico y te enviaremos un enlace para restablecer tu contraseña.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="recover-email" className="block text-sm text-muted mb-1">
                    Correo electronico
                  </label>
                  <input
                    id="recover-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-[var(--field-background)] text-foreground border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--store-primary)]"
                    placeholder="tu@correo.com"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[var(--store-primary)] text-white py-3 rounded-lg font-semibold hover:brightness-110 transition-all disabled:opacity-50"
                >
                  {loading ? "Enviando..." : "Enviar enlace de recuperacion"}
                </button>
              </form>

              <div className="text-center text-sm">
                <Link href="/login" className="text-[var(--store-primary)] hover:underline">
                  Volver al inicio de sesion
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
