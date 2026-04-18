import type { StickerProduct } from "@/types";

export const SIZE_LABELS: Record<string, string> = {
  small: "Küçük (5×5 cm)",
  medium: "Orta (8×8 cm)",
  large: "Büyük (12×12 cm)",
};

export const SIZE_PRICES: Record<string, number> = {
  small: 25,
  medium: 40,
  large: 60,
};

export const PRODUCTS: StickerProduct[] = [
  {
    id: "classic",
    name: "Klasik Kare",
    description: "Sade, şık kare sticker. Her yüzeye uyar.",
    basePrice: 25,
    shapes: ["rectangle"],
    sizes: ["small", "medium", "large"],
    image: "/products/classic.svg",
  },
  {
    id: "circle",
    name: "Yuvarlak Zen",
    description: "Zarif yuvarlak form. Laptop ve su bardakları için ideal.",
    basePrice: 25,
    shapes: ["circle"],
    sizes: ["small", "medium", "large"],
    image: "/products/circle.svg",
  },
  {
    id: "rounded",
    name: "Yumuşak Köşe",
    description: "Köşeleri yuvarlatılmış modern sticker.",
    basePrice: 25,
    shapes: ["rounded"],
    sizes: ["small", "medium", "large"],
    image: "/products/rounded.svg",
  },
  {
    id: "star",
    name: "Yıldız Özel",
    description: "Dikkat çekici yıldız formu. Hediye ve süsleme için.",
    basePrice: 35,
    shapes: ["star"],
    sizes: ["small", "medium", "large"],
    image: "/products/star.svg",
  },
];

export function getProductById(id: string): StickerProduct | undefined {
  return PRODUCTS.find((p) => p.id === id);
}
