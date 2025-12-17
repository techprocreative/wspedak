import Link from "next/link";
import { Home, ShoppingBag, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Search className="h-10 w-10 text-blue-500" />
                </div>
                <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                    Halaman Tidak Ditemukan
                </h2>
                <p className="text-gray-600 mb-8">
                    Maaf, halaman yang Anda cari tidak ditemukan. Mungkin halaman telah dipindahkan atau tidak ada.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link href="/">
                        <Button className="btn-primary w-full sm:w-auto">
                            <Home className="h-4 w-4 mr-2" />
                            Ke Beranda
                        </Button>
                    </Link>
                    <Link href="/products">
                        <Button variant="outline" className="w-full sm:w-auto">
                            <ShoppingBag className="h-4 w-4 mr-2" />
                            Lihat Produk
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
