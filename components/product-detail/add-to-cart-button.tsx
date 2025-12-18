"use client";

import { useState } from "react";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store/cart-store";
import { toast } from "sonner";

interface ProductData {
    id: string;
    name: string;
    price: number;
    imageUrl: string | null;
    stock: number;
}

interface AddToCartButtonProps {
    product: ProductData;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
    const [quantity, setQuantity] = useState(1);
    const addItem = useCartStore((state) => state.addItem);

    const handleQuantityChange = (change: number) => {
        const newQuantity = quantity + change;
        if (newQuantity >= 1 && newQuantity <= product.stock) {
            setQuantity(newQuantity);
        }
    };

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addItem({
                productId: product.id,
                name: product.name,
                price: product.price,
                image_url: product.imageUrl || undefined,
            });
        }
        toast.success(`${quantity}x ${product.name} ditambahkan ke keranjang`);
        setQuantity(1);
    };

    const isOutOfStock = product.stock === 0;

    return (
        <div className="space-y-4">
            {/* Quantity Selector */}
            <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">Jumlah:</span>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1 || isOutOfStock}
                        className="h-10 w-10"
                    >
                        <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-xl font-bold w-12 text-center">{quantity}</span>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= product.stock || isOutOfStock}
                        className="h-10 w-10"
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Stock Info */}
            {!isOutOfStock && product.stock < 20 && (
                <p className="text-sm text-orange-600">
                    Tersisa {product.stock} item
                </p>
            )}

            {/* Add to Cart Button */}
            <Button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="w-full h-12 btn-primary text-lg"
            >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {isOutOfStock ? "Stok Habis" : "Tambah ke Keranjang"}
            </Button>
        </div>
    );
}
