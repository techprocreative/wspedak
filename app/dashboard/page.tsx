"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { supabase } from "@/lib/supabase/client";
import {
    Package,
    ShoppingBag,
    Clock,
    CheckCircle,
    Truck,
    XCircle,
    ArrowLeft,
    RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Order } from "@/lib/types/order";

const statusConfig = {
    pending: { label: "Menunggu", icon: Clock, color: "bg-yellow-100 text-yellow-800" },
    confirmed: { label: "Dikonfirmasi", icon: CheckCircle, color: "bg-blue-100 text-blue-800" },
    processing: { label: "Diproses", icon: Package, color: "bg-purple-100 text-purple-800" },
    shipped: { label: "Dikirim", icon: Truck, color: "bg-cyan-100 text-cyan-800" },
    delivered: { label: "Selesai", icon: CheckCircle, color: "bg-green-100 text-green-800" },
    cancelled: { label: "Dibatalkan", icon: XCircle, color: "bg-red-100 text-red-800" },
};

export default function DashboardPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchOrderId, setSearchOrderId] = useState("");

    const fetchOrders = async (orderId?: string) => {
        setLoading(true);
        try {
            let query = supabase
                .from("orders")
                .select("*")
                .order("created_at", { ascending: false })
                .limit(10);

            if (orderId) {
                query = query.ilike("id", `${orderId}%`);
            }

            const { data, error } = await query;

            if (error) throw error;
            setOrders(data || []);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchOrders(searchOrderId.trim());
    };

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
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
            <Navbar />

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 to-blue-500 py-12">
                <div className="container-supermarket">
                    <div className="text-center text-white">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <ShoppingBag className="h-8 w-8 text-white" />
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-bold mb-4">
                            Riwayat Pesanan
                        </h1>
                        <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                            Lacak status pesanan Anda di Toserba WS Pedak
                        </p>
                    </div>
                </div>
            </section>

            {/* Search & Orders */}
            <section className="section-spacing">
                <div className="container-supermarket">
                    {/* Search Box */}
                    <Card className="card-modern mb-8">
                        <CardHeader>
                            <CardTitle>Cari Pesanan</CardTitle>
                            <CardDescription>
                                Masukkan Order ID untuk melacak pesanan Anda
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSearch} className="flex gap-4">
                                <input
                                    type="text"
                                    placeholder="Masukkan Order ID (contoh: A1B2C3D4)"
                                    value={searchOrderId}
                                    onChange={(e) => setSearchOrderId(e.target.value)}
                                    className="input-modern flex-1"
                                />
                                <Button type="submit" className="btn-primary">
                                    Cari
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setSearchOrderId("");
                                        fetchOrders();
                                    }}
                                >
                                    <RefreshCw className="h-4 w-4" />
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Orders List */}
                    {loading ? (
                        <div className="text-center py-16">
                            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Package className="h-8 w-8 text-blue-500 animate-pulse" />
                            </div>
                            <p className="text-gray-600">Memuat pesanan...</p>
                        </div>
                    ) : orders.length === 0 ? (
                        <Card className="card-modern">
                            <CardContent className="py-16 text-center">
                                <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <ShoppingBag className="h-10 w-10 text-blue-500" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    Belum Ada Pesanan
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    {searchOrderId
                                        ? "Pesanan dengan ID tersebut tidak ditemukan"
                                        : "Anda belum memiliki riwayat pesanan"}
                                </p>
                                <Link href="/products">
                                    <Button className="btn-primary">
                                        <ArrowLeft className="h-4 w-4 mr-2" />
                                        Mulai Belanja
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((order) => {
                                const status = statusConfig[order.status] || statusConfig.pending;
                                const StatusIcon = status.icon;

                                return (
                                    <Card key={order.id} className="card-modern">
                                        <CardContent className="p-6">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                                                            #{order.id.slice(0, 8).toUpperCase()}
                                                        </span>
                                                        <Badge className={`${status.color} border-0`}>
                                                            <StatusIcon className="h-3 w-3 mr-1" />
                                                            {status.label}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-gray-900 font-semibold">
                                                        {order.customer_name}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        {order.customer_address}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {formatDate(order.created_at)}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-2xl font-bold text-blue-600">
                                                        {formatPrice(order.total_amount)}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-8">
                <div className="container-supermarket text-center">
                    <p className="text-gray-400">
                        © 2024 Toserba WS Pedak. Murah • Lengkap • Luas
                    </p>
                </div>
            </footer>
        </div>
    );
}
