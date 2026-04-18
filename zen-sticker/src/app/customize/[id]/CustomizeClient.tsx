"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, ChevronDown } from "lucide-react";
import type { StickerProduct, CustomizationOptions } from "@/types";
import { StickerPreview } from "@/components/StickerPreview";
import { FontPicker } from "@/components/FontPicker";
import { useCart } from "@/components/CartProvider";
import { formatPrice, cn } from "@/lib/utils";

const COLOR_PRESETS_BG = [
  "#ffffff", "#1a1a1a", "#2d5a27", "#8b7355", "#e8e4de",
  "#ffd700", "#ff6b6b", "#4a90d9", "#9b59b6", "#e67e22",
];
const COLOR_PRESETS_TEXT = [
  "#1a1a1a", "#ffffff", "#2d5a27", "#8b7355", "#ff6b6b",
  "#4a90d9", "#e67e22", "#ffd700", "#9b59b6", "#e8e4de",
];

interface Props {
  product: StickerProduct;
  sizePrices: Record<string, number>;
  sizeLabels: Record<string, string>;
}

export function CustomizeClient({ product, sizePrices, sizeLabels }: Props) {
  const router = useRouter();
  const { addItem } = useCart();

  const [options, setOptions] = useState<CustomizationOptions>({
    text: "",
    fontId: "montserrat",
    fontSize: 36,
    textColor: "#1a1a1a",
    bgColor: "#ffffff",
    shape: product.shapes[0],
    size: "medium",
  });

  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const price = sizePrices[options.size] ?? product.basePrice;

  function set<K extends keyof CustomizationOptions>(key: K, val: CustomizationOptions[K]) {
    setOptions((prev) => ({ ...prev, [key]: val }));
  }

  function handleAddToCart() {
    if (!options.text.trim()) return;
    addItem({
      productId: product.id,
      productName: product.name,
      customization: options,
      quantity: qty,
      unitPrice: price,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function handleBuyNow() {
    if (!options.text.trim()) return;
    addItem({
      productId: product.id,
      productName: product.name,
      customization: options,
      quantity: qty,
      unitPrice: price,
    });
    router.push("/cart");
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Preview */}
      <div className="lg:sticky lg:top-24 h-fit">
        <StickerPreview options={options} />
      </div>

      {/* Controls */}
      <div className="space-y-8">
        {/* Text */}
        <div>
          <label className="block text-sm font-semibold text-[var(--color-zen-dark)] mb-2">
            Sticker Yazısı *
          </label>
          <textarea
            rows={3}
            placeholder="Yazını buraya yaz..."
            value={options.text}
            onChange={(e) => set("text", e.target.value)}
            maxLength={80}
            className="w-full border border-[var(--color-zen-border)] rounded-xl px-4 py-3 text-[var(--color-zen-dark)] placeholder:text-[var(--color-zen-muted)] resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-zen-accent)] bg-white"
          />
          <p className="text-xs text-[var(--color-zen-muted)] mt-1 text-right">{options.text.length}/80</p>
        </div>

        {/* Font */}
        <div>
          <label className="block text-sm font-semibold text-[var(--color-zen-dark)] mb-3">
            Font Seç
          </label>
          <FontPicker value={options.fontId} onChange={(id) => set("fontId", id)} />
        </div>

        {/* Font size */}
        <div>
          <label className="block text-sm font-semibold text-[var(--color-zen-dark)] mb-2">
            Yazı Boyutu: {options.fontSize}px
          </label>
          <input
            type="range"
            min={14}
            max={60}
            value={options.fontSize}
            onChange={(e) => set("fontSize", Number(e.target.value))}
            className="w-full accent-[var(--color-zen-accent)]"
          />
        </div>

        {/* Colors */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-[var(--color-zen-dark)] mb-2">
              Arka Plan Rengi
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {COLOR_PRESETS_BG.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => set("bgColor", c)}
                  className={cn(
                    "w-7 h-7 rounded-full border-2 transition-all",
                    options.bgColor === c
                      ? "border-[var(--color-zen-accent)] scale-110"
                      : "border-[var(--color-zen-border)]"
                  )}
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
            </div>
            <input
              type="color"
              value={options.bgColor}
              onChange={(e) => set("bgColor", e.target.value)}
              className="w-full h-9 rounded-lg border border-[var(--color-zen-border)] cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[var(--color-zen-dark)] mb-2">
              Yazı Rengi
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {COLOR_PRESETS_TEXT.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => set("textColor", c)}
                  className={cn(
                    "w-7 h-7 rounded-full border-2 transition-all",
                    options.textColor === c
                      ? "border-[var(--color-zen-accent)] scale-110"
                      : "border-[var(--color-zen-border)]"
                  )}
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
            </div>
            <input
              type="color"
              value={options.textColor}
              onChange={(e) => set("textColor", e.target.value)}
              className="w-full h-9 rounded-lg border border-[var(--color-zen-border)] cursor-pointer"
            />
          </div>
        </div>

        {/* Size */}
        <div>
          <label className="block text-sm font-semibold text-[var(--color-zen-dark)] mb-2">
            Boyut
          </label>
          <div className="grid grid-cols-3 gap-2">
            {product.sizes.map((sz) => (
              <button
                key={sz}
                type="button"
                onClick={() => set("size", sz)}
                className={cn(
                  "flex flex-col items-center p-3 rounded-xl border text-center transition-all",
                  options.size === sz
                    ? "border-[var(--color-zen-accent)] bg-[var(--color-zen-accent)]/5"
                    : "border-[var(--color-zen-border)] hover:border-[var(--color-zen-stone)]"
                )}
              >
                <span className="text-xs text-[var(--color-zen-muted)]">{sizeLabels[sz]}</span>
                <span className="font-semibold text-[var(--color-zen-accent)] mt-1">
                  {formatPrice(sizePrices[sz])}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-semibold text-[var(--color-zen-dark)] mb-2">
            Adet
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="w-10 h-10 rounded-xl border border-[var(--color-zen-border)] text-xl font-bold hover:border-[var(--color-zen-stone)] transition-colors"
            >
              −
            </button>
            <span className="w-10 text-center font-semibold text-[var(--color-zen-dark)]">{qty}</span>
            <button
              type="button"
              onClick={() => setQty((q) => q + 1)}
              className="w-10 h-10 rounded-xl border border-[var(--color-zen-border)] text-xl font-bold hover:border-[var(--color-zen-stone)] transition-colors"
            >
              +
            </button>
          </div>
        </div>

        {/* Total & CTA */}
        <div className="bg-white rounded-2xl border border-[var(--color-zen-border)] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[var(--color-zen-muted)]">Toplam</span>
            <span className="text-2xl font-bold text-[var(--color-zen-dark)]">
              {formatPrice(price * qty)}
            </span>
          </div>
          {!options.text.trim() && (
            <p className="text-xs text-amber-600 bg-amber-50 rounded-lg p-2">
              Devam etmek için sticker yazısını girin.
            </p>
          )}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!options.text.trim()}
              className="flex items-center justify-center gap-2 border border-[var(--color-zen-dark)] text-[var(--color-zen-dark)] py-3 rounded-xl font-semibold hover:bg-[var(--color-zen-cream)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="w-4 h-4" />
              {added ? "Eklendi!" : "Sepete Ekle"}
            </button>
            <button
              type="button"
              onClick={handleBuyNow}
              disabled={!options.text.trim()}
              className="flex items-center justify-center gap-2 bg-[var(--color-zen-accent)] text-white py-3 rounded-xl font-semibold hover:bg-[var(--color-zen-accent-light)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Hemen Al
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
