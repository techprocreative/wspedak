"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error("Application error:", error);
    }, [error]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center">
                <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="h-10 w-10 text-red-500" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Terjadi Kesalahan
                </h1>
                <p className="text-gray-600 mb-6">
                    Maaf, terjadi kesalahan saat memuat halaman. Silakan coba lagi atau kembali ke beranda.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button onClick={reset} className="btn-primary">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Coba Lagi
                    </Button>
                    <Link href="/">
                        <Button variant="outline" className="w-full sm:w-auto">
                            <Home className="h-4 w-4 mr-2" />
                            Ke Beranda
                        </Button>
                    </Link>
                </div>
                {error.digest && (
                    <p className="text-xs text-gray-400 mt-4">
                        Error ID: {error.digest}
                    </p>
                )}
            </div>
        </div>
    );
}
