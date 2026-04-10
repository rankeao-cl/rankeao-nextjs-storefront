"use client";

import NosotrosContent from "@/features/static/NosotrosContent";
import type { Tenant } from "@/lib/types/tenant";

export function NosotrosPage({ tenant }: { tenant?: Tenant }) {
  return <NosotrosContent />;
}
