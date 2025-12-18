"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Tag, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import Link from "next/link";

interface Category {
    id: string;
    name: string;
    description: string | null;
    created_at: string;
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [newName, setNewName] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);

    const fetchCategories = async () => {
        const { data, error } = await supabase
            .from("categories")
            .select("*")
            .order("name", { ascending: true });

        if (error) {
            toast.error("Gagal memuat kategori");
            console.error(error);
        } else {
            setCategories(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleAdd = async () => {
        if (!newName.trim()) {
            toast.error("Nama kategori harus diisi");
            return;
        }

        const { error } = await supabase.from("categories").insert([
            {
                name: newName.trim(),
                description: newDescription.trim() || null,
            },
        ]);

        if (error) {
            if (error.code === "23505") {
                toast.error("Kategori dengan nama ini sudah ada");
            } else {
                toast.error("Gagal menambah kategori");
            }
            console.error(error);
        } else {
            toast.success("Kategori berhasil ditambahkan");
            setNewName("");
            setNewDescription("");
            setIsAdding(false);
            fetchCategories();
        }
    };

    const handleUpdate = async () => {
        if (!editingId || !editName.trim()) {
            toast.error("Nama kategori harus diisi");
            return;
        }

        const { error } = await supabase
            .from("categories")
            .update({
                name: editName.trim(),
                description: editDescription.trim() || null,
            })
            .eq("id", editingId);

        if (error) {
            if (error.code === "23505") {
                toast.error("Kategori dengan nama ini sudah ada");
            } else {
                toast.error("Gagal memperbarui kategori");
            }
            console.error(error);
        } else {
            toast.success("Kategori berhasil diperbarui");
            setEditingId(null);
            fetchCategories();
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;

        // Check if any products use this category
        const categoryToDelete = categories.find((c) => c.id === deleteId);
        if (categoryToDelete) {
            const { data: products } = await supabase
                .from("products")
                .select("id")
                .eq("category", categoryToDelete.name)
                .limit(1);

            if (products && products.length > 0) {
                toast.error("Tidak bisa menghapus kategori yang masih digunakan produk");
                setDeleteId(null);
                return;
            }
        }

        const { error } = await supabase.from("categories").delete().eq("id", deleteId);

        if (error) {
            toast.error("Gagal menghapus kategori");
            console.error(error);
        } else {
            toast.success("Kategori berhasil dihapus");
            fetchCategories();
        }
        setDeleteId(null);
    };

    const startEdit = (category: Category) => {
        setEditingId(category.id);
        setEditName(category.name);
        setEditDescription(category.description || "");
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Manajemen Kategori</h1>
                    <p className="text-gray-600">Kelola kategori produk toko Anda</p>
                </div>
                <div className="flex gap-2">
                    <Link href="/admin/dashboard">
                        <Button variant="outline">Kembali</Button>
                    </Link>
                    <Button onClick={() => setIsAdding(true)} className="btn-primary">
                        <Plus className="h-4 w-4 mr-2" />
                        Tambah Kategori
                    </Button>
                </div>
            </div>

            {/* Add New Category Form */}
            {isAdding && (
                <Card className="card-modern border-blue-200 bg-blue-50/50">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Tag className="h-5 w-5 text-blue-600" />
                            Tambah Kategori Baru
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                placeholder="Nama kategori"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                className="input-modern"
                            />
                            <Input
                                placeholder="Deskripsi (opsional)"
                                value={newDescription}
                                onChange={(e) => setNewDescription(e.target.value)}
                                className="input-modern"
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={handleAdd} className="btn-primary">
                                <Save className="h-4 w-4 mr-2" />
                                Simpan
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setIsAdding(false);
                                    setNewName("");
                                    setNewDescription("");
                                }}
                            >
                                <X className="h-4 w-4 mr-2" />
                                Batal
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Categories Table */}
            <Card className="card-modern">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50">
                                    <TableHead className="font-semibold">Nama Kategori</TableHead>
                                    <TableHead className="font-semibold">Deskripsi</TableHead>
                                    <TableHead className="text-right font-semibold">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {categories.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                                            Belum ada kategori
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    categories.map((category) => (
                                        <TableRow key={category.id} className="hover:bg-blue-50/50">
                                            <TableCell>
                                                {editingId === category.id ? (
                                                    <Input
                                                        value={editName}
                                                        onChange={(e) => setEditName(e.target.value)}
                                                        className="input-modern max-w-xs"
                                                    />
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <Tag className="h-4 w-4 text-blue-500" />
                                                        <span className="font-medium">{category.name}</span>
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {editingId === category.id ? (
                                                    <Input
                                                        value={editDescription}
                                                        onChange={(e) => setEditDescription(e.target.value)}
                                                        className="input-modern max-w-md"
                                                        placeholder="Deskripsi (opsional)"
                                                    />
                                                ) : (
                                                    <span className="text-gray-600">
                                                        {category.description || "-"}
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {editingId === category.id ? (
                                                    <div className="flex justify-end gap-2">
                                                        <Button size="sm" onClick={handleUpdate} className="btn-primary">
                                                            <Save className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => setEditingId(null)}
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => startEdit(category)}
                                                            className="border-blue-200 hover:bg-blue-50 text-blue-600"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => setDeleteId(category.id)}
                                                            className="border-red-200 hover:bg-red-50 text-red-600"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Kategori?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Kategori yang masih digunakan oleh produk tidak dapat dihapus.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-500 hover:bg-red-600"
                        >
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
