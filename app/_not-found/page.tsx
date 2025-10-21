import Link from "next/link";
import { Home, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full card-modern">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
            <Search className="h-12 w-12 text-blue-600" />
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Halaman Tidak Ditemukan
          </h2>

          <p className="text-gray-600 mb-8 max-w-sm">
            Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
            Yuk, kembali ke beranda Toserba WS Pedak!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <Link href="/" className="flex-1">
              <Button className="w-full btn-primary">
                <Home className="h-4 w-4 mr-2" />
                Kembali ke Beranda
              </Button>
            </Link>

            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="flex-1"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Toserba WS Pedak - Murah • Lengkap • Luas
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
