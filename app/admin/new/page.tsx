import { ProductForm } from "@/components/admin/product-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NewProductPage() {
  return (
    <div className="container-supermarket py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin/dashboard">
            <Button
              variant="outline"
              className="border-blue-200 hover:border-blue-400 hover:bg-blue-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Tambah Produk Baru
            </h1>
            <p className="text-gray-600">
              Tambahkan produk baru ke katalog Toserba WS Pedak
            </p>
          </div>
        </div>
        <ProductForm />
      </div>
    </div>
  );
}
