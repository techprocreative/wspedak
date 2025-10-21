"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Store } from "lucide-react";
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

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error("Login gagal: " + error.message);
      setLoading(false);
      return;
    }

    toast.success("Login berhasil");
    router.push("/admin/dashboard");
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
            Admin Login
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            Masuk ke dashboard admin Toserba WS Pedak
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">
                Email
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
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-modern"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full btn-primary"
              disabled={loading}
            >
              {loading ? "Memproses..." : "Login"}
            </Button>
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
