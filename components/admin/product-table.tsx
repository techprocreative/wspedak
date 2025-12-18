"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Edit, Trash2, ShoppingCart, Package, Tag } from "lucide-react";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase/client";
import { Product } from "@/lib/types/product";
import { toast } from "sonner";

export function ProductTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Gagal memuat produk");
      console.error(error);
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", deleteId);

    if (error) {
      toast.error("Gagal menghapus produk");
      console.error(error);
    } else {
      toast.success("Produk berhasil dihapus");
      fetchProducts();
    }
    setDeleteId(null);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price * 1000);
  };

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Package className="h-8 w-8 text-blue-500 animate-pulse" />
        </div>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 font-medium">Memuat produk...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Package className="h-10 w-10 text-blue-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Belum Ada Produk
        </h3>
        <p className="text-gray-600 mb-6 max-w-sm mx-auto">
          Mulai tambahkan produk pertama Anda untuk memulai bisnis
        </p>
        <Link href="/admin/new">
          <Button className="btn-primary">
            <Package className="h-4 w-4 mr-2" />
            Tambah Produk
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 border-b border-gray-200">
                <TableHead className="w-[120px] font-semibold text-gray-900">
                  Gambar
                </TableHead>
                <TableHead className="font-semibold text-gray-900">
                  Nama Produk
                </TableHead>
                <TableHead className="font-semibold text-gray-900">
                  Kategori
                </TableHead>
                <TableHead className="font-semibold text-gray-900">
                  Deskripsi
                </TableHead>
                <TableHead className="font-semibold text-gray-900">
                  Harga
                </TableHead>
                <TableHead className="font-semibold text-gray-900">
                  Stok
                </TableHead>
                <TableHead className="text-right font-semibold text-gray-900">
                  Aksi
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow
                  key={product.id}
                  className="hover:bg-blue-50 transition-colors duration-200 border-b border-gray-100"
                >
                  <TableCell>
                    <div className="relative w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl overflow-hidden">
                      {product.image_url ? (
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-200"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <ShoppingCart className="h-8 w-8 text-blue-300" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-gray-900">
                      {product.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      ID: {product.id.slice(0, 8)}...
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <Tag className="h-3 w-3" />
                      {product.category || "Lainnya"}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="truncate text-gray-600">
                      {product.description || "Tidak ada deskripsi"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-bold text-blue-600">
                      {formatPrice(product.price)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${product.stock === 0
                            ? "bg-red-100 text-red-800"
                            : product.stock < 10
                              ? "bg-orange-100 text-orange-800"
                              : "bg-green-100 text-green-800"
                          }`}
                      >
                        {product.stock === 0
                          ? "Habis"
                          : product.stock < 10
                            ? "Terbatas"
                            : "Tersedia"}
                      </span>
                      <span className="text-sm text-gray-600">
                        {product.stock} pcs
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/edit/${product.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-blue-200 hover:border-blue-400 hover:bg-blue-50 text-blue-600"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeleteId(product.id)}
                        className="border-red-200 hover:border-red-400 hover:bg-red-50 text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="h-6 w-6 text-red-600" />
            </div>
            <AlertDialogTitle className="text-center text-lg">
              Hapus Produk?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Tindakan ini tidak dapat dibatalkan. Produk akan dihapus secara
              permanen dari database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="w-full sm:w-auto">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="w-full sm:w-auto bg-red-500 hover:bg-red-600"
            >
              Hapus Produk
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
