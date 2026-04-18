import { notFound } from "next/navigation";
import { getProductById, SIZE_LABELS, SIZE_PRICES } from "@/lib/products";
import { CustomizeClient } from "./CustomizeClient";

type Props = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  const { PRODUCTS } = await import("@/lib/products");
  return PRODUCTS.map((p) => ({ id: p.id }));
}

export default async function CustomizePage({ params }: Props) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8">
        <p className="text-sm text-[var(--color-zen-muted)] mb-1">
          <a href="/shop" className="hover:underline">Ürünler</a> / {product.name}
        </p>
        <h1 className="text-3xl font-bold text-[var(--color-zen-dark)]">
          {product.name} — Kişiselleştir
        </h1>
      </div>
      <CustomizeClient product={product} sizePrices={SIZE_PRICES} sizeLabels={SIZE_LABELS} />
    </div>
  );
}
