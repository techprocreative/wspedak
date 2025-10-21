import { createServerClient } from "@/lib/supabase/server";
import { ProductForm } from "@/components/admin/product-form";
import { Product } from "@/lib/types/product";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createServerClient();

  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !product) {
    notFound();
  }

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
            <h1 className="text-2xl font-bold text-gray-900">Edit Produk</h1>
            <p className="text-gray-600">
              Perbarui informasi produk &quot;{product.name}&quot;
            </p>
          </div>
        </div>
        <ProductForm product={product as Product} isEdit={true} />
      </div>
    </div>
  );
}
