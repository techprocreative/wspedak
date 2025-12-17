import Link from "next/link";
import { Plus, Package, TrendingUp, Users, ShoppingCart, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductTable } from "@/components/admin/product-table";
import { Card, CardContent } from "@/components/ui/card";
import { createServerClient } from "@/lib/supabase/server";

async function getStats() {
  const supabase = createServerClient();

  // Get total products
  const { count: productCount } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true });

  // Get total orders
  const { count: orderCount } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true });

  // Get unique customers (by unique customer names)
  const { data: customers } = await supabase
    .from("orders")
    .select("customer_name");
  const uniqueCustomers = new Set(customers?.map((c) => c.customer_name) || []);

  // Get total revenue
  const { data: orders } = await supabase
    .from("orders")
    .select("total_amount");
  const totalRevenue = orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;

  // Get pending orders count
  const { count: pendingOrders } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");

  return {
    products: productCount || 0,
    orders: orderCount || 0,
    customers: uniqueCustomers.size,
    revenue: totalRevenue,
    pendingOrders: pendingOrders || 0,
  };
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
