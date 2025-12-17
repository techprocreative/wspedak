"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    Clock,
    CheckCircle,
    Package,
    Truck,
    XCircle,
    Eye,
    MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase/client";
import { Order } from "@/lib/types/order";
import { toast } from "sonner";

const statusConfig = {
    pending: { label: "Menunggu", icon: Clock, color: "bg-yellow-100 text-yellow-800" },
    confirmed: { label: "Dikonfirmasi", icon: CheckCircle, color: "bg-blue-100 text-blue-800" },
    processing: { label: "Diproses", icon: Package, color: "bg-purple-100 text-purple-800" },
    shipped: { label: "Dikirim", icon: Truck, color: "bg-cyan-100 text-cyan-800" },
    delivered: { label: "Selesai", icon: CheckCircle, color: "bg-green-100 text-green-800" },
    cancelled: { label: "Dibatalkan", icon: XCircle, color: "bg-red-100 text-red-800" },
};

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>("all");

    const fetchOrders = async () => {
        setLoading(true);
        try {
            let query = supabase
                .from("orders")
                .select("*")
                .order("created_at", { ascending: false });

            if (filter !== "all") {
                query = query.eq("status", filter);
            }

            const { data, error } = await query;

            if (error) throw error;
            setOrders(data || []);
        } catch (error) {
            console.error("Error fetching orders:", error);
            toast.error("Gagal memuat pesanan");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [filter]);

    const updateOrderStatus = async (orderId: string, newStatus: string) => {
        try {
            const { error } = await supabase
                .from("orders")
                .update({ status: newStatus })
                .eq("id", orderId);

            if (error) throw error;

            toast.success("Status pesanan berhasil diupdate");
            fetchOrders();
        } catch (error) {
            console.error("Error updating order:", error);
            toast.error("Gagal mengupdate status pesanan");
        }
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
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Kelola Pesanan</h1>
                    <p className="text-gray-600">Lihat dan kelola semua pesanan pelanggan</p>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
                <Button
                    variant={filter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("all")}
                >
                    Semua
                </Button>
                <Button
                    variant={filter === "pending" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("pending")}
                >
                    Menunggu
                </Button>
                <Button
                    variant={filter === "confirmed" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("confirmed")}
                >
                    Dikonfirmasi
                </Button>
                <Button
                    variant={filter === "processing" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("processing")}
                >
                    Diproses
                </Button>
                <Button
                    variant={filter === "shipped" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("shipped")}
                >
                    Dikirim
                </Button>
                <Button
                    variant={filter === "delivered" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("delivered")}
                >
                    Selesai
                </Button>
            </div>

            {/* Orders Table */}
            <Card className="card-modern">
                <CardContent className="p-0">
                    {loading ? (
                        <div className="text-center py-16">
                            <Package className="h-8 w-8 text-blue-500 animate-pulse mx-auto mb-2" />
                            <p className="text-gray-600">Memuat pesanan...</p>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="text-center py-16">
                            <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-600">Belum ada pesanan</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50">
                                    <TableHead>Order ID</TableHead>
                                    <TableHead>Pelanggan</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Tanggal</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.map((order) => {
                                    const status = statusConfig[order.status] || statusConfig.pending;
                                    const StatusIcon = status.icon;

                                    return (
                                        <TableRow key={order.id} className="hover:bg-blue-50">
                                            <TableCell className="font-mono text-sm">
                                                #{order.id.slice(0, 8).toUpperCase()}
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">{order.customer_name}</p>
                                                    <p className="text-sm text-gray-500 truncate max-w-[200px]">
                                                        {order.customer_address}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-semibold text-blue-600">
                                                {formatPrice(order.total_amount)}
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={`${status.color} border-0`}>
                                                    <StatusIcon className="h-3 w-3 mr-1" />
                                                    {status.label}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm text-gray-500">
                                                {formatDate(order.created_at)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem
                                                            onClick={() => updateOrderStatus(order.id, "confirmed")}
                                                        >
                                                            Konfirmasi
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => updateOrderStatus(order.id, "processing")}
                                                        >
                                                            Proses
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => updateOrderStatus(order.id, "shipped")}
                                                        >
                                                            Kirim
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => updateOrderStatus(order.id, "delivered")}
                                                        >
                                                            Selesai
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => updateOrderStatus(order.id, "cancelled")}
                                                            className="text-red-600"
                                                        >
                                                            Batalkan
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
