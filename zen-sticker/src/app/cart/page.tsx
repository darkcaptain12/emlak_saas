"use client";

import Link from "next/link";
import { Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/CartProvider";
import { formatPrice } from "@/lib/utils";
import { getFontById } from "@/lib/fonts";
import { SIZE_LABELS } from "@/lib/products";

export default function CartPage() {
  const { items, removeItem, updateQty, total, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <ShoppingBag className="w-16 h-16 text-[var(--color-zen-border)] mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-[var(--color-zen-dark)] mb-2">Sepetiniz boş</h1>
        <p className="text-[var(--color-zen-muted)] mb-8">Henüz bir şey eklemediniz.</p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 bg-[var(--color-zen-dark)] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[var(--color-zen-accent)] transition-colors"
        >
          Alışverişe Başla
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-zen-dark)]">Sepetim</h1>
        <button
          onClick={clearCart}
          className="text-sm text-red-500 hover:text-red-700 transition-colors"
        >
          Sepeti Temizle
        </button>
      </div>

      <div className="space-y-4 mb-8">
        {items.map((item) => {
          const font = getFontById(item.customization.fontId);
          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-[var(--color-zen-border)] p-5 flex gap-4 items-start"
            >
              {/* Sticker mini preview */}
              <div
                className="flex-none w-20 h-20 rounded-xl flex items-center justify-center text-sm font-bold overflow-hidden"
                style={{
                  backgroundColor: item.customization.bgColor,
                  color: item.customization.textColor,
                  fontFamily: font.family,
                  borderRadius:
                    item.customization.shape === "circle"
                      ? "9999px"
                      : item.customization.shape === "rounded"
                      ? "1rem"
                      : "0.5rem",
                }}
              >
                <span className="text-center leading-tight px-1 text-xs">
                  {item.customization.text.slice(0, 20)}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[var(--color-zen-dark)]">{item.productName}</p>
                <p className="text-sm text-[var(--color-zen-muted)] mt-0.5">
                  &ldquo;{item.customization.text}&rdquo; · {font.name} ·{" "}
                  {SIZE_LABELS[item.customization.size]}
                </p>
                <p className="text-xs text-[var(--color-zen-muted)] mt-0.5">
                  Renk: <span className="font-medium">{item.customization.bgColor}</span> /
                  Yazı: <span className="font-medium">{item.customization.textColor}</span>
                </p>
                <div className="flex items-center gap-3 mt-3">
                  <button
                    onClick={() => updateQty(item.id, item.quantity - 1)}
                    className="w-7 h-7 rounded-lg border border-[var(--color-zen-border)] text-base font-bold hover:border-[var(--color-zen-stone)] transition-colors"
                  >
                    −
                  </button>
                  <span className="text-sm font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => updateQty(item.id, item.quantity + 1)}
                    className="w-7 h-7 rounded-lg border border-[var(--color-zen-border)] text-base font-bold hover:border-[var(--color-zen-stone)] transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex-none flex flex-col items-end gap-3">
                <p className="font-bold text-[var(--color-zen-dark)]">
                  {formatPrice(item.unitPrice * item.quantity)}
                </p>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-[var(--color-zen-muted)] hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="bg-white rounded-2xl border border-[var(--color-zen-border)] p-6">
        <div className="flex items-center justify-between text-lg font-bold text-[var(--color-zen-dark)] mb-4">
          <span>Toplam</span>
          <span>{formatPrice(total)}</span>
        </div>
        <Link
          href="/checkout"
          className="flex items-center justify-center gap-2 bg-[var(--color-zen-accent)] text-white py-4 rounded-2xl font-semibold text-base hover:bg-[var(--color-zen-accent-light)] transition-colors w-full"
        >
          Sipariş Ver
          <ArrowRight className="w-5 h-5" />
        </Link>
        <Link
          href="/shop"
          className="block text-center text-sm text-[var(--color-zen-muted)] mt-3 hover:text-[var(--color-zen-dark)] transition-colors"
        >
          Alışverişe devam et
        </Link>
      </div>
    </div>
  );
}
