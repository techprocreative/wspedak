import { db, orders, orderItems, products } from "@/lib/db";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ArrowLeft, Package, MapPin, Phone, User, Calendar, Clock, Printer } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PrintInvoiceButton } from "@/components/admin/print-invoice-button";

interface OrderDetailPageProps {
    params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
    const { id } = await params;

    const [order] = await db
        .select()
        .from(orders)
        .where(eq(orders.id, id));

    if (!order) {
        notFound();
    }

    const items = await db
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, id));

    const formatPrice = (price: string | number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(Number(price) * 1000);
    };

    const formatDate = (date: Date | null) => {
        if (!date) return "-";
        return new Intl.DateTimeFormat("id-ID", {
            dateStyle: "long",
            timeStyle: "short",
        }).format(new Date(date));
    };

    const getStatusBadge = (status: string | null) => {
        switch (status) {
            case "pending":
                return <Badge className="bg-yellow-100 text-yellow-800">Menunggu</Badge>;
            case "processing":
                return <Badge className="bg-blue-100 text-blue-800">Diproses</Badge>;
            case "completed":
                return <Badge className="bg-green-100 text-green-800">Selesai</Badge>;
            case "cancelled":
                return <Badge className="bg-red-100 text-red-800">Dibatalkan</Badge>;
            default:
                return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
        }
    };

    // Prepare order data for print
    const orderData = {
        id: order.id,
        customerName: order.customerName,
        customerAddress: order.customerAddress,
        customerPhone: order.customerPhone,
        totalAmount: order.totalAmount,
        status: order.status,
        notes: order.notes,
        createdAt: order.createdAt?.toISOString() || null,
        items: items.map((item) => ({
            productName: item.productName,
            quantity: item.quantity,
            price: String(item.price),
        })),
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container-supermarket py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <Link href="/admin/orders">
                                <Button variant="outline" className="border-gray-200">
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Kembali
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Detail Pesanan</h1>
                                <p className="text-gray-600">ID: {order.id.slice(0, 8)}...</p>
                            </div>
                        </div>
                        <PrintInvoiceButton order={orderData} />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Order Info */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Customer Info */}
                            <Card className="card-modern">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="h-5 w-5 text-blue-600" />
                                        Informasi Pelanggan
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <User className="h-5 w-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-500">Nama</p>
                                            <p className="font-medium">{order.customerName}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-500">Alamat</p>
                                            <p className="font-medium">{order.customerAddress}</p>
                                        </div>
                                    </div>
                                    {order.customerPhone && (
                                        <div className="flex items-start gap-3">
                                            <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-gray-500">Telepon</p>
                                                <p className="font-medium">{order.customerPhone}</p>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Order Items */}
                            <Card className="card-modern">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Package className="h-5 w-5 text-blue-600" />
                                        Item Pesanan ({items.length})
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="divide-y divide-gray-100">
                                        {items.map((item) => (
                                            <div key={item.id} className="py-4 flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium text-gray-900">{item.productName}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {item.quantity} x {formatPrice(item.price)}
                                                    </p>
                                                </div>
                                                <p className="font-semibold text-gray-900">
                                                    {formatPrice(Number(item.price) * item.quantity)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="border-t border-gray-200 pt-4 mt-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-semibold">Total</span>
                                            <span className="text-xl font-bold text-blue-600">
                                                {formatPrice(order.totalAmount)}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Status */}
                            <Card className="card-modern">
                                <CardHeader>
                                    <CardTitle>Status Pesanan</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center">
                                        {getStatusBadge(order.status)}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Timestamps */}
                            <Card className="card-modern">
                                <CardHeader>
                                    <CardTitle>Waktu</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="h-4 w-4 text-gray-400" />
                                        <div>
                                            <p className="text-xs text-gray-500">Dibuat</p>
                                            <p className="text-sm font-medium">{formatDate(order.createdAt)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Clock className="h-4 w-4 text-gray-400" />
                                        <div>
                                            <p className="text-xs text-gray-500">Diperbarui</p>
                                            <p className="text-sm font-medium">{formatDate(order.updatedAt)}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Notes */}
                            {order.notes && (
                                <Card className="card-modern">
                                    <CardHeader>
                                        <CardTitle>Catatan</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-600 text-sm">{order.notes}</p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
