import Link from "next/link";
import { ArrowRight, Sparkles, Truck, Palette, Star } from "lucide-react";
import { PRODUCTS } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-[var(--color-zen-accent)]/10 text-[var(--color-zen-accent)] text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          <Sparkles className="w-4 h-4" />
          Kişiye Özel Sticker
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-[var(--color-zen-dark)] leading-tight mb-6">
          Senin sözlerin,
          <br />
          <span className="text-[var(--color-zen-accent)]">senin stickerin.</span>
        </h1>
        <p className="text-xl text-[var(--color-zen-muted)] max-w-xl mx-auto mb-10 leading-relaxed">
          İstediğin yazıyı yaz, fontunu seç, formunu belirle. Biz üretip kapına kadar getiriyoruz.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-[var(--color-zen-dark)] text-white px-8 py-4 rounded-2xl text-base font-semibold hover:bg-[var(--color-zen-accent)] transition-colors"
          >
            Hemen Tasarla
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 border border-[var(--color-zen-border)] text-[var(--color-zen-dark)] px-8 py-4 rounded-2xl text-base font-semibold hover:border-[var(--color-zen-stone)] transition-colors"
          >
            Ürünlere Bak
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white border-y border-[var(--color-zen-border)] py-16">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Palette className="w-6 h-6 text-[var(--color-zen-accent)]" />,
              title: "Tam Özelleştirme",
              desc: "8 farklı font, sonsuz renk seçeneği. Tam istediğin gibi.",
            },
            {
              icon: <Star className="w-6 h-6 text-[var(--color-zen-accent)]" />,
              title: "Premium Kalite",
              desc: "Su geçirmez, UV dayanıklı vinil sticker. Uzun ömürlü.",
            },
            {
              icon: <Truck className="w-6 h-6 text-[var(--color-zen-accent)]" />,
              title: "Hızlı Kargo",
              desc: "Siparişin 2-3 iş günü içinde kapında.",
            },
          ].map((f) => (
            <div key={f.title} className="flex flex-col items-center text-center gap-3 p-6">
              <div className="w-12 h-12 rounded-2xl bg-[var(--color-zen-cream)] flex items-center justify-center">
                {f.icon}
              </div>
              <h3 className="font-semibold text-[var(--color-zen-dark)]">{f.title}</h3>
              <p className="text-sm text-[var(--color-zen-muted)] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Products */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-[var(--color-zen-dark)] mb-2">Sticker Formları</h2>
        <p className="text-[var(--color-zen-muted)] mb-10">Her biri kişiselleştirilebilir.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="bg-[var(--color-zen-accent)] rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-3">Haydi başlayalım</h2>
          <p className="text-white/80 mb-8 text-lg">İlk stickerını tasarlamak 2 dakika sürer.</p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-white text-[var(--color-zen-accent)] px-8 py-4 rounded-2xl font-semibold hover:bg-white/90 transition-colors"
          >
            Şimdi Tasarla
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
