"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
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
    <div 
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: "var(--background)" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <Image 
            src={tenant.logo_url || "/assets/logos/LogoSuperior.png"} 
            alt={tenant.name} 
            width={180} 
            height={60} 
            className="h-14 w-auto mx-auto object-contain" 
          />
        </div>

        {/* Login card */}
        <div 
          className="rounded-2xl p-8 md:p-10"
          style={{ 
            background: "var(--surface-solid)",
            boxShadow: "var(--shadow-elevated)"
          }}
        >
          <h2 
            className="text-2xl font-bold text-center mb-8"
            style={{ color: "var(--foreground)" }}
          >
            Iniciar sesion
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: "var(--muted)" }}>
                Correo electronico
              </label>
              <div className="relative">
                <svg 
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" 
                  fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}
                  style={{ color: "var(--muted)" }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 text-sm rounded-xl focus:outline-none transition-all"
                  style={{ 
                    background: "var(--field-background)",
                    color: "var(--foreground)",
                    border: "1.5px solid var(--border)"
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = "var(--store-primary)"}
                  onBlur={(e) => e.currentTarget.style.borderColor = "var(--border)"}
                  placeholder="tu@correo.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2" style={{ color: "var(--muted)" }}>
                Contraseña
              </label>
              <div className="relative">
                <svg 
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" 
                  fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}
                  style={{ color: "var(--muted)" }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-11 pr-12 py-3 text-sm rounded-xl focus:outline-none transition-all"
                  style={{ 
                    background: "var(--field-background)",
                    color: "var(--foreground)",
                    border: "1.5px solid var(--border)"
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = "var(--store-primary)"}
                  onBlur={(e) => e.currentTarget.style.borderColor = "var(--border)"}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: "var(--muted)" }}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full font-semibold text-white transition-all disabled:opacity-50"
              style={{ background: "var(--store-primary)" }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
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
                  Ingresando...
                </span>
              ) : "Ingresar"}
            </motion.button>
          </form>

          {/* Links */}
          <div className="text-center text-sm mt-6 space-x-3">
            <Link href="/registro" className="font-medium" style={{ color: "var(--store-primary)" }}>
              Crear cuenta
            </Link>
            <span style={{ color: "var(--border)" }}>|</span>
            <Link href="/recuperar" className="transition-colors" style={{ color: "var(--muted)" }}>
              Olvidaste tu contraseña?
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
