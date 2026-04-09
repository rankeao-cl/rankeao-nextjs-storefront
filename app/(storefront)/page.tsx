import React from "react";
import HomeClient from "@/features/home/HomeClient";
import { headers } from "next/headers";

import { getTenant } from "@/lib/api/tenant";
import { getThemeConfig } from "@/themes/registry";

export default async function HomePage() {
  const headersList = await headers();
  const slug = headersList.get("x-tenant-slug") || "__directory__";

  if (slug === "__directory__") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 flex-col gap-4 text-center px-4">
        <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">Directorio Rankeao</h1>
        <p className="text-gray-600 text-lg max-w-md">
          Bienvenido al directorio central de tiendas TCG. Para visitar una tienda directamente, ingresa a su url o subdominio.
        </p>
        <p className="text-gray-400 text-sm">
          Ejemplo: <span className="font-semibold text-gray-500">calabozo.rankeao.cl</span> o <span className="font-semibold text-gray-500">bluecard.cl</span>
        </p>
      </div>
    );
  }

  let tenantData = null;
  try {
      tenantData = await getTenant(slug);
  } catch (e) {
      // Return empty if failure
      return null;
  }

  const ThemeHome = getThemeConfig(slug).pages.HomePage;

  return <ThemeHome tenant={tenantData} />;
}
