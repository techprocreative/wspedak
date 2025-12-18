import { Navbar } from "@/components/navbar";
import { ProductGrid } from "@/components/product-grid";

// Force dynamic rendering to always fetch fresh data from database
export const dynamic = "force-dynamic";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart, Truck, Shield, Star, Store } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <Navbar />

      {/* Hero Section */}
      <section className="hero-gradient section-spacing">
        <div className="container-supermarket">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold hero-text text-balance">
                  Toserba WS Pedak
                  <span className="block text-blue-100 text-2xl lg:text-3xl">
                    Murah • Lengkap • Luas
                  </span>
                </h1>
                <p className="text-xl text-blue-100 text-pretty max-w-lg">
                  Temukan kebutuhan harian Anda dengan harga terbaik dan
                  kualitas terjamin. Toserba WS Pedak - Partner belanja
                  terpercaya Anda di Pedak.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                  <div className="flex items-center gap-3">
                    <Truck className="h-6 w-6 text-white" />
                    <div>
                      <p className="text-white font-semibold">Gratis Ongkir</p>
                      <p className="text-blue-100 text-sm">
                        Minimal pembelian Rp 50.000
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                  <div className="flex items-center gap-3">
                    <Shield className="h-6 w-6 text-white" />
                    <div>
                      <p className="text-white font-semibold">100% Original</p>
                      <p className="text-blue-100 text-sm">Produk terjamin</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                <div className="flex items-center justify-center mb-6">
                  <Store className="h-16 w-16 text-white" />
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Selamat Datang
                  </h3>
                  <p className="text-blue-100">
                    Toko terlengkap di Pedak untuk semua kebutuhan Anda
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container-supermarket">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Mengapa Memilih Toserba WS Pedak?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Kami berkomitmen memberikan pengalaman belanja terbaik dengan
              produk berkualitas dan layanan prima di kawasan Pedak.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto">
                <ShoppingCart className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Harga Terbaik
              </h3>
              <p className="text-gray-600">
                Dapatkan produk berkualitas dengan harga yang bersaing dan
                terjangkau.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto">
                <Truck className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Pengiriman Cepat
              </h3>
              <p className="text-gray-600">
                Pesanan Anda akan dikirim dengan cepat dan aman ke alamat
                tujuan.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto">
                <Star className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Kualitas Terjamin
              </h3>
              <p className="text-gray-600">
                Semua produk melalui quality control ketat sebelum sampai ke
                tangan Anda.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="section-spacing">
        <div className="container-supermarket">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Produk Unggulan Kami
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Temukan berbagai produk kebutuhan harian dengan kualitas terbaik
              hanya di Toserba WS Pedak.
            </p>
          </div>

          <Suspense fallback={<ProductGridSkeleton />}>
            <ProductGrid />
          </Suspense>
        </div>
      </section>
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
