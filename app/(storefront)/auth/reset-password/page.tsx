"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { resetPassword } from "@/lib/api/auth";
import { useTenant } from "@/context/TenantContext";
import Image from "next/image";
import { toast } from "@heroui/react";

function ResetPasswordForm() {
  const tenant = useTenant();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.danger("Enlace inválido. Solicita uno nuevo desde la página de recuperación.");
    }
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.danger("Las contraseñas no coinciden.");
      return;
    }
    if (newPassword.length < 8) {
      toast.danger("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    setLoading(true);
    try {
      await resetPassword(token, newPassword);
      setDone(true);
      toast.success("Contraseña actualizada correctamente.");
    } catch {
      // handled by api client
    } finally {
      setLoading(false);
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

        <div className="rounded-2xl p-8 md:p-10" style={{ background: "var(--surface-solid)", boxShadow: "var(--shadow-elevated)" }}>
          <h2 className="text-2xl font-bold text-center mb-2" style={{ color: "var(--foreground)" }}>
            Nueva contraseña
          </h2>
          <p className="text-center text-sm mb-8 text-muted">
            Elige una contraseña segura para tu cuenta.
          </p>

          {done ? (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ background: "color-mix(in srgb, var(--success) 10%, transparent)" }}>
                <svg className="w-8 h-8" style={{ color: "var(--success)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-sm" style={{ color: "var(--foreground)" }}>
                Tu contraseña fue actualizada correctamente.
              </p>
              <motion.button
                onClick={() => router.push("/login")}
                className="w-full py-3.5 rounded-full font-semibold text-white"
                style={{ background: "var(--store-primary)" }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Ir al inicio de sesión
              </motion.button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* New password */}
              <div>
                <label className="block text-sm font-medium mb-2 text-muted">Nueva contraseña</label>
                <div className="relative">
                  <input
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={8}
                    className="w-full pr-12 pl-4 py-3 text-sm rounded-xl focus:outline-none transition-all"
                    style={{ background: "var(--field-background)", color: "var(--foreground)", border: "1.5px solid var(--border)" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "var(--store-primary)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                    placeholder="Mínimo 8 caracteres"
                  />
                  <button type="button" onClick={() => setShowNew(!showNew)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted" aria-label="Toggle">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      {showNew
                        ? <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                        : <><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></>
                      }
                    </svg>
                  </button>
                </div>
              </div>

              {/* Confirm password */}
              <div>
                <label className="block text-sm font-medium mb-2 text-muted">Confirmar contraseña</label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full pr-12 pl-4 py-3 text-sm rounded-xl focus:outline-none transition-all"
                    style={{ background: "var(--field-background)", color: "var(--foreground)", border: "1.5px solid var(--border)" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "var(--store-primary)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                    placeholder="Repite tu contraseña"
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted" aria-label="Toggle">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      {showConfirm
                        ? <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                        : <><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></>
                      }
                    </svg>
                  </button>
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={loading || !token}
                className="w-full py-3.5 rounded-full font-semibold text-white disabled:opacity-50"
                style={{ background: "var(--store-primary)" }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? "Guardando..." : "Guardar nueva contraseña"}
              </motion.button>
            </form>
          )}

          <div className="text-center text-sm mt-6">
            <Link href="/login" className="text-muted hover:underline">
              Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
