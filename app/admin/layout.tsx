"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Store,
  LogOut,
  LayoutDashboard,
  Package,
  Settings,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
      } else {
        setLoading(false);
      }
    };

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      (async () => {
        if (!session) {
          router.push("/login");
        }
      })();
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Berhasil logout");
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Store className="h-8 w-8 text-white animate-pulse" />
          </div>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <nav className="navbar-modern bg-white/95 backdrop-blur-md border-b border-blue-100">
        <div className="container-supermarket">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="relative w-10 h-10 group-hover:scale-110 transition-transform duration-200">
                  <Image
                    src="/logo-ws.jpeg"
                    alt="Toserba WS Pedak"
                    fill
                    className="object-contain rounded-lg"
                  />
                </div>
                <div>
                  <span className="text-xl font-bold text-gray-900">
                    Toserba WS Pedak
                  </span>
                  <p className="text-xs text-blue-600 font-medium">
                    Admin Panel
                  </p>
                </div>
              </Link>

              <div className="hidden md:flex items-center gap-6">
                <Link href="/admin/dashboard">
                  <Button
                    variant="ghost"
                    className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium"
                  >
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Link href="/admin/new">
                  <Button
                    variant="ghost"
                    className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium"
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Tambah Produk
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    variant="ghost"
                    className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Tambah Admin
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Pengaturan
                </Button>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={handleLogout}
              className="border-red-200 hover:border-red-400 hover:bg-red-50 text-red-600 hover:text-red-700"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <main className="container-supermarket py-8">{children}</main>
    </div>
  );
}
