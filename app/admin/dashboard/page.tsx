import Link from "next/link";
import { Plus, Package, TrendingUp, Users, ShoppingCart, ClipboardList, Tag, AlertTriangle, Star, FileDown, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductTable } from "@/components/admin/product-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db, products, orders, orderItems } from "@/lib/db";
import { count, eq, sql, lt, desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

const LOW_STOCK_THRESHOLD = 10;

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

    // Get low stock products
    const lowStockProducts = await db
      .select()
      .from(products)
      .where(lt(products.stock, LOW_STOCK_THRESHOLD))
      .orderBy(products.stock);

    // Get best selling products (top 5)
    const bestSellers = await db
      .select({
        productName: orderItems.productName,
        totalSold: sql<number>`SUM(${orderItems.quantity})`.as('total_sold'),
      })
      .from(orderItems)
      .groupBy(orderItems.productName)
      .orderBy(desc(sql`SUM(${orderItems.quantity})`))
      .limit(5);

    return {
      products: productResult?.count || 0,
      orders: orderResult?.count || 0,
      customers: uniqueCustomers.size,
      revenue: totalRevenue,
      pendingOrders: pendingResult?.count || 0,
      lowStockProducts,
      bestSellers,
    };
  } catch (error) {
    console.error("Error fetching stats:", error);
    return {
      products: 0,
      orders: 0,
      customers: 0,
      revenue: 0,
      pendingOrders: 0,
      lowStockProducts: [],
      bestSellers: [],
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
        <Link href="/admin/reports">
          <Button variant="outline" className="border-blue-200 hover:border-blue-400">
            <TrendingUp className="h-4 w-4 mr-2" />
            Laporan
          </Button>
        </Link>
        <Link href="/admin/customers">
          <Button variant="outline" className="border-blue-200 hover:border-blue-400">
            <Users className="h-4 w-4 mr-2" />
            Pelanggan
          </Button>
        </Link>
        <Link href="/admin/export">
          <Button variant="outline" className="border-green-200 hover:border-green-400 text-green-700">
            <FileDown className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </Link>
        <Link href="/admin/bulk-stock">
          <Button variant="outline" className="border-orange-200 hover:border-orange-400 text-orange-700">
            <Package className="h-4 w-4 mr-2" />
            Update Stok
          </Button>
        </Link>
        <Link href="/admin/bulk-price">
          <Button variant="outline" className="border-emerald-200 hover:border-emerald-400 text-emerald-700">
            <DollarSign className="h-4 w-4 mr-2" />
            Update Harga
          </Button>
        </Link>
      </div>

      {/* Alerts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alert */}
        <Card className={`card-modern ${stats.lowStockProducts.length > 0 ? 'border-orange-300 bg-orange-50/50' : ''}`}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className={`h-5 w-5 ${stats.lowStockProducts.length > 0 ? 'text-orange-500' : 'text-gray-400'}`} />
              Stok Menipis
              {stats.lowStockProducts.length > 0 && (
                <span className="ml-auto bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                  {stats.lowStockProducts.length}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {stats.lowStockProducts.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {stats.lowStockProducts.slice(0, 5).map((product) => (
                  <Link
                    key={product.id}
                    href={`/admin/edit/${product.id}`}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-orange-100 transition-colors"
                  >
                    <span className="font-medium text-gray-900 truncate">{product.name}</span>
                    <span className={`text-sm font-bold px-2 py-1 rounded ${product.stock === 0 ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                      {product.stock === 0 ? 'Habis' : `${product.stock} pcs`}
                    </span>
                  </Link>
                ))}
                {stats.lowStockProducts.length > 5 && (
                  <p className="text-sm text-gray-500 text-center pt-2">
                    +{stats.lowStockProducts.length - 5} produk lainnya
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Semua stok aman ✓</p>
            )}
          </CardContent>
        </Card>

        {/* Best Sellers */}
        <Card className="card-modern">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Produk Terlaris
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {stats.bestSellers.length > 0 ? (
              <div className="space-y-2">
                {stats.bestSellers.map((item, index) => (
                  <div key={item.productName} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${index === 0 ? 'bg-yellow-100 text-yellow-700' :
                        index === 1 ? 'bg-gray-200 text-gray-700' :
                          index === 2 ? 'bg-orange-100 text-orange-700' :
                            'bg-gray-100 text-gray-600'
                        }`}>
                        {index + 1}
                      </span>
                      <span className="font-medium text-gray-900 truncate">{item.productName}</span>
                    </div>
                    <span className="text-sm text-blue-600 font-semibold">{item.totalSold} terjual</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Belum ada data penjualan</p>
            )}
          </CardContent>
        </Card>
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
