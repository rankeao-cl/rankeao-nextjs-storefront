import HomeClient from "@/features/home/HomeClient";
import type { Tenant } from "@/lib/types/tenant";

export function HomePage({ tenant }: { tenant?: Tenant }) {
  return <HomeClient />;
}
