"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Menu, X, Phone, Mail } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export function Navbar() {
  const totalItems = useCartStore((state) => state.getTotalItems());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <nav className="navbar-modern">
      <div className="container-supermarket">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 group-hover:scale-110 transition-transform duration-200">
              <Image
                src="/logo-ws.jpeg"
                alt="Toserba WS Pedak"
                fill
                className="object-contain rounded-lg"
                priority
              />
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900">
                Toserba WS Pedak
              </span>
              <p className="text-xs text-blue-600 font-medium">
                Murah • Lengkap • Luas
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              Beranda
            </Link>
            <Link
              href="/products"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              Produk
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              Tentang
            </Link>
            <Link
              href="/contact"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              Kontak
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Contact Info - Desktop */}
            <div className="hidden lg:flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="h-4 w-4" />
                <span>(021) 1234-5678</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="h-4 w-4" />
                <span>info@toserbawspedak.id</span>
              </div>
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  Admin Login
                </Button>
              </Link>
            </div>

            {/* Cart Button */}
            <Link href="/checkout">
              <Button
                variant="outline"
                className="relative border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 group"
              >
                <ShoppingCart className="h-5 w-5 text-blue-600 group-hover:scale-110 transition-transform duration-200" />
                {isMounted && totalItems > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500 text-white text-xs font-bold animate-pulse"
                  >
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-blue-100 bg-white/95 backdrop-blur-sm">
            <div className="container-supermarket py-4 space-y-4">
              <div className="space-y-3">
                <Link
                  href="/"
                  className="block text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Beranda
                </Link>
                <Link
                  href="/products"
                  className="block text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Produk
                </Link>
                <Link
                  href="/about"
                  className="block text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Tentang
                </Link>
                <Link
                  href="/contact"
                  className="block text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Kontak
                </Link>
              </div>

              <div className="border-t border-blue-100 pt-4 space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>(021) 1234-5678</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>info@toserbawspedak.id</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
