"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTenant } from "@/context/TenantContext";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useCartStore } from "@/lib/stores/cart-store";
import { getCart } from "@/lib/api/store";

export default function CartInitializer() {
  const tenant = useTenant();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setItemCount = useCartStore((s) => s.setItemCount);

  const { data } = useQuery({
    queryKey: ["cart", tenant.slug],
    queryFn: () => getCart(tenant.slug),
    enabled: isAuthenticated(),
    staleTime: 2 * 60 * 1000,
  });

  useEffect(() => {
    if (data?.data?.items) {
      setItemCount(data.data.items.reduce((sum: number, item: {quantity: number}) => sum + item.quantity, 0));
    }
  }, [data, setItemCount]);

  return null;
}
