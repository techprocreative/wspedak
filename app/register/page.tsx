"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Store, UserPlus, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import Image from "next/image";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Password tidak cocok");
      return;
    }

    if (password.length < 6) {
      toast.error("Password minimal 6 karakter");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
          data: {
            is_admin: true,
          },
        },
      });

      if (error) {
        toast.error("Registrasi gagal: " + error.message);
        setLoading(false);
        return;
      }

      toast.success("Registrasi berhasil! Akun admin Anda telah dibuat.");
      router.push("/login");
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error?.message || "Terjadi kesalahan, silakan coba lagi");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md card-modern">
        <CardHeader className="space-y-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="relative w-16 h-16">
              <Image
                src="/logo-ws.jpeg"
                alt="Toserba WS Pedak"
                fill
                className="object-contain rounded-lg"
              />
            </div>
          </div>
          <CardTitle className="text-2xl text-center text-gray-900">
            Admin Registration
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            Buat akun admin untuk Toserba WS Pedak
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleRegister}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">
                Email Admin
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@toserbawspedak.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-modern"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimal 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input-modern pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-gray-700 font-medium"
              >
                Konfirmasi Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Ulangi password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="input-modern pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-sm text-green-700">
                💡 <strong>Info:</strong> Akun admin Anda akan langsung aktif
                dan dapat digunakan untuk login.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Mendaftar...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Buat Akun Admin
                </>
              )}
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Sudah punya akun?{" "}
                <a
                  href="/login"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Login di sini
                </a>
              </p>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-500">
                Toserba WS Pedak - Murah Lengkap Luas
              </p>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
