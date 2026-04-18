import { PRODUCTS } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

export default function ShopPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-[var(--color-zen-dark)] mb-2">Sticker Koleksiyonu</h1>
        <p className="text-[var(--color-zen-muted)] text-lg">
          Bir form seç, kendi yazını ekle. Her sticker benzersiz.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {PRODUCTS.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="mt-16 bg-white rounded-2xl border border-[var(--color-zen-border)] p-8">
        <h2 className="text-xl font-semibold text-[var(--color-zen-dark)] mb-4">Nasıl çalışır?</h2>
        <ol className="space-y-4">
          {[
            "Beğendiğin sticker formunu seç",
            "Kendi yazını yaz ve istediğin fontu seç",
            "Renk ve boyut belirle",
            "Sepete ekle ve siparişini tamamla",
            "2-3 iş günü içinde kapında!",
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="flex-none w-7 h-7 rounded-full bg-[var(--color-zen-accent)] text-white text-sm flex items-center justify-center font-bold">
                {i + 1}
              </span>
              <span className="text-[var(--color-zen-muted)] pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
