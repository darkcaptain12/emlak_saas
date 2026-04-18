import type { FontOption } from "@/types";

export const FONTS: FontOption[] = [
  {
    id: "playfair",
    name: "Playfair Display",
    family: "'Playfair Display', serif",
    preview: "Zarif & Klasik",
  },
  {
    id: "dancing",
    name: "Dancing Script",
    family: "'Dancing Script', cursive",
    preview: "El Yazısı",
  },
  {
    id: "montserrat",
    name: "Montserrat",
    family: "'Montserrat', sans-serif",
    preview: "Modern & Temiz",
  },
  {
    id: "pacifico",
    name: "Pacifico",
    family: "'Pacifico', cursive",
    preview: "Eğlenceli",
  },
  {
    id: "raleway",
    name: "Raleway",
    family: "'Raleway', sans-serif",
    preview: "Minimalist",
  },
  {
    id: "press-start",
    name: "Press Start 2P",
    family: "'Press Start 2P', monospace",
    preview: "Pixel",
  },
  {
    id: "bebas",
    name: "Bebas Neue",
    family: "'Bebas Neue', sans-serif",
    preview: "Güçlü",
  },
  {
    id: "satisfy",
    name: "Satisfy",
    family: "'Satisfy', cursive",
    preview: "Akıcı",
  },
];

export function getFontById(id: string): FontOption {
  return FONTS.find((f) => f.id === id) ?? FONTS[0];
}
