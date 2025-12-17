import { db, orders, orderItems } from "@/lib/db";
import { desc, sql, gte, and, eq } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, TrendingUp, ShoppingCart, Users, DollarSign, Calendar } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
    // Get orders from last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentOrders = await db
        .select()
        .from(orders)
        .where(gte(orders.createdAt, thirtyDaysAgo))
        .orderBy(desc(orders.createdAt));

    // Calculate stats
    const totalRevenue = recentOrders.reduce(
        (sum, order) => sum + Number(order.totalAmount || 0),
        0
    );
    const totalOrders = recentOrders.length;
    const completedOrders = recentOrders.filter(o => o.status === "completed").length;
    const pendingOrders = recentOrders.filter(o => o.status === "pending").length;
    const uniqueCustomers = new Set(recentOrders.map(o => o.customerName)).size;

    // Group orders by date for chart data
    const ordersByDate: Record<string, { count: number; revenue: number }> = {};
    recentOrders.forEach((order) => {
        const date = order.createdAt
            ? new Date(order.createdAt).toISOString().split("T")[0]
            : "unknown";
        if (!ordersByDate[date]) {
            ordersByDate[date] = { count: 0, revenue: 0 };
        }
        ordersByDate[date].count++;
        ordersByDate[date].revenue += Number(order.totalAmount || 0);
    });

    const formatPrice = (amount: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount * 1000);
    };

    const formatDate = (dateStr: string) => {
        if (dateStr === "unknown") return "-";
        return new Intl.DateTimeFormat("id-ID", {
            day: "numeric",
            month: "short",
        }).format(new Date(dateStr));
    };

    // Get last 7 days for display
    const last7Days = Object.entries(ordersByDate)
        .sort((a, b) => b[0].localeCompare(a[0]))
        .slice(0, 7)
        .reverse();

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container-supermarket py-8">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <Link href="/admin/dashboard">
                            <Button variant="outline" className="border-gray-200">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Kembali
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Laporan Penjualan</h1>
                            <p className="text-gray-600">30 hari terakhir</p>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <Card className="card-modern">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">Total Pendapatan</p>
                                        <p className="text-2xl font-bold text-gray-900 mt-1">
                                            {formatPrice(totalRevenue)}
                                        </p>
                                    </div>
                                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                        <DollarSign className="h-6 w-6 text-green-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="card-modern">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">Total Pesanan</p>
                                        <p className="text-2xl font-bold text-gray-900 mt-1">{totalOrders}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                        <ShoppingCart className="h-6 w-6 text-blue-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="card-modern">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">Pesanan Selesai</p>
                                        <p className="text-2xl font-bold text-green-600 mt-1">{completedOrders}</p>
                                        <p className="text-xs text-gray-400">
                                            Pending: {pendingOrders}
                                        </p>
                                    </div>
                                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                        <TrendingUp className="h-6 w-6 text-purple-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="card-modern">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">Pelanggan Unik</p>
                                        <p className="text-2xl font-bold text-gray-900 mt-1">{uniqueCustomers}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                                        <Users className="h-6 w-6 text-orange-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Chart Section */}
                    <Card className="card-modern mb-8">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-blue-600" />
                                Pendapatan 7 Hari Terakhir
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {last7Days.length > 0 ? (
                                <div className="space-y-4">
                                    {last7Days.map(([date, data]) => {
                                        const maxRevenue = Math.max(...last7Days.map(d => d[1].revenue));
                                        const percentage = maxRevenue > 0 ? (data.revenue / maxRevenue) * 100 : 0;

                                        return (
                                            <div key={date} className="flex items-center gap-4">
                                                <div className="w-16 text-sm text-gray-500">{formatDate(date)}</div>
                                                <div className="flex-1">
                                                    <div className="h-8 bg-gray-100 rounded-lg overflow-hidden">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg transition-all duration-500"
                                                            style={{ width: `${Math.max(percentage, 5)}%` }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="w-32 text-right">
                                                    <p className="text-sm font-semibold text-gray-900">
                                                        {formatPrice(data.revenue)}
                                                    </p>
                                                    <p className="text-xs text-gray-500">{data.count} pesanan</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    Belum ada data pesanan
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Recent Orders */}
                    <Card className="card-modern">
                        <CardHeader>
                            <CardTitle>Pesanan Terbaru</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="divide-y divide-gray-100">
                                {recentOrders.slice(0, 10).map((order) => (
                                    <Link
                                        key={order.id}
                                        href={`/admin/orders/${order.id}`}
                                        className="flex items-center justify-between py-4 hover:bg-gray-50 -mx-4 px-4 transition-colors"
                                    >
                                        <div>
                                            <p className="font-medium text-gray-900">{order.customerName}</p>
                                            <p className="text-sm text-gray-500">
                                                {order.createdAt
                                                    ? new Intl.DateTimeFormat("id-ID", {
                                                        dateStyle: "medium",
                                                        timeStyle: "short",
                                                    }).format(new Date(order.createdAt))
                                                    : "-"}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-gray-900">
                                                {formatPrice(Number(order.totalAmount))}
                                            </p>
                                            <span
                                                className={`text-xs px-2 py-1 rounded-full ${order.status === "completed"
                                                        ? "bg-green-100 text-green-700"
                                                        : order.status === "pending"
                                                            ? "bg-yellow-100 text-yellow-700"
                                                            : "bg-gray-100 text-gray-700"
                                                    }`}
                                            >
                                                {order.status === "completed"
                                                    ? "Selesai"
                                                    : order.status === "pending"
                                                        ? "Menunggu"
                                                        : order.status}
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
