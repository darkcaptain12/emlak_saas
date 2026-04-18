import { readOrders } from "@/lib/db";
import { AdminClient } from "./AdminClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const orders = readOrders();
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-zen-dark)]">Admin Paneli</h1>
          <p className="text-[var(--color-zen-muted)] mt-1">
            Toplam {orders.length} sipariş
          </p>
        </div>
        <div className="flex gap-3">
          {(
            [
              { label: "Bekliyor", key: "pending", color: "bg-amber-100 text-amber-800" },
              { label: "İşlemde", key: "processing", color: "bg-blue-100 text-blue-800" },
              { label: "Tamamlandı", key: "completed", color: "bg-green-100 text-green-800" },
              { label: "İptal", key: "cancelled", color: "bg-red-100 text-red-800" },
            ] as const
          ).map(({ label, key, color }) => (
            <span key={key} className={`${color} text-xs font-medium px-3 py-1.5 rounded-full`}>
              {label}: {orders.filter((o) => o.status === key).length}
            </span>
          ))}
        </div>
      </div>
      <AdminClient initialOrders={orders} />
    </div>
  );
}
