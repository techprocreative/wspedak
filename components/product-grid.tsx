import { db, products } from "@/lib/db";
import { desc } from "drizzle-orm";
import { ProductGridClient } from "./product-grid-client";
import { Package, RefreshCw } from "lucide-react";
import Link from "next/link";

export async function ProductGrid() {
  try {
    const productList = await db
      .select()
      .from(products)
      .orderBy(desc(products.createdAt));

    return <ProductGridClient products={productList} />;
  } catch (error) {
    console.error("Error fetching products:", error);
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto">
            <Package className="h-10 w-10 text-red-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">
            Gagal Memuat Produk
          </h3>
          <p className="text-gray-600">
            Terjadi kesalahan saat memuat produk. Silakan coba lagi.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Coba Lagi
          </Link>
        </div>
      </div>
    );
  }
}


