import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Toserba WS Pedak - Murah Lengkap Luas",
  description:
    "Belanja kebutuhan harian Anda dengan mudah di Toserba WS Pedak. Toko terlengkap di Pedak dengan harga murah, produk lengkap, dan area luas.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
