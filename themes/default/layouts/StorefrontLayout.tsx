"use client";

import CartInitializer from "@/components/CartInitializer";
import DefaultHeader from "../components/DefaultHeader";
import DefaultFooter from "../components/DefaultFooter";
import BottomNav from "@/components/layout/BottomNav";
import FloatingButtons from "@/components/layout/FloatingButtons";

export function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen" style={{ background: "var(--background)", color: "var(--foreground)" }}>
      <CartInitializer />
      <DefaultHeader />
      <main id="main-content" className="flex-1 pb-20 md:pb-0">
        {children}
      </main>
      <DefaultFooter />
      <BottomNav />
      <FloatingButtons />
    </div>
  );
}
