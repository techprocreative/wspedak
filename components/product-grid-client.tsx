"use client";

import { Product } from "@/lib/db/schema";
import { ProductCard } from "./product-card";
import { Package, Search, X, ChevronDown, SlidersHorizontal } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ProductGridClientProps {
  products: Product[];
}

const ITEMS_PER_PAGE = 12;

export function ProductGridClient({ products }: ProductGridClientProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [categories, setCategories] = useState<string[]>(["Semua"]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "price-asc" | "price-desc">("name");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  useEffect(() => {
    setIsMounted(true);

    async function fetchCategories() {
      try {
        const { data, error } = await supabase
          .from("categories")
          .select("name")
          .order("name", { ascending: true });

        if (data && !error && data.length > 0) {
          setCategories(["Semua", ...data.map((c) => c.name)]);
        } else {
          const uniqueCategories = Array.from(new Set(products.map(p => p.category).filter((c): c is string => c !== null)));
          if (uniqueCategories.length > 0) {
            setCategories(["Semua", ...uniqueCategories.sort()]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        const uniqueCategories = Array.from(new Set(products.map(p => p.category).filter((c): c is string => c !== null)));
        if (uniqueCategories.length > 0) {
          setCategories(["Semua", ...uniqueCategories.sort()]);
        }
      }
    }
    fetchCategories();
  }, [products]);

  // Reset visible count when filter changes
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [selectedCategory, searchQuery, sortBy]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by category
    if (selectedCategory !== "Semua") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((p) =>
        p.name.toLowerCase().includes(query) ||
        p.category?.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query)
      );
    }

    // Sort
    switch (sortBy) {
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "price-asc":
        result.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case "price-desc":
        result.sort((a, b) => Number(b.price) - Number(a.price));
        break;
    }

    return result;
  }, [products, selectedCategory, searchQuery, sortBy]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
  };

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
      {/* Search and Sort Row */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Cari produk..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-12 h-12 rounded-xl border-gray-200 focus:border-blue-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-gray-500" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="h-12 px-4 border border-gray-200 rounded-xl bg-white focus:border-blue-400 focus:ring-blue-100"
          >
            <option value="name">Urutkan: Nama (A-Z)</option>
            <option value="price-asc">Harga: Termurah</option>
            <option value="price-desc">Harga: Termahal</option>
          </select>
        </div>
      </div>

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
        Menampilkan {visibleProducts.length} dari {filteredProducts.length} produk
        {selectedCategory !== "Semua" && ` dalam kategori "${selectedCategory}"`}
        {searchQuery && ` untuk "${searchQuery}"`}
      </p>

      {/* Product Grid */}
      {visibleProducts.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 md:gap-8">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center pt-8">
              <Button
                onClick={handleLoadMore}
                variant="outline"
                className="px-8 h-12 border-blue-200 hover:border-blue-400 hover:bg-blue-50"
              >
                <ChevronDown className="h-5 w-5 mr-2" />
                Muat Lebih Banyak ({filteredProducts.length - visibleCount} lagi)
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Tidak ada produk yang cocok</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("Semua");
            }}
            className="mt-2 text-blue-600 hover:underline"
          >
            Reset filter
          </button>
        </div>
      )}
    </div>
  );
}
