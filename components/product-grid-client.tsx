"use client";

import { Product } from "@/lib/types/product";
import { ProductCard } from "./product-card";
import { Package } from "lucide-react";
import { useEffect, useState } from "react";

interface ProductGridClientProps {
  products: Product[];
}

export function ProductGridClient({ products }: ProductGridClientProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // Return loading skeleton during hydration
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="skeleton-modern space-y-4 p-6">
            <div className="aspect-square rounded-xl bg-gradient-to-br from-blue-50 to-blue-100"></div>
            <div className="h-4 bg-gradient-to-r from-blue-100 to-blue-50 rounded w-3/4"></div>
            <div className="h-4 bg-gradient-to-r from-blue-100 to-blue-50 rounded w-1/2"></div>
            <div className="h-10 bg-gradient-to-r from-blue-200 to-blue-100 rounded-xl"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto">
            <Package className="h-10 w-10 text-blue-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">
            Belum Ada Produk
          </h3>
          <p className="text-gray-600">
            Produk akan segera tersedia. Silakan kembali lagi nanti.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product as Product} />
      ))}
    </div>
  );
}
