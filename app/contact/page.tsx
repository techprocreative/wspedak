"use client";

import { Navbar } from "@/components/navbar";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const STORE_PHONE = process.env.NEXT_PUBLIC_STORE_PHONE || "6281239602221";
const STORE_EMAIL = process.env.NEXT_PUBLIC_STORE_EMAIL || "nedhms@gmail.com";
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6281239602221";

export default function ContactPage() {
    const handleWhatsApp = () => {
        const message = encodeURIComponent("Halo, saya ingin bertanya tentang produk di Toserba WS Pedak");
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
            <Navbar />

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 to-blue-500 py-12">
                <div className="container-supermarket">
                    <div className="text-center text-white">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Phone className="h-8 w-8 text-white" />
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-bold mb-4">
                            Hubungi Kami
                        </h1>
                        <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                            Ada pertanyaan atau butuh bantuan? Tim Toserba WS Pedak siap membantu Anda.
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Cards */}
            <section className="section-spacing">
                <div className="container-supermarket">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        {/* WhatsApp */}
                        <Card className="card-modern">
                            <CardHeader className="text-center">
                                <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <MessageCircle className="h-7 w-7 text-green-600" />
                                </div>
                                <CardTitle className="text-xl">WhatsApp</CardTitle>
                                <CardDescription>Respon tercepat via chat</CardDescription>
                            </CardHeader>
                            <CardContent className="text-center">
                                <p className="text-lg font-semibold text-gray-900 mb-4">
                                    +62 812-3960-2221
                                </p>
                                <Button onClick={handleWhatsApp} className="btn-primary w-full">
                                    <MessageCircle className="h-4 w-4 mr-2" />
                                    Chat Sekarang
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Phone */}
                        <Card className="card-modern">
                            <CardHeader className="text-center">
                                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <Phone className="h-7 w-7 text-blue-600" />
                                </div>
                                <CardTitle className="text-xl">Telepon</CardTitle>
                                <CardDescription>Hubungi langsung</CardDescription>
                            </CardHeader>
                            <CardContent className="text-center">
                                <p className="text-lg font-semibold text-gray-900 mb-4">
                                    {STORE_PHONE}
                                </p>
                                <Button
                                    variant="outline"
                                    className="w-full border-blue-200 hover:border-blue-400"
                                    onClick={() => window.open(`tel:${STORE_PHONE}`)}
                                >
                                    <Phone className="h-4 w-4 mr-2" />
                                    Hubungi
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Email */}
                        <Card className="card-modern">
                            <CardHeader className="text-center">
                                <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <Mail className="h-7 w-7 text-purple-600" />
                                </div>
                                <CardTitle className="text-xl">Email</CardTitle>
                                <CardDescription>Untuk pertanyaan detail</CardDescription>
                            </CardHeader>
                            <CardContent className="text-center">
                                <p className="text-lg font-semibold text-gray-900 mb-4">
                                    {STORE_EMAIL}
                                </p>
                                <Button
                                    variant="outline"
                                    className="w-full border-purple-200 hover:border-purple-400"
                                    onClick={() => window.open(`mailto:${STORE_EMAIL}`)}
                                >
                                    <Mail className="h-4 w-4 mr-2" />
                                    Kirim Email
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Store Info */}
                    <div className="grid lg:grid-cols-2 gap-8">
                        <Card className="card-modern">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5 text-blue-600" />
                                    Lokasi Toko
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 leading-relaxed">
                                    <strong>Toserba WS Pedak</strong><br />
                                    Jl. Raya Pedak<br />
                                    Pedak, Indonesia
                                </p>
                                <p className="text-sm text-gray-500 mt-4">
                                    Toko kami mudah dijangkau dan terletak di lokasi strategis di kawasan Pedak.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="card-modern">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-blue-600" />
                                    Jam Operasional
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Senin - Sabtu</span>
                                        <span className="font-semibold">07:00 - 21:00</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Minggu</span>
                                        <span className="font-semibold">08:00 - 20:00</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Hari Libur Nasional</span>
                                        <span className="font-semibold text-orange-600">Buka Terbatas</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-8">
                <div className="container-supermarket text-center">
                    <p className="text-gray-400">
                        © 2024 Toserba WS Pedak. Murah • Lengkap • Luas
                    </p>
                </div>
            </footer>
        </div>
    );
}
