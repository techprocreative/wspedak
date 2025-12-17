"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  Truck,
  Shield,
  CheckCircle,
  Store,
  Loader2,
} from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6281239602221";

export default function CheckoutPage() {
  const { items, updateQuantity, removeItem, clearCart, getTotalPrice } =
    useCartStore();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price * 1000);
  };

  const handleCheckout = async () => {
    if (!name.trim() || !address.trim()) {
      toast.error("Mohon lengkapi nama dan alamat pengiriman");
      return;
    }

    if (items.length === 0) {
      toast.error("Keranjang belanja kosong");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Save order to database
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          customer_name: name.trim(),
          customer_address: address.trim(),
          customer_phone: phone.trim() || null,
          total_amount: getTotalPrice(),
          status: "pending",
          whatsapp_sent: true,
        })
        .select()
        .single();

      if (orderError) {
        console.error("Order error:", orderError);
        throw new Error("Gagal menyimpan pesanan");
      }

      // 2. Save order items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.productId,
        product_name: item.name,
        quantity: item.quantity,
        price: item.price,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) {
        console.error("Order items error:", itemsError);
        // Order was saved, but items failed - don't block WhatsApp
      }

      // 3. Build WhatsApp message with order ID
      let message = `Halo, saya ingin memesan:\n\n`;
      message += `📋 *Order ID: ${order.id.slice(0, 8).toUpperCase()}*\n\n`;

      items.forEach((item, index) => {
        message += `${index + 1}. ${item.name}\n`;
        message += `   Jumlah: ${item.quantity}\n`;
        message += `   Harga: ${formatPrice(item.price)}\n`;
        message += `   Subtotal: ${formatPrice(item.price * item.quantity)}\n\n`;
      });

      message += `*Total: ${formatPrice(getTotalPrice())}*\n\n`;
      message += `👤 Nama: ${name}\n`;
      message += `📍 Alamat: ${address}`;
      if (phone) {
        message += `\n📱 Telepon: ${phone}`;
      }

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

      toast.success("Pesanan berhasil disimpan!");

      // 4. Open WhatsApp and clear cart
      window.open(whatsappUrl, "_blank");
      clearCart();
      setName("");
      setAddress("");
      setPhone("");
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Terjadi kesalahan saat memproses pesanan");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="container-supermarket py-8">
          <Link href="/">
            <Button
              variant="ghost"
              className="mb-6 text-blue-600 hover:text-blue-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali Belanja
            </Button>
          </Link>
          <Card className="max-w-md mx-auto card-modern">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                <Store className="h-10 w-10 text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Keranjang Kosong
              </h2>
              <p className="text-gray-600 text-center mb-6 max-w-sm">
                Anda belum menambahkan produk ke keranjang. Yuk, mulai belanja
                di Toserba WS Pedak sekarang!
              </p>
              <Link href="/">
                <Button className="btn-primary">Mulai Belanja</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="container-supermarket py-8">
        <Link href="/">
          <Button
            variant="ghost"
            className="mb-6 text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Lanjut Belanja
          </Button>
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="card-modern">
              <CardHeader className="card-header-modern">
                <CardTitle className="text-xl text-gray-900 flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-blue-600" />
                  Keranjang Belanja Toserba WS Pedak ({items.length} item)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex gap-4 p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors duration-200"
                  >
                    <div className="relative w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl overflow-hidden flex-shrink-0">
                      {item.image_url ? (
                        <Image
                          src={item.image_url}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <ShoppingCart className="h-10 w-10 text-blue-300" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900">
                        {item.name}
                      </h3>
                      <p className="text-blue-600 font-bold text-lg">
                        {formatPrice(item.price)}
                      </p>
                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex items-center bg-white rounded-lg border border-gray-200">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-l-lg hover:bg-blue-50"
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity - 1)
                            }
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-12 text-center font-semibold">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-r-lg hover:bg-blue-50"
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity + 1)
                            }
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => removeItem(item.productId)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-xl text-gray-900">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="card-modern sticky top-24">
              <CardHeader className="card-header-modern">
                <CardTitle className="text-xl text-gray-900">
                  Detail Pesanan
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-gray-700 font-medium">
                      Nama Lengkap
                    </Label>
                    <Input
                      id="name"
                      placeholder="Masukkan nama Anda"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input-modern"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="address"
                      className="text-gray-700 font-medium"
                    >
                      Alamat Pengiriman
                    </Label>
                    <Textarea
                      id="address"
                      placeholder="Masukkan alamat lengkap"
                      rows={4}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="input-modern resize-none"
                    />
                  </div>
                </div>

                <div className="space-y-3 p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-center gap-2 text-blue-700">
                    <Truck className="h-4 w-4" />
                    <span className="text-sm font-medium">Gratis Ongkir</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-700">
                    <Shield className="h-4 w-4" />
                    <span className="text-sm font-medium">100% Original</span>
                  </div>
                </div>

                <Separator />
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-medium">
                      {formatPrice(getTotalPrice())}
                    </span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Diskon</span>
                    <span className="font-medium">Rp 0</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t">
                    <span>Total</span>
                    <span className="text-blue-600">
                      {formatPrice(getTotalPrice())}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Button
                  onClick={handleCheckout}
                  className="w-full btn-primary text-lg py-4"
                  size="lg"
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Pesan via WhatsApp
                </Button>

                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-500">
                    Terima kasih telah berbelanja di Toserba WS Pedak
                  </p>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
