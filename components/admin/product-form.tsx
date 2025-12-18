"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Upload, Package, Camera, X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase/client";
import { Product } from "@/lib/types/product";
import { toast } from "sonner";

const PRODUCT_CATEGORIES = [
  "Sembako",
  "Minuman",
  "Makanan Ringan",
  "Peralatan Rumah Tangga",
  "Kosmetik & Perawatan",
  "Lainnya",
];

interface ProductFormProps {
  product?: Product;
  isEdit?: boolean;
}

export function ProductForm({ product, isEdit = false }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price?.toString() || "",
    stock: product?.stock?.toString() || "",
    category: product?.category || "Lainnya",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    product?.image_url || null,
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      console.log("Uploading file:", filePath);

      const { error: uploadError, data } = await supabase.storage
        .from("product_images")
        .upload(filePath, file);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        toast.error(`Upload gagal: ${uploadError.message}`);
        return null;
      }

      console.log("Upload successful:", data);

      const { data: publicUrlData } = supabase.storage
        .from("product_images")
        .getPublicUrl(filePath);

      console.log("Public URL:", publicUrlData.publicUrl);
      return publicUrlData.publicUrl;
    } catch (error) {
      console.error("Unexpected upload error:", error);
      toast.error("Terjadi kesalahan saat upload gambar");
      return null;
    }
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      toast.error("Nama produk harus diisi");
      return false;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error("Harga produk harus lebih dari 0");
      return false;
    }

    if (!formData.stock || parseInt(formData.stock) < 0) {
      toast.error("Stok produk tidak bisa negatif");
      return false;
    }

    if (imageFile && imageFile.size > 5 * 1024 * 1024) {
      toast.error("Ukuran gambar maksimal 5MB");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      let imageUrl = product?.image_url || null;

      if (imageFile) {
        toast.info("Sedang mengupload gambar...");
        const uploadedUrl = await uploadImage(imageFile);
        if (!uploadedUrl) {
          setLoading(false);
          return;
        }
        imageUrl = uploadedUrl;
        toast.success("Gambar berhasil diupload");
      }

      const productData = {
        name: formData.name.trim(),
        description: formData.description?.trim() || null,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        image_url: imageUrl,
        category: formData.category,
      };

      if (isEdit && product) {
        console.log("Updating product:", product.id, productData);
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", product.id);

        if (error) {
          console.error("Update error:", error);
          toast.error(`Gagal memperbarui produk: ${error.message}`);
          throw error;
        }
        toast.success("Produk berhasil diperbarui");
      } else {
        console.log("Creating product:", productData);
        const { error } = await supabase.from("products").insert([productData]);

        if (error) {
          console.error("Insert error:", error);
          toast.error(`Gagal menambah produk: ${error.message}`);
          throw error;
        }
        toast.success("Produk berhasil ditambahkan");
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Terjadi kesalahan, silakan coba lagi");
      setLoading(false);
    }
  };

  return (
    <Card className="card-modern max-w-2xl mx-auto">
      <CardHeader className="card-header-modern text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Package className="h-8 w-8 text-white" />
        </div>
        <CardTitle className="text-2xl text-gray-900">
          {isEdit ? "Edit Produk" : "Tambah Produk Baru"}
        </CardTitle>
        <p className="text-gray-600 mt-2">
          {isEdit
            ? "Perbarui informasi produk yang ada"
            : "Tambahkan produk baru ke katalog"}
        </p>
      </CardHeader>
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Image Upload */}
          <div className="space-y-4">
            <Label className="text-gray-700 font-medium">Gambar Produk</Label>
            <div className="flex flex-col items-center">
              <div className="relative group w-full max-w-sm">
                <label
                  htmlFor="image-upload"
                  className="block w-full cursor-pointer"
                >
                  {imagePreview ? (
                    <div className="relative w-48 h-48 mx-auto rounded-2xl overflow-hidden border-4 border-blue-100 shadow-lg">
                      <Image
                        src={imagePreview}
                        alt="Product preview"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setImageFile(null);
                            setImagePreview(null);
                          }}
                          className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="w-48 h-48 mx-auto border-4 border-dashed border-blue-300 rounded-2xl flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 transition-all duration-200 group">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200">
                        <Camera className="h-8 w-8 text-blue-500" />
                      </div>
                      <p className="text-sm font-medium text-blue-700">
                        Upload Gambar
                      </p>
                      <p className="text-xs text-blue-500 mt-1">
                        PNG, JPG, WebP (max. 5MB)
                      </p>
                    </div>
                  )}
                </label>
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="sr-only"
                />
                {imagePreview && (
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Klik gambar untuk mengganti
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Product Name */}
          <div className="space-y-3">
            <Label htmlFor="name" className="text-gray-700 font-medium">
              Nama Produk <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Masukkan nama produk"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              className="input-modern text-lg"
            />
          </div>

          {/* Description */}
          <div className="space-y-3">
            <Label htmlFor="description" className="text-gray-700 font-medium">
              Deskripsi Produk
            </Label>
            <Textarea
              id="description"
              placeholder="Jelaskan detail produk, manfaat, dan keunggulan..."
              rows={4}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="input-modern resize-none"
            />
          </div>

          {/* Category */}
          <div className="space-y-3">
            <Label htmlFor="category" className="text-gray-700 font-medium">
              Kategori Produk <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData({ ...formData, category: value })
              }
            >
              <SelectTrigger className="input-modern">
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                {PRODUCT_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price and Stock */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="price" className="text-gray-700 font-medium">
                Harga Produk <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                  Rp
                </span>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  required
                  className="input-modern pl-12 text-lg"
                />
              </div>
              {formData.price && parseFloat(formData.price) <= 0 && (
                <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                  ⚠️ Harga harus lebih dari 0
                </p>
              )}
              <p className="text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
                💡 <strong>Tip:</strong> Masukkan harga dalam ribuan (contoh:
                5.99 = Rp 5.990)
              </p>
            </div>

            <div className="space-y-3">
              <Label htmlFor="stock" className="text-gray-700 font-medium">
                Stok Produk <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: e.target.value })
                  }
                  required
                  className="input-modern text-lg"
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                  pcs
                </span>
              </div>
              {formData.stock && parseInt(formData.stock) < 0 && (
                <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                  ⚠️ Stok tidak bisa negatif
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6">
            <Button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 text-lg py-4"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Menyimpan...
                </>
              ) : isEdit ? (
                <>
                  <Package className="h-5 w-5 mr-2" />
                  Update Produk
                </>
              ) : (
                <>
                  <Package className="h-5 w-5 mr-2" />
                  Tambah Produk
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/dashboard")}
              className="px-8 py-4 border-gray-300 hover:border-gray-400 hover:bg-gray-50"
            >
              Batal
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
