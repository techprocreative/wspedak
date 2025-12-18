"use client";

import { useState, useEffect } from "react";
import { Image as ImageIcon, ArrowLeft, Plus, Trash2, GripVertical, Eye, EyeOff, Save, Loader2 } from "lucide-react";
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

    async function handleAddBanner() {
        if (!newBanner.title || !newBanner.image_url) {
            toast.error("Judul dan URL gambar wajib diisi");
            return;
        }

        setSaving(true);
        try {
            const { error } = await supabase.from("banners").insert({
                title: newBanner.title,
                image_url: newBanner.image_url,
                link_url: newBanner.link_url || null,
                is_active: true,
                order_index: banners.length,
            });

            if (error) throw error;
            toast.success("Banner berhasil ditambahkan");
            setNewBanner({ title: "", image_url: "", link_url: "" });
            setShowAddForm(false);
            fetchBanners();
        } catch (error) {
            console.error(error);
            toast.error("Gagal menambahkan banner");
        }
        setSaving(false);
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
                <Button onClick={() => setShowAddForm(!showAddForm)} className="btn-primary">
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Banner
                </Button>
            </div>

            {/* Add Banner Form */}
            {showAddForm && (
                <Card className="card-modern border-blue-200 bg-blue-50/50">
                    <CardHeader>
                        <CardTitle className="text-lg">Tambah Banner Baru</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700">Judul Banner</label>
                            <Input
                                placeholder="Contoh: Promo Akhir Tahun"
                                value={newBanner.title}
                                onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">URL Gambar</label>
                            <Input
                                placeholder="https://example.com/banner.jpg"
                                value={newBanner.image_url}
                                onChange={(e) => setNewBanner({ ...newBanner, image_url: e.target.value })}
                                className="mt-1"
                            />
                            <p className="text-xs text-gray-500 mt-1">Ukuran rekomendasi: 1200x400 pixels (rasio 3:1)</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Link Tujuan (opsional)</label>
                            <Input
                                placeholder="/products atau /products?category=Sembako"
                                value={newBanner.link_url}
                                onChange={(e) => setNewBanner({ ...newBanner, link_url: e.target.value })}
                                className="mt-1"
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={handleAddBanner} disabled={saving} className="btn-primary">
                                {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                                Simpan
                            </Button>
                            <Button variant="outline" onClick={() => setShowAddForm(false)}>
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
                                    <div className="relative w-32 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
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
