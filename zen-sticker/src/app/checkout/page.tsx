"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartProvider";
import { formatPrice } from "@/lib/utils";
import { getFontById } from "@/lib/fonts";
import { SIZE_LABELS } from "@/lib/products";
import type { CustomerInfo } from "@/types";
import { Loader2 } from "lucide-react";

const INITIAL: CustomerInfo = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  postalCode: "",
  notes: "",
};

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const router = useRouter();
  const [form, setForm] = useState<CustomerInfo>(INITIAL);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<CustomerInfo>>({});

  function setField<K extends keyof CustomerInfo>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate(): boolean {
    const e: Partial<CustomerInfo> = {};
    if (!form.name.trim()) e.name = "Ad soyad gerekli";
    if (!form.email.includes("@")) e.email = "Geçerli e-posta girin";
    if (!form.phone.trim()) e.phone = "Telefon gerekli";
    if (!form.address.trim()) e.address = "Adres gerekli";
    if (!form.city.trim()) e.city = "Şehir gerekli";
    if (!form.postalCode.trim()) e.postalCode = "Posta kodu gerekli";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    if (items.length === 0) return;

    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer: form, items, total }),
      });
      if (!res.ok) throw new Error("Sipariş oluşturulamadı");
      const order = await res.json();
      clearCart();
      router.push(`/success?id=${order.id}`);
    } catch {
      alert("Bir hata oluştu, lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <p className="text-[var(--color-zen-muted)]">Sepetiniz boş.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-[var(--color-zen-dark)] mb-8">Sipariş Ver</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-5">
          <h2 className="text-lg font-semibold text-[var(--color-zen-dark)]">Teslimat Bilgileri</h2>

          {([
            { key: "name", label: "Ad Soyad", type: "text", placeholder: "Ahmet Yılmaz" },
            { key: "email", label: "E-posta", type: "email", placeholder: "ahmet@ornek.com" },
            { key: "phone", label: "Telefon", type: "tel", placeholder: "05XX XXX XX XX" },
          ] as const).map(({ key, label, type, placeholder }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-[var(--color-zen-dark)] mb-1">
                {label}
              </label>
              <input
                type={type}
                placeholder={placeholder}
                value={form[key]}
                onChange={(e) => setField(key, e.target.value)}
                className="w-full border border-[var(--color-zen-border)] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-zen-accent)] bg-white text-[var(--color-zen-dark)]"
              />
              {errors[key] && (
                <p className="text-xs text-red-500 mt-1">{errors[key]}</p>
              )}
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-[var(--color-zen-dark)] mb-1">
              Adres
            </label>
            <textarea
              rows={2}
              placeholder="Mahalle, cadde, sokak, kapı no, daire"
              value={form.address}
              onChange={(e) => setField("address", e.target.value)}
              className="w-full border border-[var(--color-zen-border)] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-zen-accent)] bg-white text-[var(--color-zen-dark)] resize-none"
            />
            {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-zen-dark)] mb-1">
                Şehir
              </label>
              <input
                type="text"
                placeholder="İstanbul"
                value={form.city}
                onChange={(e) => setField("city", e.target.value)}
                className="w-full border border-[var(--color-zen-border)] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-zen-accent)] bg-white text-[var(--color-zen-dark)]"
              />
              {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-zen-dark)] mb-1">
                Posta Kodu
              </label>
              <input
                type="text"
                placeholder="34000"
                value={form.postalCode}
                onChange={(e) => setField("postalCode", e.target.value)}
                className="w-full border border-[var(--color-zen-border)] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-zen-accent)] bg-white text-[var(--color-zen-dark)]"
              />
              {errors.postalCode && (
                <p className="text-xs text-red-500 mt-1">{errors.postalCode}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-zen-dark)] mb-1">
              Sipariş Notu (opsiyonel)
            </label>
            <textarea
              rows={2}
              placeholder="Özel talepler, renk alternatifleri..."
              value={form.notes}
              onChange={(e) => setField("notes", e.target.value)}
              className="w-full border border-[var(--color-zen-border)] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-zen-accent)] bg-white text-[var(--color-zen-dark)] resize-none"
            />
          </div>

          <div className="bg-amber-50 rounded-xl p-4 text-sm text-amber-800">
            Bu geliştirme aşamasındadır. Ödeme entegrasyonu henüz aktif değildir.
            Siparişiniz alındıktan sonra sizinle iletişime geçeceğiz.
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[var(--color-zen-accent)] text-white py-4 rounded-2xl font-semibold text-base hover:bg-[var(--color-zen-accent-light)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
            {loading ? "Sipariş Veriliyor..." : "Siparişi Onayla"}
          </button>
        </form>

        {/* Order summary */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-[var(--color-zen-border)] p-5 sticky top-24">
            <h2 className="font-semibold text-[var(--color-zen-dark)] mb-4">Sipariş Özeti</h2>
            <div className="space-y-3">
              {items.map((item) => {
                const font = getFontById(item.customization.fontId);
                return (
                  <div key={item.id} className="flex gap-3 text-sm">
                    <div
                      className="flex-none w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold overflow-hidden"
                      style={{
                        backgroundColor: item.customization.bgColor,
                        color: item.customization.textColor,
                        fontFamily: font.family,
                        borderRadius:
                          item.customization.shape === "circle" ? "9999px" : "0.5rem",
                      }}
                    >
                      {item.customization.text.slice(0, 3)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[var(--color-zen-dark)] truncate">
                        {item.productName}
                      </p>
                      <p className="text-[var(--color-zen-muted)] text-xs truncate">
                        &ldquo;{item.customization.text}&rdquo; · {SIZE_LABELS[item.customization.size]}
                      </p>
                      <p className="text-[var(--color-zen-muted)] text-xs">×{item.quantity}</p>
                    </div>
                    <p className="font-semibold text-[var(--color-zen-dark)] whitespace-nowrap">
                      {formatPrice(item.unitPrice * item.quantity)}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="border-t border-[var(--color-zen-border)] mt-4 pt-4 flex justify-between font-bold text-[var(--color-zen-dark)]">
              <span>Toplam</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
