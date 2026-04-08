"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { loginAuth } from "@/lib/api/auth";
import { normalizeAuthSession, useAuthStore } from "@/lib/stores/auth-store";
import { useTenant } from "@/context/TenantContext";
import Image from "next/image";
import { toast } from "@heroui/react";

export default function LoginForm() {
  const tenant = useTenant();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";
  const setAuth = useAuthStore((s) => s.setAuth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginAuth({ email, password });
      const session = normalizeAuthSession(res, email);
      setAuth(session);
      toast.success("Sesion iniciada");
      router.push(redirectTo);
    } catch {
      // handled by api client
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Image src={tenant.logo_url || "/assets/logos/LogoSuperior.png"} alt={tenant.name} width={180} height={60} className="h-16 w-auto mx-auto object-contain" />
        </div>

        <form onSubmit={handleSubmit} className="surface-card p-8 space-y-5">
          <h2 className="text-xl font-bold text-foreground text-center">Iniciar sesion</h2>

          <div>
            <label htmlFor="email" className="block text-sm text-muted mb-1">Correo electronico</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[var(--field-background)] text-foreground border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--store-primary)]"
              placeholder="tu@correo.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm text-muted mb-1">Contraseña</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[var(--field-background)] text-foreground border border-border rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:border-[var(--store-primary)]"
                placeholder="********"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--store-primary)] text-white py-3 rounded-lg font-semibold hover:brightness-110 transition-all disabled:opacity-50"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>

          <div className="text-center text-sm">
            <Link href="/registro" className="text-[var(--store-primary)] hover:underline">
              Crear cuenta
            </Link>
            <span className="text-muted mx-2">|</span>
            <Link href="/recuperar" className="text-muted hover:text-foreground">
              Olvidaste tu contraseña?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
