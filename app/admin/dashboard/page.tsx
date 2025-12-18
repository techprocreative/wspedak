import Link from "next/link";
import { Plus, Package, TrendingUp, Users, ShoppingCart, ClipboardList, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductTable } from "@/components/admin/product-table";
import { Card, CardContent } from "@/components/ui/card";
import { db, products, orders } from "@/lib/db";
import { count, eq, sql } from "drizzle-orm";

async function getStats() {
  try {
    // Get total products
    const [productResult] = await db.select({ count: count() }).from(products);

    // Get total orders
    const [orderResult] = await db.select({ count: count() }).from(orders);

    // Get unique customers (by unique customer names)
    const customerData = await db.select({ customerName: orders.customerName }).from(orders);
    const uniqueCustomers = new Set(customerData.map((c) => c.customerName));

    // Get total revenue
    const revenueData = await db.select({ totalAmount: orders.totalAmount }).from(orders);
    const totalRevenue = revenueData.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);

    // Get pending orders count
    const [pendingResult] = await db
      .select({ count: count() })
      .from(orders)
      .where(eq(orders.status, "pending"));

    return {
      products: productResult?.count || 0,
      orders: orderResult?.count || 0,
      customers: uniqueCustomers.size,
      revenue: totalRevenue,
      pendingOrders: pendingResult?.count || 0,
    };
  } catch (error) {
    console.error("Error fetching stats:", error);
    return {
      products: 0,
      orders: 0,
      customers: 0,
      revenue: 0,
      pendingOrders: 0,
    };
  }
}

function formatRevenue(amount: number) {
  if (amount >= 1000000) {
    return `Rp ${(amount * 1000 / 1000000).toFixed(1)}M`;
  } else if (amount >= 1000) {
    return `Rp ${(amount * 1000 / 1000).toFixed(0)}K`;
  }
  return `Rp ${(amount * 1000).toLocaleString("id-ID")}`;
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="card-modern">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Produk
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.products}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-modern">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Pesanan
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.orders}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-modern">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Pesanan Pending
                </p>
                <p className="text-2xl font-bold text-orange-600 mt-1">
                  {stats.pendingOrders}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <ClipboardList className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-modern">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Pelanggan
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.customers}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-modern">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pendapatan</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatRevenue(stats.revenue)}
                </p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4">
        <Link href="/admin/new">
          <Button className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Produk
          </Button>
        </Link>
        <Link href="/admin/categories">
          <Button variant="outline" className="border-blue-200 hover:border-blue-400">
            <Tag className="h-4 w-4 mr-2" />
            Kelola Kategori
          </Button>
        </Link>
        <Link href="/admin/orders">
          <Button variant="outline" className="border-blue-200 hover:border-blue-400">
            <ClipboardList className="h-4 w-4 mr-2" />
            Kelola Pesanan
          </Button>
        </Link>
      </div>

      {/* Products Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Manajemen Produk
              </h2>
              <p className="text-gray-600 mt-1">
                Kelola semua produk di toko Anda
              </p>
            </div>
            <Link href="/admin/new">
              <Button className="btn-primary">
                <Plus className="h-4 w-4 mr-2" />
                Tambah Produk
              </Button>
            </Link>
          </div>
        </div>
        <div className="p-6">
          <ProductTable />
        </div>
      </div>
    </div>
  );
}
