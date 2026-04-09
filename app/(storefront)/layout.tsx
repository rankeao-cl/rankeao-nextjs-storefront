import Header from "@/components/layout/Header";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";
import FloatingButtons from "@/components/layout/FloatingButtons";
import CartInitializer from "@/components/CartInitializer";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

import { getTenant } from "@/lib/api/tenant";
import { getThemeConfig } from "@/themes/registry";

export default async function StorefrontLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const slug = headersList.get("x-tenant-slug") || "__directory__";
  const pathname = headersList.get("x-pathname") || "/";

  if (slug === "__directory__") {
    if (pathname !== "/") {
      notFound();
    }
    return <main className="flex-1">{children}</main>;
  }

  // Use the slug to resolve the theme (getThemeConfig falls back to "default" if no match)
  const ThemeLayout = getThemeConfig(slug).layouts.StorefrontLayout;

  return <ThemeLayout>{children}</ThemeLayout>;
}
