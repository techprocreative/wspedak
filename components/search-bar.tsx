"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SearchProduct {
    id: string;
    name: string;
    price: string;
    imageUrl: string | null;
    stock: number | null;
}

interface SearchBarProps {
    products: SearchProduct[];
}

export function SearchBar({ products }: SearchBarProps) {
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [results, setResults] = useState<SearchProduct[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        if (query.length >= 2) {
            const filtered = products.filter((product) =>
                product.name.toLowerCase().includes(query.toLowerCase())
            );
            setResults(filtered.slice(0, 5));
            setIsOpen(true);
        } else {
            setResults([]);
            setIsOpen(false);
        }
    }, [query, products]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const formatPrice = (price: string) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(Number(price) * 1000);
    };

    const handleSelect = (productId: string) => {
        setQuery("");
        setIsOpen(false);
        router.push(`/products#${productId}`);
    };

    return (
        <div ref={containerRef} className="relative w-full max-w-md">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                    ref={inputRef}
                    type="text"
                    placeholder="Cari produk..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-10 pr-10 bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-400"
                />
                {query && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                        onClick={() => setQuery("")}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                    {results.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                            {results.map((product) => (
                                <button
                                    key={product.id}
                                    onClick={() => handleSelect(product.id)}
                                    className="w-full flex items-center gap-3 p-3 hover:bg-blue-50 transition-colors text-left"
                                >
                                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                        {product.imageUrl ? (
                                            <Image
                                                src={product.imageUrl}
                                                alt={product.name}
                                                width={48}
                                                height={48}
                                                className="object-cover w-full h-full"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Package className="h-5 w-5 text-gray-400" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-900 truncate">{product.name}</p>
                                        <p className="text-sm text-blue-600 font-semibold">
                                            {formatPrice(product.price)}
                                        </p>
                                    </div>
                                    {(product.stock ?? 0) > 0 ? (
                                        <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                            Tersedia
                                        </span>
                                    ) : (
                                        <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full">
                                            Habis
                                        </span>
                                    )}
                                </button>
                            ))}
                            <Link
                                href={`/products?search=${encodeURIComponent(query)}`}
                                className="block p-3 text-center text-sm text-blue-600 hover:bg-blue-50 font-medium"
                                onClick={() => setIsOpen(false)}
                            >
                                Lihat semua hasil untuk "{query}"
                            </Link>
                        </div>
                    ) : (
                        <div className="p-6 text-center text-gray-500">
                            <Package className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                            <p>Tidak ada produk ditemukan</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
