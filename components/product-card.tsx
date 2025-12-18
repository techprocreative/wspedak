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
      <Link href={`/products/${product.id}`} className="block product-card-image cursor-pointer">
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

      <CardContent className="p-3 sm:p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-sm sm:text-base text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors duration-200 cursor-pointer mb-2">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between">
          <p className="text-lg sm:text-xl font-bold text-blue-600">{formatPrice(priceNum)}</p>
          {(product.stock ?? 0) > 0 && (product.stock ?? 0) < 10 && (
            <span className="text-xs text-orange-600 font-medium">Terbatas</span>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-3 sm:p-5 pt-0 flex gap-2">
        <Link href={`/products/${product.id}`} className="flex-1">
          <Button
            variant="outline"
            className="w-full h-9 sm:h-11 text-xs sm:text-base border-blue-200 hover:border-blue-400 hover:bg-blue-50 text-blue-600"
          >
            Detail
          </Button>
        </Link>
        <Button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="flex-1 btn-primary h-9 sm:h-11 text-xs sm:text-base px-2 sm:px-4"
        >
          <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 mr-1" />
          {product.stock === 0 ? "Habis" : "Beli"}
        </Button>
      </CardFooter>
    </Card>
  );
}
