"use client";

import { useState, useEffect } from "react";
import { Users, ArrowLeft, Phone, MapPin, ShoppingCart, Search, X } from "lucide-react";
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

interface Customer {
    name: string;
    address: string;
    phone: string;
    totalOrders: number;
    totalSpent: number;
    lastOrder: string;
}

export default function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        async function fetchCustomers() {
            try {
                const { data, error } = await supabase
                    .from("orders")
                    .select("customer_name, customer_address, customer_phone, total_amount, created_at")
                    .order("created_at", { ascending: false });

                if (error) throw error;

                // Aggregate by customer
                const customerMap = new Map<string, Customer>();
                data?.forEach((order) => {
                    const existing = customerMap.get(order.customer_name);
                    if (existing) {
                        existing.totalOrders++;
                        existing.totalSpent += Number(order.total_amount);
                    } else {
                        customerMap.set(order.customer_name, {
                            name: order.customer_name,
                            address: order.customer_address,
                            phone: order.customer_phone || "-",
                            totalOrders: 1,
                            totalSpent: Number(order.total_amount),
                            lastOrder: order.created_at,
                        });
                    }
                });

                const sorted = Array.from(customerMap.values()).sort(
                    (a, b) => b.totalSpent - a.totalSpent
                );
                setCustomers(sorted);
            } catch (error) {
                console.error(error);
                toast.error("Gagal memuat data pelanggan");
            }
            setLoading(false);
        }

        fetchCustomers();
    }, []);

    const filteredCustomers = customers.filter((c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.includes(searchQuery) ||
        c.address.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(price * 1000);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
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
                        <h1 className="text-2xl font-bold text-gray-900">Daftar Pelanggan</h1>
                        <p className="text-gray-600">{customers.length} pelanggan terdaftar</p>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                    type="text"
                    placeholder="Cari nama, telepon, atau alamat..."
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

            <Card className="card-modern">
                <CardContent className="p-0">
                    {loading ? (
                        <div className="text-center py-16">
                            <Users className="h-8 w-8 text-blue-500 animate-pulse mx-auto mb-2" />
                            <p className="text-gray-600">Memuat pelanggan...</p>
                        </div>
                    ) : filteredCustomers.length === 0 ? (
                        <div className="text-center py-16">
                            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-600">
                                {searchQuery ? "Tidak ada pelanggan yang cocok" : "Belum ada pelanggan"}
                            </p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50">
                                    <TableHead className="font-semibold">Pelanggan</TableHead>
                                    <TableHead className="font-semibold">Kontak</TableHead>
                                    <TableHead className="font-semibold text-center">Total Pesanan</TableHead>
                                    <TableHead className="font-semibold">Total Belanja</TableHead>
                                    <TableHead className="font-semibold">Terakhir Order</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredCustomers.map((customer, index) => (
                                    <TableRow key={customer.name + index} className="hover:bg-blue-50">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <span className="text-blue-600 font-bold">
                                                        {customer.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{customer.name}</p>
                                                    <p className="text-sm text-gray-500 truncate max-w-[200px]">
                                                        {customer.address}
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1 text-sm text-gray-600">
                                                <Phone className="h-3 w-3" />
                                                {customer.phone}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm font-medium">
                                                {customer.totalOrders}x
                                            </span>
                                        </TableCell>
                                        <TableCell className="font-semibold text-green-600">
                                            {formatPrice(customer.totalSpent)}
                                        </TableCell>
                                        <TableCell className="text-sm text-gray-500">
                                            {formatDate(customer.lastOrder)}
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
