"use client";

import { useState, useEffect } from "react";
import { FileDown, Package, ShoppingCart, Users, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import Link from "next/link";

export default function ExportPage() {
    const [exporting, setExporting] = useState<string | null>(null);

    const exportToCSV = (data: Record<string, unknown>[], filename: string) => {
        if (data.length === 0) {
            toast.error("Tidak ada data untuk diexport");
            return;
        }

        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(","),
            ...data.map((row) =>
                headers.map((header) => {
                    const value = row[header];
                    // Escape quotes and wrap in quotes if contains comma
                    const stringValue = String(value ?? "").replace(/"/g, '""');
                    return stringValue.includes(",") ? `"${stringValue}"` : stringValue;
                }).join(",")
            ),
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `${filename}_${new Date().toISOString().split("T")[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success(`${filename} berhasil diexport!`);
    };

    const exportProducts = async () => {
        setExporting("products");
        try {
            const { data, error } = await supabase
                .from("products")
                .select("id, name, description, price, stock, category, created_at")
                .order("name");

            if (error) throw error;

            const formatted = data?.map((p) => ({
                ID: p.id,
                Nama: p.name,
                Deskripsi: p.description || "",
                Harga: Number(p.price) * 1000,
                Stok: p.stock,
                Kategori: p.category || "Lainnya",
                Dibuat: p.created_at,
            }));

            exportToCSV(formatted || [], "produk");
        } catch (error) {
            console.error(error);
            toast.error("Gagal export produk");
        }
        setExporting(null);
    };

    const exportOrders = async () => {
        setExporting("orders");
        try {
            const { data, error } = await supabase
                .from("orders")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;

            const formatted = data?.map((o) => ({
                ID: o.id,
                Pelanggan: o.customer_name,
                Alamat: o.customer_address,
                Telepon: o.customer_phone || "",
                Total: Number(o.total_amount) * 1000,
                Status: o.status,
                Catatan: o.notes || "",
                Tanggal: o.created_at,
            }));

            exportToCSV(formatted || [], "pesanan");
        } catch (error) {
            console.error(error);
            toast.error("Gagal export pesanan");
        }
        setExporting(null);
    };

    const exportCustomers = async () => {
        setExporting("customers");
        try {
            const { data, error } = await supabase
                .from("orders")
                .select("customer_name, customer_address, customer_phone")
                .order("customer_name");

            if (error) throw error;

            // Get unique customers
            const uniqueCustomers = new Map<string, { name: string; address: string; phone: string }>();
            data?.forEach((o) => {
                if (!uniqueCustomers.has(o.customer_name)) {
                    uniqueCustomers.set(o.customer_name, {
                        name: o.customer_name,
                        address: o.customer_address,
                        phone: o.customer_phone || "",
                    });
                }
            });

            const formatted = Array.from(uniqueCustomers.values()).map((c) => ({
                Nama: c.name,
                Alamat: c.address,
                Telepon: c.phone,
            }));

            exportToCSV(formatted, "pelanggan");
        } catch (error) {
            console.error(error);
            toast.error("Gagal export pelanggan");
        }
        setExporting(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/dashboard">
                    <Button variant="outline">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Kembali
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Export Data</h1>
                    <p className="text-gray-600">Download data dalam format CSV</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="card-modern">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Package className="h-5 w-5 text-blue-500" />
                            Export Produk
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600 text-sm mb-4">
                            Download semua data produk termasuk nama, harga, stok, dan kategori.
                        </p>
                        <Button
                            onClick={exportProducts}
                            disabled={exporting !== null}
                            className="w-full btn-primary"
                        >
                            <FileDown className="h-4 w-4 mr-2" />
                            {exporting === "products" ? "Mengexport..." : "Download CSV"}
                        </Button>
                    </CardContent>
                </Card>

                <Card className="card-modern">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ShoppingCart className="h-5 w-5 text-green-500" />
                            Export Pesanan
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600 text-sm mb-4">
                            Download semua data pesanan termasuk pelanggan, total, dan status.
                        </p>
                        <Button
                            onClick={exportOrders}
                            disabled={exporting !== null}
                            className="w-full bg-green-600 hover:bg-green-700 text-white"
                        >
                            <FileDown className="h-4 w-4 mr-2" />
                            {exporting === "orders" ? "Mengexport..." : "Download CSV"}
                        </Button>
                    </CardContent>
                </Card>

                <Card className="card-modern">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-purple-500" />
                            Export Pelanggan
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600 text-sm mb-4">
                            Download daftar pelanggan unik dengan info kontak mereka.
                        </p>
                        <Button
                            onClick={exportCustomers}
                            disabled={exporting !== null}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                        >
                            <FileDown className="h-4 w-4 mr-2" />
                            {exporting === "customers" ? "Mengexport..." : "Download CSV"}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
