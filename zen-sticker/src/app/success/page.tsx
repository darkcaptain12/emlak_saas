import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";

type Props = { searchParams: Promise<{ id?: string }> };

export default async function SuccessPage({ searchParams }: Props) {
  const { id } = await searchParams;

  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <CheckCircle className="w-20 h-20 text-[var(--color-zen-accent)] mx-auto mb-6" />
      <h1 className="text-4xl font-bold text-[var(--color-zen-dark)] mb-3">
        Siparişin Alındı!
      </h1>
      <p className="text-[var(--color-zen-muted)] text-lg mb-2 leading-relaxed">
        Harika! Siparişin başarıyla oluşturuldu. En kısa sürede sana ulaşacağız.
      </p>
      {id && (
        <p className="text-sm text-[var(--color-zen-muted)] bg-[var(--color-zen-border)]/40 rounded-xl inline-block px-4 py-2 mt-2 mb-8 font-mono">
          Sipariş No: {id}
        </p>
      )}
      {!id && <div className="mb-8" />}
      <div className="bg-white rounded-2xl border border-[var(--color-zen-border)] p-6 text-left mb-8 space-y-3">
        <h2 className="font-semibold text-[var(--color-zen-dark)]">Sonraki adımlar</h2>
        {[
          "Siparişin admin panelinde görüntülendi.",
          "Üretim sürecini başlatıyoruz.",
          "2-3 iş günü içinde kargo takip numaranı e-postayla göndereceğiz.",
          "Herhangi bir sorun olursa seninle iletişime geçeceğiz.",
        ].map((step) => (
          <div key={step} className="flex items-start gap-2 text-sm text-[var(--color-zen-muted)]">
            <span className="mt-0.5 text-[var(--color-zen-accent)]">✓</span>
            {step}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-4">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 bg-[var(--color-zen-dark)] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[var(--color-zen-accent)] transition-colors"
        >
          Alışverişe Devam
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 border border-[var(--color-zen-border)] text-[var(--color-zen-dark)] px-6 py-3 rounded-xl font-semibold hover:border-[var(--color-zen-stone)] transition-colors"
        >
          Ana Sayfa
        </Link>
      </div>
    </div>
  );
}
