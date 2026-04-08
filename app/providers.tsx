"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { TenantProvider } from "@/context/TenantContext";
import type { Tenant } from "@/lib/types/tenant";
import { Toast } from "@heroui/react/toast";

export function Providers({ tenant, children }: { tenant: Tenant; children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <TenantProvider tenant={tenant}>
          {children}
          <Toast.Provider placement="top end" />
        </TenantProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
