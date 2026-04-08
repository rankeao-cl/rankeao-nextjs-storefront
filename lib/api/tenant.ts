import { apiFetch } from "./client";
import type { Tenant } from "@/lib/types/tenant";
import type { ApiResponse } from "@/lib/types/api";

export async function getTenant(slugOrId: string): Promise<Tenant> {
  const res = await apiFetch<ApiResponse<Tenant>>(
    `/tenants/${encodeURIComponent(slugOrId)}`,
    undefined,
    { revalidate: 60 }
  );
  return (res.data ?? res) as Tenant;
}
