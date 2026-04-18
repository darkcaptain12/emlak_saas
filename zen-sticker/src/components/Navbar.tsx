"use client";

import Link from "next/link";
import { ShoppingCart, Leaf, LayoutDashboard } from "lucide-react";
import { useCart } from "@/components/CartProvider";

export function Navbar() {
  const { count } = useCart();

  return (
    <nav className="sticky top-0 z-50 bg-[var(--color-zen-cream)]/95 backdrop-blur border-b border-[var(--color-zen-border)]">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl text-[var(--color-zen-dark)]"
        >
          <Leaf className="w-5 h-5 text-[var(--color-zen-accent)]" />
          Zen Sticker
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/shop"
            className="text-sm text-[var(--color-zen-muted)] hover:text-[var(--color-zen-dark)] transition-colors"
          >
            Ürünler
          </Link>
          <Link
            href="/admin"
            className="text-sm text-[var(--color-zen-muted)] hover:text-[var(--color-zen-dark)] transition-colors flex items-center gap-1"
          >
            <LayoutDashboard className="w-4 h-4" />
            Admin
          </Link>
          <Link
            href="/cart"
            className="relative flex items-center gap-1.5 text-sm font-medium text-[var(--color-zen-dark)] hover:text-[var(--color-zen-accent)] transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            Sepet
            {count > 0 && (
              <span className="absolute -top-2 -right-3 bg-[var(--color-zen-accent)] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}
