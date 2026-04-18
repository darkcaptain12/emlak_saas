import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import { Navbar } from "@/components/Navbar";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zen Sticker — Kişiye Özel Sticker",
  description: "Kendi yazını yaz, fontunu seç, stickerını sipariş et.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={geist.variable}>
      <body className="min-h-screen flex flex-col antialiased">
        <CartProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-[var(--color-zen-border)] py-8 text-center text-sm text-[var(--color-zen-muted)]">
            <p>© 2026 Zen Sticker — Kişiye özel sticker sanatı</p>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
