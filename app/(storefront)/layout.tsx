import Header from "@/components/layout/Header";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";
import FloatingButtons from "@/components/layout/FloatingButtons";
import CartInitializer from "@/components/CartInitializer";

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CartInitializer />
      <Header />
      <Navbar />
      <main id="main-content" className="flex-1 pb-20 md:pb-0">
        {children}
      </main>
      <Footer />
      <BottomNav />
      <FloatingButtons />
    </>
  );
}
