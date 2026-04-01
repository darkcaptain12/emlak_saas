import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EmlakCRM - Emlakçılar için Profesyonel CRM",
  description: "İlan yönetimi, müşteri takibi ve lead pipeline tek platformda",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}
