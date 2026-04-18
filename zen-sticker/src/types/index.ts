export type StickerShape = "rectangle" | "circle" | "rounded" | "star";
export type StickerSize = "small" | "medium" | "large";
export type OrderStatus = "pending" | "processing" | "completed" | "cancelled";

export interface FontOption {
  id: string;
  name: string;
  family: string;
  preview: string;
}

export interface StickerProduct {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  shapes: StickerShape[];
  sizes: StickerSize[];
  image: string;
}

export interface CustomizationOptions {
  text: string;
  fontId: string;
  fontSize: number;
  textColor: string;
  bgColor: string;
  shape: StickerShape;
  size: StickerSize;
}

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  customization: CustomizationOptions;
  quantity: number;
  unitPrice: number;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  notes?: string;
}

export interface Order {
  id: string;
  createdAt: string;
  status: OrderStatus;
  customer: CustomerInfo;
  items: CartItem[];
  total: number;
}
