import Link from "next/link";
import type { StickerProduct } from "@/types";
import { formatPrice } from "@/lib/utils";
import { Pencil } from "lucide-react";

export function ProductCard({ product }: { product: StickerProduct }) {
  return (
    <div className="group bg-white rounded-2xl border border-[var(--color-zen-border)] overflow-hidden hover:shadow-lg transition-all">
      <div className="aspect-square bg-[var(--color-zen-cream)] flex items-center justify-center p-8">
        <StickerShapeIcon shape={product.shapes[0]} />
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-[var(--color-zen-dark)]">{product.name}</h3>
        <p className="text-sm text-[var(--color-zen-muted)] mt-1 leading-relaxed">
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-4">
          <span className="font-bold text-[var(--color-zen-accent)]">
            {formatPrice(product.basePrice)}'den başlar
          </span>
          <Link
            href={`/customize/${product.id}`}
            className="flex items-center gap-1.5 text-sm bg-[var(--color-zen-dark)] text-white px-4 py-2 rounded-xl hover:bg-[var(--color-zen-accent)] transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
            Özelleştir
          </Link>
        </div>
      </div>
    </div>
  );
}

function StickerShapeIcon({ shape }: { shape: string }) {
  const base = "w-24 h-24 bg-[var(--color-zen-accent)]/15 flex items-center justify-center text-[var(--color-zen-accent)] text-3xl font-bold";

  if (shape === "circle") {
    return <div className={`${base} rounded-full`}>ZS</div>;
  }
  if (shape === "rounded") {
    return <div className={`${base} rounded-3xl`}>ZS</div>;
  }
  if (shape === "star") {
    return (
      <svg viewBox="0 0 100 100" className="w-24 h-24">
        <polygon
          points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35"
          fill="var(--color-zen-accent)"
          opacity="0.15"
        />
        <text
          x="50"
          y="58"
          textAnchor="middle"
          fontSize="18"
          fontWeight="bold"
          fill="var(--color-zen-accent)"
        >
          ZS
        </text>
      </svg>
    );
  }
  return <div className={`${base} rounded-lg`}>ZS</div>;
}
