"use client";

import { useState, useEffect } from "react";
import { Image as ImageIcon, ArrowLeft, Plus, Trash2, GripVertical, Eye, EyeOff, Save, Loader2, Pencil, Camera, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";

interface Banner {
    id: string;
    title: string;
    image_url: string;
    link_url: string | null;
    is_active: boolean;
    order_index: number;
}

export default function BannersPage() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [newBanner, setNewBanner] = useState({ title: "", image_url: "", link_url: "" });
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Image Upload State
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        fetchBanners();
    }, []);

    async function fetchBanners() {
        try {
            const { data, error } = await supabase
                .from("banners")
                .select("*")
                .order("order_index", { ascending: true });

            if (error) throw error;
            setBanners(data || []);
        } catch (error) {
            console.error(error);
            toast.error("Gagal memuat banner");
        }
        setLoading(false);
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Ukuran gambar maksimal 5MB");
                return;
            }
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

            const { error: uploadError, data } = await supabase.storage
                .from("banners")
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data: publicUrlData } = supabase.storage
                .from("banners")
                .getPublicUrl(filePath);

            return publicUrlData.publicUrl;
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Gagal mengupload gambar");
            return null;
        }
    };

    async function handleSaveBanner() {
        if (!newBanner.title) {
            toast.error("Judul wajib diisi");
            return;
        }

        if (!imageFile && !newBanner.image_url) {
            toast.error("Gambar wajib diisi");
            return;
        }

        setSaving(true);
        try {
            let finalImageUrl = newBanner.image_url;

            if (imageFile) {
                const uploadedUrl = await uploadImage(imageFile);
                if (!uploadedUrl) {
                    setSaving(false);
                    return;
                }
                finalImageUrl = uploadedUrl;
            }

            if (editingId) {
                // Update existing banner
                const { error } = await supabase
                    .from("banners")
                    .update({
                        title: newBanner.title,
                        image_url: finalImageUrl,
                        link_url: newBanner.link_url || null,
                    })
                    .eq("id", editingId);

                if (error) throw error;
                toast.success("Banner berhasil diperbarui");
            } else {
                // Create new banner
                const { error } = await supabase.from("banners").insert({
                    title: newBanner.title,
                    image_url: finalImageUrl,
                    link_url: newBanner.link_url || null,
                    is_active: true,
                    order_index: banners.length,
                });

                if (error) throw error;
                toast.success("Banner berhasil ditambahkan");
            }

            handleCancel();
            fetchBanners();
        } catch (error) {
            console.error(error);
            toast.error(editingId ? "Gagal memperbarui banner" : "Gagal menambahkan banner");
        }
        setSaving(false);
    }

    function handleEdit(banner: Banner) {
        setNewBanner({
            title: banner.title,
            image_url: banner.image_url,
            link_url: banner.link_url || "",
        });
        setImagePreview(banner.image_url);
        setImageFile(null);
        setEditingId(banner.id);
        setShowAddForm(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function handleCancel() {
        setNewBanner({ title: "", image_url: "", link_url: "" });
        setImageFile(null);
        setImagePreview(null);
        setShowAddForm(false);
        setEditingId(null);
    }

    async function handleToggleActive(id: string, currentState: boolean) {
        try {
            const { error } = await supabase
                .from("banners")
                .update({ is_active: !currentState })
                .eq("id", id);

            if (error) throw error;
            toast.success(currentState ? "Banner dinonaktifkan" : "Banner diaktifkan");
            fetchBanners();
        } catch (error) {
            console.error(error);
            toast.error("Gagal mengubah status banner");
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Yakin ingin menghapus banner ini?")) return;

        try {
            const { error } = await supabase.from("banners").delete().eq("id", id);

            if (error) throw error;
            toast.success("Banner berhasil dihapus");
            fetchBanners();
        } catch (error) {
            console.error(error);
            toast.error("Gagal menghapus banner");
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/dashboard">
                        <Button variant="outline">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Kembali
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Kelola Banner</h1>
                        <p className="text-gray-600">Atur banner promo untuk carousel di landing page</p>
                    </div>
                </div>
                <Button
                    onClick={() => {
                        handleCancel();
                        setShowAddForm(!showAddForm);
                    }}
                    className="btn-primary"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Banner
                </Button>
            </div>

            {/* Add/Edit Banner Form */}
            {showAddForm && (
                <Card className="card-modern border-blue-200 bg-blue-50/50">
                    <CardHeader>
                        <CardTitle className="text-lg">
                            {editingId ? "Edit Banner" : "Tambah Banner Baru"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Image Upload Area */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-2">Gambar Banner</label>
                            <div className="flex flex-col items-center">
                                <div className="relative group w-full max-w-xl">
                                    <label
                                        htmlFor="banner-upload"
                                        className="block w-full cursor-pointer"
                                    >
                                        {imagePreview ? (
                                            <div className="relative w-full aspect-[3/1] rounded-xl overflow-hidden border-2 border-blue-200 shadow-md">
                                                <Image
                                                    src={imagePreview}
                                                    alt="Banner preview"
                                                    fill
                                                    className="object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                                                    <div className="bg-white/90 text-gray-800 px-4 py-2 rounded-full font-medium flex items-center gap-2 shadow-lg">
                                                        <Camera className="h-4 w-4" />
                                                        Ganti Gambar
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="w-full aspect-[3/1] border-2 border-dashed border-blue-300 rounded-xl flex flex-col items-center justify-center bg-blue-50/50 hover:bg-blue-50 transition-colors group">
                                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                                    <Camera className="h-6 w-6 text-blue-500" />
                                                </div>
                                                <p className="text-sm font-medium text-blue-700">
                                                    Klik untuk upload gambar
                                                </p>
                                                <p className="text-xs text-blue-500 mt-1">
                                                    Rekomendasi: 1200x400 px (Max 5MB)
                                                </p>
                                            </div>
                                        )}
                                    </label>
                                    <Input
                                        id="banner-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="sr-only"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700">Judul Banner</label>
                                <Input
                                    placeholder="Contoh: Promo Akhir Tahun"
                                    value={newBanner.title}
                                    onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
                                    className="mt-1"
                                />
                            </div>

                            {/* Optional: Manual URL input if needed, hidden if file selected but kept for flexibility */}
                            {!imageFile && !imagePreview && (
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Atau URL Gambar Eksternal</label>
                                    <Input
                                        placeholder="https://example.com/banner.jpg"
                                        value={newBanner.image_url}
                                        onChange={(e) => setNewBanner({ ...newBanner, image_url: e.target.value })}
                                        className="mt-1"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="text-sm font-medium text-gray-700">Link Tujuan (opsional)</label>
                                <Input
                                    placeholder="/products atau /products?category=Sembako"
                                    value={newBanner.link_url}
                                    onChange={(e) => setNewBanner({ ...newBanner, link_url: e.target.value })}
                                    className="mt-1"
                                />
                            </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                            <Button onClick={handleSaveBanner} disabled={saving} className="btn-primary">
                                {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                                {editingId ? "Simpan Perubahan" : "Simpan Banner"}
                            </Button>
                            <Button variant="outline" onClick={handleCancel}>
                                Batal
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Banner List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="text-center py-16">
                        <ImageIcon className="h-8 w-8 text-blue-500 animate-pulse mx-auto mb-2" />
                        <p className="text-gray-600">Memuat banner...</p>
                    </div>
                ) : banners.length === 0 ? (
                    <Card className="card-modern">
                        <CardContent className="text-center py-16">
                            <ImageIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum Ada Banner</h3>
                            <p className="text-gray-500 mb-4">Tambahkan banner untuk ditampilkan di carousel</p>
                            <Button onClick={() => setShowAddForm(true)} className="btn-primary">
                                <Plus className="h-4 w-4 mr-2" />
                                Tambah Banner Pertama
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    banners.map((banner, index) => (
                        <Card key={banner.id} className={`card-modern ${!banner.is_active ? "opacity-60" : ""}`}>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-4">
                                    {/* Drag Handle */}
                                    <div className="text-gray-400 cursor-grab">
                                        <GripVertical className="h-5 w-5" />
                                    </div>

                                    {/* Order Number */}
                                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm">
                                        {index + 1}
                                    </div>

                                    {/* Banner Preview */}
                                    <div className="relative w-32 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                                        <Image
                                            src={banner.image_url}
                                            alt={banner.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    {/* Banner Info */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-900 truncate">{banner.title}</h3>
                                        <p className="text-sm text-gray-500 truncate">
                                            {banner.link_url || "Tidak ada link"}
                                        </p>
                                    </div>

                                    {/* Status Badge */}
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${banner.is_active
                                                ? "bg-green-100 text-green-700"
                                                : "bg-gray-100 text-gray-600"
                                            }`}
                                    >
                                        {banner.is_active ? "Aktif" : "Nonaktif"}
                                    </span>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleEdit(banner)}
                                            className="text-blue-600 hover:text-blue-700 hover:border-blue-300"
                                            title="Edit Banner"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleToggleActive(banner.id, banner.is_active)}
                                            title={banner.is_active ? "Nonaktifkan" : "Aktifkan"}
                                        >
                                            {banner.is_active ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDelete(banner.id)}
                                            className="text-red-600 hover:text-red-700 hover:border-red-300"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Tips */}
            <Card className="card-modern bg-amber-50 border-amber-200">
                <CardContent className="p-4">
                    <h3 className="font-semibold text-amber-800 mb-2">💡 Tips</h3>
                    <ul className="text-sm text-amber-700 space-y-1">
                        <li>• Gunakan gambar dengan ukuran 1200x400 pixels untuk hasil terbaik</li>
                        <li>• Banner aktif akan ditampilkan secara bergantian setiap 5 detik</li>
                        <li>• Maksimal 5 banner aktif disarankan agar tidak terlalu banyak</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}
