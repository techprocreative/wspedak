"use client";

import { Product } from "@/lib/db/schema";
import { ProductCard } from "./product-card";
import { Package, Search, ArrowRight, X } from "lucide-react";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ProductGridHomeProps {
    products: Product[];
    maxProducts?: number;
}

export function ProductGridHome({ products, maxProducts = 8 }: ProductGridHomeProps) {
    const [searchQuery, setSearchQuery] = useState("");

    // Filter products based on search
    const filteredProducts = useMemo(() => {
        if (!searchQuery.trim()) {
            return products.slice(0, maxProducts);
        }

        const query = searchQuery.toLowerCase();
        return products
            .filter((p) =>
                p.name.toLowerCase().includes(query) ||
                p.category?.toLowerCase().includes(query) ||
                p.description?.toLowerCase().includes(query)
            )
            .slice(0, maxProducts);
    }, [products, searchQuery, maxProducts]);

    const hasMoreProducts = products.length > maxProducts;
    const showingFiltered = searchQuery.trim().length > 0;

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
        <div className="space-y-8">
            {/* Search Bar */}
            <div className="max-w-lg mx-auto">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                        type="text"
                        placeholder="Cari produk..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-12 pr-12 h-12 rounded-full border-gray-200 focus:border-blue-400 focus:ring-blue-100 text-base"
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
                {showingFiltered && (
                    <p className="text-center text-sm text-gray-500 mt-2">
                        Menampilkan {filteredProducts.length} hasil untuk "{searchQuery}"
                    </p>
                )}
            </div>

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 md:gap-8">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Tidak ada produk yang cocok dengan pencarian</p>
                    <button
                        onClick={() => setSearchQuery("")}
                        className="mt-2 text-blue-600 hover:underline"
                    >
                        Reset pencarian
                    </button>
                </div>
            )}

            {/* View All Button - Always show when not filtering */}
            {!showingFiltered && (
                <div className="text-center pt-4">
                    <Link href="/products">
                        <Button className="btn-primary px-8 h-12">
                            Lihat Semua Produk
                            <ArrowRight className="h-5 w-5 ml-2" />
                        </Button>
                    </Link>
                    <p className="text-sm text-gray-500 mt-2">
                        {products.length} produk tersedia
                    </p>
                </div>
            )}
        </div>
    );
}
