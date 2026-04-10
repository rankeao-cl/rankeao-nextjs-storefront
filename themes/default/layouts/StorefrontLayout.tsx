"use client";

import CartInitializer from "@/components/CartInitializer";
import DefaultHeader from "../components/DefaultHeader";
import DefaultFooter from "../components/DefaultFooter";

export function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-[#111111] text-white">
      <CartInitializer />
      <DefaultHeader />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <DefaultFooter />
    </div>
  );
}
