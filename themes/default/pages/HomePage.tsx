import type { Tenant } from "@/lib/types/tenant";

export function HomePage({ tenant }: { tenant: Tenant }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h2 className="text-4xl font-bold mb-4">Welcome to {tenant.name}</h2>
      <p className="text-xl text-gray-600">This is the default template.</p>
    </div>
  );
}
