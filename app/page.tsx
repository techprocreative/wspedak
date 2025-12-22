import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ProductGrid } from "@/components/product-grid";
import { PromoCarousel } from "@/components/home/promo-carousel";
import { CategoryIcons } from "@/components/home/category-icons";

// Force dynamic rendering to always fetch fresh data from database
export const dynamic = "force-dynamic";
import { Suspense } from "react";
import { Truck, Shield, Clock, Star } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <Navbar />

      {/* Promo Carousel Section */}
      <section className="pt-4 pb-6">
        <div className="container-supermarket">
          <Suspense fallback={<div className="w-full aspect-[3/1] bg-gray-200 animate-pulse rounded-2xl" />}>
            <PromoCarousel />
          </Suspense>
        </div>
      </section>

      {/* Category Icons Section */}
      <section className="py-6 bg-white border-y border-gray-100">
        <div className="container-supermarket">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Kategori</h2>
          <Suspense fallback={<div className="flex gap-4"><div className="w-16 h-16 bg-gray-200 rounded-2xl animate-pulse" /></div>}>
            <CategoryIcons />
          </Suspense>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-8 bg-gradient-to-r from-blue-600 to-blue-500">
        <div className="container-supermarket">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <FeatureCard
              icon={<Truck className="h-6 w-6" />}
              title="Gratis Ongkir"
              description="Min. Rp 50.000"
            />
            <FeatureCard
              icon={<Shield className="h-6 w-6" />}
              title="100% Original"
              description="Produk Terjamin"
            />
            <FeatureCard
              icon={<Clock className="h-6 w-6" />}
              title="Pengiriman Cepat"
              description="Cepat & Tepat"
            />
            <FeatureCard
              icon={<Star className="h-6 w-6" />}
              title="Harga Terbaik"
              description="Murah & Hemat"
            />
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="section-spacing">
        <div className="container-supermarket">
          <div className="text-center mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              Produk Unggulan
            </h2>
            <p className="text-gray-600">
              Temukan berbagai produk kebutuhan harian dengan kualitas terbaik
            </p>
          </div>

          <Suspense fallback={<ProductGridSkeleton />}>
            <ProductGrid variant="home" />
          </Suspense>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
      <div className="text-white">{icon}</div>
      <div>
        <p className="text-white font-semibold text-sm">{title}</p>
        <p className="text-blue-100 text-xs">{description}</p>
      </div>
    </div>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="space-y-8">
      <div className="max-w-lg mx-auto">
        <div className="h-12 bg-gray-200 rounded-full animate-pulse" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="skeleton-modern space-y-4 p-4">
            <div className="aspect-square rounded-xl bg-gradient-to-br from-blue-50 to-blue-100"></div>
            <div className="h-4 bg-gradient-to-r from-blue-100 to-blue-50 rounded w-3/4"></div>
            <div className="h-4 bg-gradient-to-r from-blue-100 to-blue-50 rounded w-1/2"></div>
            <div className="h-10 bg-gradient-to-r from-blue-200 to-blue-100 rounded-xl"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
