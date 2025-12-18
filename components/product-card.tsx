"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Truck, Shield } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/lib/store/cart-store";
import { Product } from "@/lib/db/schema";
import { toast } from "sonner";
import { useEffect, useState } from "react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      image_url: product.imageUrl || undefined,
    });
    toast.success(`${product.name} ditambahkan ke keranjang`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price * 1000);
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0)
      return {
        text: "Stok Habis",
        variant: "danger" as const,
        color: "bg-red-100 text-red-800",
      };
    if (stock < 10)
      return {
        text: "Stok Terbatas",
        variant: "warning" as const,
        color: "bg-orange-100 text-orange-800",
      };
    return {
      text: "Tersedia",
      variant: "success" as const,
      color: "bg-green-100 text-green-800",
    };
  };

  const stockStatus = getStockStatus(product.stock ?? 0);

  const priceNum = Number(product.price);

  return (
    <Card className="product-card group">
      <Link href={`/products/${product.id}`} className="product-card-image cursor-pointer">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <ShoppingCart className="h-16 w-16 text-blue-300" />
          </div>
        )}

        {/* Stock Badge */}
        {isMounted && (
          <div className="absolute top-3 right-3">
            <Badge className={`${stockStatus.color} border-0 font-medium`}>
              {stockStatus.text}
            </Badge>
          </div>
        )}

        {/* Product Actions Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4 space-y-2">
            <div className="flex items-center gap-2 text-white text-sm">
              <Truck className="h-4 w-4" />
              <span>Gratis Ongkir</span>
            </div>
            <div className="flex items-center gap-2 text-white text-sm">
              <Shield className="h-4 w-4" />
              <span>100% Original</span>
            </div>
          </div>
        </div>
      </Link>

      <CardContent className="p-3 sm:p-5 space-y-2 sm:space-y-3">
        <div className="space-y-2 sm:space-y-3">
          <h3 className="font-semibold text-sm sm:text-lg text-gray-900 line-clamp-2 sm:line-clamp-1 group-hover:text-blue-600 transition-colors duration-200 h-10 sm:h-auto">
            {product.name}
          </h3>

          {product.description && (
            <p className="hidden sm:block text-sm text-gray-600 line-clamp-2">
              {product.description}
            </p>
          )}



          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div className="space-y-1">
              <p className="text-base sm:text-2xl font-bold text-blue-600">{formatPrice(priceNum)}</p>
              {(product.stock ?? 0) > 0 && (
                <p className="text-xs sm:text-sm text-gray-500">
                  Stok: {product.stock}
                </p>
              )}
            </div>

            <div className="text-right hidden sm:block">
              {(product.stock ?? 0) > 10 && (
                <p className="text-xs text-green-600 font-medium">
                  Ready Stock
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-3 sm:p-5 pt-0">
        <Button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="w-full btn-primary group relative overflow-hidden h-9 sm:h-11 text-xs sm:text-base px-2 sm:px-4"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center justify-center gap-2">
            <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 group-hover:animate-bounce" />
            <span>
              {product.stock === 0 ? "Habis" : "Beli"}
            </span>
          </div>
        </Button>
      </CardFooter>
    </Card>
  );
}
