"use client";

import Link from "next/link";
import { Store, Phone, Mail, MapPin, Clock } from "lucide-react";

const STORE_PHONE = process.env.NEXT_PUBLIC_STORE_PHONE || "6281239602221";
const STORE_EMAIL = process.env.NEXT_PUBLIC_STORE_EMAIL || "nedhms@gmail.com";

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-white">
            {/* Main Footer */}
            <div className="container-supermarket py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                                <Store className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Toserba WS Pedak</h3>
                                <p className="text-gray-400 text-sm">Murah • Lengkap • Luas</p>
                            </div>
                        </div>
                        <p className="text-gray-400 text-sm">
                            Belanja praktis dan hemat untuk semua kebutuhan Anda, kapan saja.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-lg">Menu</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                                    Beranda
                                </Link>
                            </li>
                            <li>
                                <Link href="/products" className="text-gray-400 hover:text-white transition-colors">
                                    Produk
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                                    Tentang Kami
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                                    Hubungi Kami
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-lg">Kontak</h4>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3 text-gray-400">
                                <Phone className="h-4 w-4 text-blue-400" />
                                <span>{STORE_PHONE}</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-400">
                                <Mail className="h-4 w-4 text-blue-400" />
                                <span>{STORE_EMAIL}</span>
                            </li>
                            <li className="flex items-start gap-3 text-gray-400">
                                <MapPin className="h-4 w-4 text-blue-400 mt-1" />
                                <span className="text-sm">
                                    Kaliurang St No.KM.11, Pedak, Sinduharjo, Ngaglik, Sleman, DIY 55581
                                </span>
                            </li>
                        </ul>
                    </div>

                    {/* Hours */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-lg">Jam Buka</h4>
                        <div className="flex items-start gap-3 text-gray-400">
                            <Clock className="h-4 w-4 text-blue-400 mt-1" />
                            <div>
                                <p>Setiap Hari</p>
                                <p className="font-semibold text-white">08:00 - 21:30</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Footer */}
            <div className="border-t border-gray-800">
                <div className="container-supermarket py-6">
                    <p className="text-center text-gray-400 text-sm">
                        © {currentYear} Toserba WS Pedak. Murah • Lengkap • Luas
                    </p>
                </div>
            </div>
        </footer>
    );
}
