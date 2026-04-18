"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Order, OrderStatus } from "@/types";
import { formatPrice } from "@/lib/utils";
import { getFontById } from "@/lib/fonts";
import { SIZE_LABELS } from "@/lib/products";
import { ChevronDown, ChevronRight, RefreshCw } from "lucide-react";

const STATUS_META: Record<
  OrderStatus,
  { label: string; color: string; next: OrderStatus | null }
> = {
  pending: { label: "Bekliyor", color: "bg-amber-100 text-amber-800", next: "processing" },
  processing: { label: "İşlemde", color: "bg-blue-100 text-blue-800", next: "completed" },
  completed: { label: "Tamamlandı", color: "bg-green-100 text-green-800", next: null },
  cancelled: { label: "İptal", color: "bg-red-100 text-red-800", next: null },
};

export function AdminClient({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const router = useRouter();

  async function updateStatus(id: string, status: OrderStatus) {
    setUpdating(id);
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      const updated: Order = await res.json();
      setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
    } catch {
      alert("Güncelleme başarısız");
    } finally {
      setUpdating(null);
    }
  }

  const visible = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div>
      {/* Filter */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {(["all", "pending", "processing", "completed", "cancelled"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              filter === f
                ? "bg-[var(--color-zen-dark)] text-white"
                : "bg-white border border-[var(--color-zen-border)] text-[var(--color-zen-muted)] hover:border-[var(--color-zen-stone)]"
            }`}
          >
            {f === "all"
              ? `Tümü (${orders.length})`
              : `${STATUS_META[f].label} (${orders.filter((o) => o.status === f).length})`}
          </button>
        ))}
        <button
          onClick={() => router.refresh()}
          className="ml-auto flex items-center gap-1.5 text-sm text-[var(--color-zen-muted)] hover:text-[var(--color-zen-dark)] transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Yenile
        </button>
      </div>

      {visible.length === 0 && (
        <div className="text-center py-16 text-[var(--color-zen-muted)]">
          Bu kategoride sipariş yok.
        </div>
      )}

      <div className="space-y-3">
        {visible.map((order) => {
          const meta = STATUS_META[order.status];
          const isOpen = expanded === order.id;
          const date = new Date(order.createdAt).toLocaleDateString("tr-TR", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-[var(--color-zen-border)] overflow-hidden"
            >
              {/* Header row */}
              <div
                className="flex items-center gap-4 p-5 cursor-pointer hover:bg-[var(--color-zen-cream)]/50 transition-colors"
                onClick={() => setExpanded(isOpen ? null : order.id)}
              >
                <span className="text-[var(--color-zen-muted)]">
                  {isOpen ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </span>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[var(--color-zen-dark)]">
                    {order.customer.name}
                  </p>
                  <p className="text-xs text-[var(--color-zen-muted)] font-mono truncate">
                    #{order.id.slice(0, 8)} · {date}
                  </p>
                </div>

                <div className="hidden sm:block text-sm text-[var(--color-zen-muted)]">
                  {order.items.length} ürün
                </div>

                <span
                  className={`${meta.color} text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap`}
                >
                  {meta.label}
                </span>

                <p className="font-bold text-[var(--color-zen-dark)] whitespace-nowrap">
                  {formatPrice(order.total)}
                </p>
              </div>

              {/* Expanded detail */}
              {isOpen && (
                <div className="border-t border-[var(--color-zen-border)] p-5 space-y-6">
                  {/* Customer info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-semibold text-[var(--color-zen-dark)] mb-2">
                        Müşteri Bilgileri
                      </h3>
                      <dl className="space-y-1 text-sm text-[var(--color-zen-muted)]">
                        <div className="flex gap-2">
                          <dt className="font-medium text-[var(--color-zen-dark)] w-16">Ad:</dt>
                          <dd>{order.customer.name}</dd>
                        </div>
                        <div className="flex gap-2">
                          <dt className="font-medium text-[var(--color-zen-dark)] w-16">Email:</dt>
                          <dd>
                            <a
                              href={`mailto:${order.customer.email}`}
                              className="text-[var(--color-zen-accent)] hover:underline"
                            >
                              {order.customer.email}
                            </a>
                          </dd>
                        </div>
                        <div className="flex gap-2">
                          <dt className="font-medium text-[var(--color-zen-dark)] w-16">Tel:</dt>
                          <dd>{order.customer.phone}</dd>
                        </div>
                      </dl>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[var(--color-zen-dark)] mb-2">
                        Teslimat Adresi
                      </h3>
                      <p className="text-sm text-[var(--color-zen-muted)]">
                        {order.customer.address}
                        <br />
                        {order.customer.postalCode} {order.customer.city}
                      </p>
                      {order.customer.notes && (
                        <p className="text-sm text-amber-700 bg-amber-50 rounded-lg p-2 mt-2">
                          Not: {order.customer.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Items */}
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--color-zen-dark)] mb-3">
                      Sipariş Kalemleri
                    </h3>
                    <div className="space-y-3">
                      {order.items.map((item) => {
                        const font = getFontById(item.customization.fontId);
                        return (
                          <div
                            key={item.id}
                            className="flex items-center gap-3 bg-[var(--color-zen-cream)] rounded-xl p-3"
                          >
                            <div
                              className="flex-none w-14 h-14 rounded-lg flex items-center justify-center text-xs font-bold overflow-hidden border border-[var(--color-zen-border)]"
                              style={{
                                backgroundColor: item.customization.bgColor,
                                color: item.customization.textColor,
                                fontFamily: font.family,
                                borderRadius:
                                  item.customization.shape === "circle" ? "9999px" : "0.5rem",
                              }}
                            >
                              <span className="text-center leading-tight px-1 text-[10px]">
                                {item.customization.text.slice(0, 15)}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-[var(--color-zen-dark)] text-sm">
                                {item.productName}
                              </p>
                              <p className="text-xs text-[var(--color-zen-muted)]">
                                Yazı: <strong>&ldquo;{item.customization.text}&rdquo;</strong>
                              </p>
                              <p className="text-xs text-[var(--color-zen-muted)]">
                                Font: {font.name} · Boyut: {SIZE_LABELS[item.customization.size]}
                              </p>
                              <p className="text-xs text-[var(--color-zen-muted)]">
                                Arka plan:{" "}
                                <span
                                  className="inline-block w-3 h-3 rounded-full border border-gray-300 align-middle"
                                  style={{ backgroundColor: item.customization.bgColor }}
                                />{" "}
                                {item.customization.bgColor} · Yazı rengi:{" "}
                                <span
                                  className="inline-block w-3 h-3 rounded-full border border-gray-300 align-middle"
                                  style={{ backgroundColor: item.customization.textColor }}
                                />{" "}
                                {item.customization.textColor}
                              </p>
                            </div>
                            <div className="text-right text-sm">
                              <p className="text-[var(--color-zen-muted)]">×{item.quantity}</p>
                              <p className="font-bold text-[var(--color-zen-dark)]">
                                {formatPrice(item.unitPrice * item.quantity)}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Status actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-[var(--color-zen-border)]">
                    <div className="flex gap-2 flex-wrap">
                      {(
                        [
                          { status: "pending" as const, label: "Bekliyor" },
                          { status: "processing" as const, label: "İşleme Al" },
                          { status: "completed" as const, label: "Tamamlandı" },
                          { status: "cancelled" as const, label: "İptal Et" },
                        ]
                      ).map(({ status, label }) => (
                        <button
                          key={status}
                          disabled={order.status === status || updating === order.id}
                          onClick={() => updateStatus(order.id, status)}
                          className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                            order.status === status
                              ? `${STATUS_META[status].color} cursor-default`
                              : "bg-[var(--color-zen-border)] text-[var(--color-zen-dark)] hover:bg-[var(--color-zen-stone)]/20"
                          }`}
                        >
                          {updating === order.id && order.status !== status ? "..." : label}
                        </button>
                      ))}
                    </div>
                    <p className="font-bold text-[var(--color-zen-dark)]">
                      Toplam: {formatPrice(order.total)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
