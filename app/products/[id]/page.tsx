import { db, products } from "@/lib/db";
import { eq, ne, and } from "drizzle-orm";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Package, Tag, ShoppingCart, Truck, Shield, MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AddToCartButton } from "@/components/product-detail/add-to-cart-button";
import { ProductCard } from "@/components/product-card";

export const dynamic = "force-dynamic";

interface ProductDetailPageProps {
    params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
    const { id } = await params;

    const [product] = await db
        .select()
        .from(products)
        .where(eq(products.id, id));

    if (!product) {
        notFound();
    }

    // Get related products (same category, exclude current product)
    const relatedProducts = await db
        .select()
        .from(products)
        .where(
            and(
                eq(products.category, product.category || "Lainnya"),
                ne(products.id, product.id)
            )
        )
        .limit(4);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(price * 1000);
    };

    const getStockStatus = (stock: number) => {
        if (stock === 0) return { text: "Stok Habis", color: "bg-red-100 text-red-800" };
        if (stock < 10) return { text: `Stok Terbatas (${stock})`, color: "bg-orange-100 text-orange-800" };
        return { text: "Tersedia", color: "bg-green-100 text-green-800" };
    };

    const stockStatus = getStockStatus(product.stock ?? 0);
    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6281239602221";
    const whatsappMessage = encodeURIComponent(`Halo, saya tertarik dengan produk: ${product.name}`);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
            <Navbar />

            <main className="container-supermarket py-8">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
                    <Link href="/" className="hover:text-blue-600">Beranda</Link>
                    <span>/</span>
                    <Link href="/products" className="hover:text-blue-600">Produk</Link>
                    <span>/</span>
                    <span className="text-gray-900 font-medium">{product.name}</span>
                </div>

                {/* Back Button */}
                <Link href="/products" className="inline-flex items-center text-gray-600 hover:text-blue-600 mb-6">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Kembali ke Produk
                </Link>

                {/* Product Detail */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Product Image */}
                    <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
                        <div className="relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100">
                            {product.imageUrl ? (
                                <Image
                                    src={product.imageUrl}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <Package className="h-24 w-24 text-blue-300" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        {/* Category Badge */}
                        {product.category && (
                            <Link href={`/products?category=${encodeURIComponent(product.category)}`}>
                                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                                    <Tag className="h-3 w-3 mr-1" />
                                    {product.category}
                                </Badge>
                            </Link>
                        )}

                        {/* Product Name */}
                        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                            {product.name}
                        </h1>

                        {/* Price */}
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl lg:text-4xl font-bold text-blue-600">
                                {formatPrice(Number(product.price))}
                            </span>
                        </div>

                        {/* Stock Status */}
                        <Badge className={`${stockStatus.color} text-sm`}>
                            {stockStatus.text}
                        </Badge>

                        {/* Description */}
                        {product.description && (
                            <div className="prose prose-gray max-w-none">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Deskripsi</h3>
                                <p className="text-gray-600 whitespace-pre-line">{product.description}</p>
                            </div>
                        )}

                        {/* Add to Cart */}
                        <Card className="border-blue-100 bg-blue-50/50">
                            <CardContent className="p-6">
                                <AddToCartButton
                                    product={{
                                        id: product.id,
                                        name: product.name,
                                        price: Number(product.price),
                                        imageUrl: product.imageUrl,
                                        stock: product.stock ?? 0,
                                    }}
                                />
                            </CardContent>
                        </Card>

                        {/* WhatsApp Button */}
                        <a
                            href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold transition-colors"
                        >
                            <MessageCircle className="h-5 w-5" />
                            Tanya via WhatsApp
                        </a>

                        {/* Features */}
                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100">
                                <Truck className="h-5 w-5 text-blue-600" />
                                <div>
                                    <p className="font-medium text-gray-900 text-sm">Pengiriman Cepat</p>
                                    <p className="text-xs text-gray-500">Area Pedak & sekitar</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100">
                                <Shield className="h-5 w-5 text-blue-600" />
                                <div>
                                    <p className="font-medium text-gray-900 text-sm">Produk Original</p>
                                    <p className="text-xs text-gray-500">100% Terjamin</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <section className="mt-16">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8">
                            Produk Lainnya di Kategori {product.category}
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                            {relatedProducts.map((relatedProduct) => (
                                <ProductCard key={relatedProduct.id} product={relatedProduct} />
                            ))}
                        </div>
                    </section>
                )}
            </main>

            <Footer />
        </div>
    );
}
