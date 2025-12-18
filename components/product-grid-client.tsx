"use client";

import { Product } from "@/lib/db/schema";
import { ProductCard } from "./product-card";
import { Package } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

interface ProductGridClientProps {
  products: Product[];
}

export function ProductGridClient({ products }: ProductGridClientProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [categories, setCategories] = useState<string[]>(["Semua"]);

  useEffect(() => {
    setIsMounted(true);

    // Fetch categories from database
    async function fetchCategories() {
      const { data, error } = await supabase
        .from("categories")
        .select("name")
        .order("name", { ascending: true });

      if (data && !error) {
        setCategories(["Semua", ...data.map((c) => c.name)]);
      }
    }
    fetchCategories();
  }, []);

  const filteredProducts = selectedCategory === "Semua"
    ? products
    : products.filter((p) => p.category === selectedCategory);

  if (!isMounted) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 md:gap-8">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="skeleton-modern space-y-4 p-4 sm:p-6">
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
    <div className="space-y-6">
      {/* Category Filter Tabs */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((category: string) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${selectedCategory === category
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Products Count */}
      <p className="text-center text-gray-600">
        Menampilkan {filteredProducts.length} produk
        {selectedCategory !== "Semua" && ` dalam kategori "${selectedCategory}"`}
      </p>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 md:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product as Product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Tidak ada produk dalam kategori ini</p>
        </div>
      )}
    </div>
  );
}
