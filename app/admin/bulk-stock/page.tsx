"use client";

import { useState, useEffect } from "react";
import { Package, ArrowLeft, Save, Search, X, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    stock: number;
    category: string | null;
}

interface StockUpdate {
    id: string;
    newStock: number;
}

export default function BulkStockPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [stockUpdates, setStockUpdates] = useState<Map<string, number>>(new Map());

    useEffect(() => {
        async function fetchProducts() {
            try {
                const { data, error } = await supabase
                    .from("products")
                    .select("id, name, stock, category")
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

    const handleStockChange = (productId: string, currentStock: number, change: number) => {
        const existingUpdate = stockUpdates.get(productId);
        const currentValue = existingUpdate !== undefined ? existingUpdate : currentStock;
        const newValue = Math.max(0, currentValue + change);

        const newUpdates = new Map(stockUpdates);
        if (newValue === currentStock) {
            newUpdates.delete(productId);
        } else {
            newUpdates.set(productId, newValue);
        }
        setStockUpdates(newUpdates);
    };

    const handleDirectInput = (productId: string, currentStock: number, value: string) => {
        const numValue = parseInt(value) || 0;
        const newValue = Math.max(0, numValue);

        const newUpdates = new Map(stockUpdates);
        if (newValue === currentStock) {
            newUpdates.delete(productId);
        } else {
            newUpdates.set(productId, newValue);
        }
        setStockUpdates(newUpdates);
    };

    const handleSaveAll = async () => {
        if (stockUpdates.size === 0) {
            toast.info("Tidak ada perubahan untuk disimpan");
            return;
        }

        setSaving(true);
        try {
            const updates = Array.from(stockUpdates.entries());

            for (const [id, newStock] of updates) {
                const { error } = await supabase
                    .from("products")
                    .update({ stock: newStock })
                    .eq("id", id);

                if (error) throw error;
            }

            toast.success(`${updates.length} produk berhasil diupdate!`);

            // Update local state
            setProducts(products.map(p => ({
                ...p,
                stock: stockUpdates.has(p.id) ? stockUpdates.get(p.id)! : p.stock
            })));
            setStockUpdates(new Map());
        } catch (error) {
            console.error(error);
            toast.error("Gagal menyimpan perubahan");
        }
        setSaving(false);
    };

    const getStockDisplay = (product: Product) => {
        const updated = stockUpdates.get(product.id);
        return updated !== undefined ? updated : product.stock;
    };

    const hasChanges = (product: Product) => {
        return stockUpdates.has(product.id);
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
                        <h1 className="text-2xl font-bold text-gray-900">Update Stok Massal</h1>
                        <p className="text-gray-600">Ubah stok beberapa produk sekaligus</p>
                    </div>
                </div>
                <Button
                    onClick={handleSaveAll}
                    disabled={saving || stockUpdates.size === 0}
                    className="btn-primary"
                >
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? "Menyimpan..." : `Simpan (${stockUpdates.size})`}
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

            {stockUpdates.size > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-700 font-medium">
                        {stockUpdates.size} produk akan diupdate. Klik "Simpan" untuk menyimpan perubahan.
                    </p>
                </div>
            )}

            <Card className="card-modern">
                <CardContent className="p-0">
                    {loading ? (
                        <div className="text-center py-16">
                            <Package className="h-8 w-8 text-blue-500 animate-pulse mx-auto mb-2" />
                            <p className="text-gray-600">Memuat produk...</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50">
                                    <TableHead className="font-semibold">Produk</TableHead>
                                    <TableHead className="font-semibold">Kategori</TableHead>
                                    <TableHead className="font-semibold text-center">Stok Saat Ini</TableHead>
                                    <TableHead className="font-semibold text-center">Stok Baru</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredProducts.map((product) => (
                                    <TableRow
                                        key={product.id}
                                        className={`hover:bg-blue-50 ${hasChanges(product) ? 'bg-yellow-50' : ''}`}
                                    >
                                        <TableCell className="font-medium">{product.name}</TableCell>
                                        <TableCell className="text-gray-500">{product.category || "Lainnya"}</TableCell>
                                        <TableCell className="text-center">
                                            <span className={`px-2 py-1 rounded ${product.stock === 0 ? 'bg-red-100 text-red-700' :
                                                    product.stock < 10 ? 'bg-orange-100 text-orange-700' :
                                                        'bg-green-100 text-green-700'
                                                }`}>
                                                {product.stock}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleStockChange(product.id, product.stock, -1)}
                                                    className="h-8 w-8 p-0"
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </Button>
                                                <Input
                                                    type="number"
                                                    value={getStockDisplay(product)}
                                                    onChange={(e) => handleDirectInput(product.id, product.stock, e.target.value)}
                                                    className="w-20 text-center h-8"
                                                    min="0"
                                                />
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleStockChange(product.id, product.stock, 1)}
                                                    className="h-8 w-8 p-0"
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
