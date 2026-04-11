"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuthStore } from "@/lib/stores/auth-store";
import { changePassword } from "@/lib/api/auth";
import { toast } from "@heroui/react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Link from "next/link";

export default function CambiarContrasenaPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated()) router.push("/login?redirect=/cuenta/cambiar-contrasena");
  }, [isAuthenticated, router]);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.danger("Las contraseñas nuevas no coinciden.");
      return;
    }
    if (newPassword.length < 8) {
      toast.danger("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (newPassword === currentPassword) {
      toast.danger("La nueva contraseña debe ser diferente a la actual.");
      return;
    }
    setLoading(true);
    try {
      await changePassword(currentPassword, newPassword);
      setDone(true);
      toast.success("Contraseña actualizada correctamente.");
    } catch {
      // handled by api client
    } finally {
      setLoading(false);
    }
  }

  function PasswordField({
    id, label, value, onChange, placeholder
  }: {
    id: string;
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
  }) {
    const [show, setShow] = useState(false);
    return (
      <div>
        <label htmlFor={id} className="block text-sm font-medium mb-2 text-muted">{label}</label>
        <div className="relative">
          <input
            id={id}
            type={show ? "text" : "password"}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required
            className="w-full pl-4 pr-12 py-3 text-sm rounded-xl focus:outline-none transition-all"
            style={{ background: "var(--field-background)", color: "var(--foreground)", border: "1.5px solid var(--border)" }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--store-primary)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
            placeholder={placeholder}
          />
          <button type="button" onClick={() => setShow(!show)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted" aria-label="Toggle password">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              {show
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                : <><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></>
              }
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="store-container py-12">
      <div className="max-w-lg mx-auto">
        <Breadcrumb items={[
          { label: "Inicio", href: "/" },
          { label: "Mi cuenta", href: "/cuenta" },
          { label: "Cambiar contraseña" },
        ]} />
        <h1 className="section-title mb-8">Cambiar contraseña</h1>

        <div className="surface-card rounded-card p-8">
          {done ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6 py-4"
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
                style={{ background: "color-mix(in srgb, var(--success) 10%, transparent)" }}>
                <svg className="w-8 h-8" style={{ color: "var(--success)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold mb-2" style={{ color: "var(--foreground)" }}>Contraseña actualizada</h2>
                <p className="text-sm text-muted">Tu contraseña fue cambiada correctamente.</p>
              </div>
              <Link
                href="/cuenta"
                className="inline-block px-6 py-3 rounded-full font-semibold text-white"
                style={{ background: "var(--store-primary)" }}
              >
                Volver a mi cuenta
              </Link>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <PasswordField
                id="current-password"
                label="Contraseña actual"
                value={currentPassword}
                onChange={setCurrentPassword}
                placeholder="Tu contraseña actual"
              />
              <PasswordField
                id="new-password"
                label="Nueva contraseña"
                value={newPassword}
                onChange={setNewPassword}
                placeholder="Mínimo 8 caracteres"
              />
              <PasswordField
                id="confirm-password"
                label="Confirmar nueva contraseña"
                value={confirmPassword}
                onChange={setConfirmPassword}
                placeholder="Repite la nueva contraseña"
              />

              <div className="flex gap-3 pt-2">
                <Link
                  href="/cuenta"
                  className="flex-1 py-3 rounded-full font-semibold text-center border transition-colors"
                  style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
                >
                  Cancelar
                </Link>
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 rounded-full font-semibold text-white disabled:opacity-50"
                  style={{ background: "var(--store-primary)" }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? "Guardando..." : "Actualizar contraseña"}
                </motion.button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
