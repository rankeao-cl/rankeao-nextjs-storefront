"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { verifyEmail, resendVerification } from "@/lib/api/auth";
import { useTenant } from "@/context/TenantContext";
import Image from "next/image";
import { toast } from "@heroui/react";

function VerifyEmailContent() {
  const tenant = useTenant();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [resendEmail, setResendEmail] = useState("");
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }
    verifyEmail(token)
      .then(() => setStatus("success"))
      .catch(() => setStatus("error"));
  }, [token]);

  async function handleResend(e: React.FormEvent) {
    e.preventDefault();
    if (!resendEmail.trim()) return;
    setResending(true);
    try {
      await resendVerification(resendEmail.trim());
      setResent(true);
      toast.success("Correo de verificación reenviado.");
    } catch {
      // handled by api client
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: "var(--background)" }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <Image
            src={tenant.logo_url || "/assets/logos/LogoSuperior.png"}
            alt={tenant.name}
            width={180}
            height={60}
            className="h-14 w-auto mx-auto object-contain"
          />
        </div>

        <div className="rounded-2xl p-8 md:p-10 text-center" style={{ background: "var(--surface-solid)", boxShadow: "var(--shadow-elevated)" }}>

          {status === "verifying" && (
            <div className="space-y-4">
              <motion.div
                className="w-16 h-16 rounded-full border-4 mx-auto"
                style={{ borderColor: "var(--store-primary)", borderTopColor: "transparent" }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <h2 className="text-xl font-bold" style={{ color: "var(--foreground)" }}>
                Verificando tu correo...
              </h2>
            </div>
          )}

          {status === "success" && (
            <div className="space-y-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
                style={{ background: "color-mix(in srgb, var(--success) 10%, transparent)" }}>
                <svg className="w-8 h-8" style={{ color: "var(--success)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--foreground)" }}>
                  ¡Correo verificado!
                </h2>
                <p className="text-sm text-muted">
                  Tu cuenta ha sido activada correctamente. Ya puedes acceder a todas las funciones.
                </p>
              </div>
              <Link
                href="/cuenta"
                className="inline-block w-full py-3.5 rounded-full font-semibold text-white text-center"
                style={{ background: "var(--store-primary)" }}
              >
                Ir a mi cuenta
              </Link>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
                style={{ background: "color-mix(in srgb, var(--danger) 10%, transparent)" }}>
                <svg className="w-8 h-8" style={{ color: "var(--danger)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold mb-2" style={{ color: "var(--foreground)" }}>
                  Enlace inválido o expirado
                </h2>
                <p className="text-sm text-muted">
                  El enlace de verificación no es válido o ya expiró. Solicita un nuevo correo de verificación.
                </p>
              </div>

              {!resent ? (
                <form onSubmit={handleResend} className="space-y-3">
                  <input
                    type="email"
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 text-sm rounded-xl focus:outline-none text-left"
                    style={{ background: "var(--field-background)", color: "var(--foreground)", border: "1.5px solid var(--border)" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "var(--store-primary)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                    placeholder="tu@correo.com"
                  />
                  <motion.button
                    type="submit"
                    disabled={resending}
                    className="w-full py-3.5 rounded-full font-semibold text-white disabled:opacity-50"
                    style={{ background: "var(--store-primary)" }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {resending ? "Enviando..." : "Reenviar correo de verificación"}
                  </motion.button>
                </form>
              ) : (
                <p className="text-sm" style={{ color: "var(--success)" }}>
                  Correo reenviado. Revisa tu bandeja de entrada.
                </p>
              )}

              <Link href="/login" className="block text-sm text-muted hover:underline">
                Volver al inicio de sesión
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailContent />
    </Suspense>
  );
}
