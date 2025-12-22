import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import JsonLd from "@/components/json-ld";
import GoogleAnalytics from "@/components/google-analytics";

const inter = Inter({ subsets: ["latin"] });

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://wstoserba.my.id";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Toserba WS Pedak - Murah Lengkap Luas",
    template: "%s | Toserba WS Pedak",
  },
  description:
    "Belanja kebutuhan harian Anda dengan mudah di Toserba WS Pedak. Toko terlengkap di Pedak dengan harga murah, produk lengkap, dan area luas.",
  keywords: [
    "toserba",
    "pedak",
    "belanja online",
    "supermarket",
    "toko",
    "murah",
    "lengkap",
    "sleman",
    "yogyakarta",
    "toko kelontong",
  ],
  authors: [{ name: "Toserba WS Pedak" }],
  creator: "Toserba WS Pedak",
  publisher: "Toserba WS Pedak",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Toserba WS Pedak - Murah Lengkap Luas",
    description:
      "Toko terlengkap di Pedak untuk semua kebutuhan harian Anda dengan harga murah dan produk lengkap.",
    type: "website",
    locale: "id_ID",
    siteName: "Toserba WS Pedak",
    url: BASE_URL,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Toserba WS Pedak - Murah Lengkap Luas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Toserba WS Pedak - Murah Lengkap Luas",
    description: "Toko terlengkap di Pedak untuk semua kebutuhan harian Anda",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#2563eb" },
    { media: "(prefers-color-scheme: dark)", color: "#1e40af" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <JsonLd />
      </head>
      <body className={inter.className}>
        <GoogleAnalytics />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
