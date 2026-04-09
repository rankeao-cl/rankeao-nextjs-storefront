import CalabozoHeader from "../components/CalabozoHeader";
import CalabozoFooter from "../components/CalabozoFooter";
import BottomNav from "@/components/layout/BottomNav";     // We can keep the generic mobile bottom nav
import FloatingButtons from "@/components/layout/FloatingButtons";
import CartInitializer from "@/components/CartInitializer";

export function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <CartInitializer />
      <CalabozoHeader />
      <main id="main-content" className="flex-1 pb-20 md:pb-0">
        {children}
      </main>
      <CalabozoFooter />
      {/* Keeping generic mobile/floating menus for now */}
      <BottomNav />
      <FloatingButtons />
    </div>
  );
}
