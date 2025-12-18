import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ProductGrid } from "@/components/product-grid";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, Search } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Produk - Toserba WS Pedak",
    description: "Lihat semua produk kebutuhan harian di Toserba WS Pedak dengan harga murah dan kualitas terjamin.",
};

// Force dynamic rendering to always fetch fresh data from database
export const dynamic = "force-dynamic";

export default function ProductsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
            <Navbar />

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 to-blue-500 py-12">
                <div className="container-supermarket">
                    <div className="text-center text-white">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Package className="h-8 w-8 text-white" />
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-bold mb-4">
                            Semua Produk
                        </h1>
                        <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                            Temukan berbagai produk kebutuhan harian dengan kualitas terbaik
                            dan harga terjangkau hanya di Toserba WS Pedak.
                        </p>
                    </div>
                </div>
            </section>

            {/* Products Section */}
            <section className="section-spacing">
                <div className="container-supermarket">
                    <Suspense fallback={<ProductGridSkeleton />}>
                        <ProductGrid />
                    </Suspense>
                </div>
            </section>

            <Footer />
        </div>
    );
}

function ProductGridSkeleton() {
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
