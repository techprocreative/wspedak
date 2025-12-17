import { db, products } from "@/lib/db";
import { desc, ilike, or, sql } from "drizzle-orm";
import { ProductGridClient } from "@/components/product-grid-client";
import { Package, Search } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface SearchPageProps {
    searchParams: Promise<{ search?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const params = await searchParams;
    const query = params.search || "";

    let productList: (typeof products.$inferSelect)[] = [];

    if (query.length >= 2) {
        productList = await db
            .select()
            .from(products)
            .where(
                or(
                    ilike(products.name, `%${query}%`),
                    ilike(products.description, `%${query}%`)
                )
            )
            .orderBy(desc(products.createdAt));
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            <div className="container-supermarket py-12">
                <div className="text-center mb-12">
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Search className="h-8 w-8 text-blue-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Hasil Pencarian
                    </h1>
                    {query && (
                        <p className="text-gray-600">
                            Menampilkan hasil untuk: <span className="font-semibold text-blue-600">"{query}"</span>
                        </p>
                    )}
                </div>

                {!query || query.length < 2 ? (
                    <div className="text-center py-16">
                        <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">Masukkan minimal 2 karakter untuk mencari</p>
                    </div>
                ) : productList.length === 0 ? (
                    <div className="text-center py-16">
                        <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                            Tidak ada produk ditemukan
                        </h3>
                        <p className="text-gray-500 mb-6">
                            Coba kata kunci lain atau lihat semua produk
                        </p>
                        <Link
                            href="/products"
                            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                        >
                            Lihat Semua Produk
                        </Link>
                    </div>
                ) : (
                    <>
                        <p className="text-gray-600 mb-6">
                            Ditemukan <span className="font-semibold">{productList.length}</span> produk
                        </p>
                        <ProductGridClient products={productList} />
                    </>
                )}
            </div>
        </div>
    );
}
