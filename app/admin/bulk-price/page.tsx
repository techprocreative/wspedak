"use client";

import { useState, useEffect } from "react";
import { DollarSign, ArrowLeft, Save, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import Link from "next/link";

interface Product {
    id: string;
    name: string;
    price: string;
    category: string | null;
}

export default function BulkPricePage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [priceUpdates, setPriceUpdates] = useState<Map<string, number>>(new Map());

    useEffect(() => {
        async function fetchProducts() {
            try {
                const { data, error } = await supabase
                    .from("products")
                    .select("id, name, price, category")
                    .order("name");

                if (error) throw error;
                setProducts(data || []);
            } catch (error) {
                console.error(error);
                toast.error("Gagal memuat produk");
            }
            setLoading(false);
        }

        fetchProducts();
    }, []);

    const filteredProducts = products.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.category?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
    );

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(price * 1000);
    };

    const handleDirectInput = (productId: string, currentPrice: number, value: string) => {
        const numValue = parseFloat(value) || 0;
        const newValue = Math.max(0, numValue);

        const newUpdates = new Map(priceUpdates);
        if (newValue === currentPrice) {
            newUpdates.delete(productId);
        } else {
            newUpdates.set(productId, newValue);
        }
        setPriceUpdates(newUpdates);
    };

    const handleSaveAll = async () => {
        if (priceUpdates.size === 0) {
            toast.info("Tidak ada perubahan untuk disimpan");
            return;
        }

        setSaving(true);
        try {
            const updates = Array.from(priceUpdates.entries());

            for (const [id, newPrice] of updates) {
                const { error } = await supabase
                    .from("products")
                    .update({ price: newPrice })
                    .eq("id", id);

                if (error) throw error;
            }

            toast.success(`${updates.length} harga produk berhasil diupdate!`);

            // Update local state
            setProducts(products.map(p => ({
                ...p,
                price: priceUpdates.has(p.id) ? String(priceUpdates.get(p.id)!) : p.price
            })));
            setPriceUpdates(new Map());
        } catch (error) {
            console.error(error);
            toast.error("Gagal menyimpan perubahan");
        }
        setSaving(false);
    };

    const getPriceDisplay = (product: Product) => {
        const updated = priceUpdates.get(product.id);
        return updated !== undefined ? updated : Number(product.price);
    };

    const hasChanges = (product: Product) => {
        return priceUpdates.has(product.id);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/dashboard">
                        <Button variant="outline">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Kembali
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Update Harga Massal</h1>
                        <p className="text-gray-600">Ubah harga beberapa produk sekaligus</p>
                    </div>
                </div>
                <Button
                    onClick={handleSaveAll}
                    disabled={saving || priceUpdates.size === 0}
                    className="btn-primary"
                >
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? "Menyimpan..." : `Simpan (${priceUpdates.size})`}
                </Button>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                    type="text"
                    placeholder="Cari produk..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-10 input-modern"
                />
                {searchQuery && (
                    <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>

            {priceUpdates.size > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-700 font-medium">
                        {priceUpdates.size} harga akan diupdate. Klik "Simpan" untuk menyimpan perubahan.
                    </p>
                </div>
            )}

            <Card className="card-modern">
                <CardContent className="p-0">
                    {loading ? (
                        <div className="text-center py-16">
                            <DollarSign className="h-8 w-8 text-green-500 animate-pulse mx-auto mb-2" />
                            <p className="text-gray-600">Memuat produk...</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50">
                                    <TableHead className="font-semibold">Produk</TableHead>
                                    <TableHead className="font-semibold">Kategori</TableHead>
                                    <TableHead className="font-semibold text-right">Harga Saat Ini</TableHead>
                                    <TableHead className="font-semibold text-center">Harga Baru (Rp ribu)</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredProducts.map((product) => (
                                    <TableRow
                                        key={product.id}
                                        className={`hover:bg-green-50 ${hasChanges(product) ? 'bg-yellow-50' : ''}`}
                                    >
                                        <TableCell className="font-medium">{product.name}</TableCell>
                                        <TableCell className="text-gray-500">{product.category || "Lainnya"}</TableCell>
                                        <TableCell className="text-right">
                                            <span className="font-semibold text-blue-600">
                                                {formatPrice(Number(product.price))}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-center gap-2">
                                                <span className="text-gray-500">Rp</span>
                                                <Input
                                                    type="number"
                                                    value={getPriceDisplay(product)}
                                                    onChange={(e) => handleDirectInput(product.id, Number(product.price), e.target.value)}
                                                    className="w-24 text-center h-8"
                                                    min="0"
                                                    step="0.5"
                                                />
                                                <span className="text-gray-500">.000</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <div className="text-sm text-gray-500">
                <p><strong>Catatan:</strong> Harga diinput dalam satuan ribu rupiah. Contoh: input 15 = Rp 15.000</p>
            </div>
        </div>
    );
}
