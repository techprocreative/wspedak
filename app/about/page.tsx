import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Store, Users, Award, MapPin, Phone, Mail, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export const metadata = {
    title: "Tentang Kami - Toserba WS Pedak",
    description: "Tentang Toserba WS Pedak - Toko serba ada terlengkap di Pedak",
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            <Navbar />
            {/* Hero Section */}
            <section className="container-supermarket py-16 text-center">
                <div className="max-w-3xl mx-auto">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Store className="h-10 w-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Tentang Toserba WS Pedak
                    </h1>
                    <p className="text-xl text-gray-600">
                        Toko serba ada terpercaya untuk semua kebutuhan harian Anda
                    </p>
                </div>
            </section>

            {/* Story Section */}
            <section className="container-supermarket py-12">
                <div className="max-w-4xl mx-auto">
                    <Card className="card-modern overflow-hidden">
                        <CardContent className="p-8 md:p-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                Cerita Kami
                            </h2>
                            <div className="space-y-4 text-gray-600 leading-relaxed">
                                <p>
                                    Toserba WS Pedak hadir sebagai solusi belanja lengkap untuk masyarakat Pedak dan sekitarnya.
                                    Dengan komitmen menyediakan produk berkualitas dengan harga terjangkau, kami terus berkembang
                                    melayani kebutuhan pelanggan.
                                </p>
                                <p>
                                    Kami percaya bahwa belanja harus mudah, nyaman, dan menyenangkan. Itulah mengapa kami
                                    menghadirkan layanan pemesanan online dengan sistem WhatsApp yang praktis -
                                    cukup pilih produk, checkout, dan pesanan langsung terhubung ke WhatsApp kami.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Values Section */}
            <section className="container-supermarket py-12">
                <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
                    Mengapa Memilih Kami?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Card className="card-modern text-center">
                        <CardContent className="p-8">
                            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Award className="h-8 w-8 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Murah</h3>
                            <p className="text-gray-600">
                                Harga bersaing dengan kualitas terjamin untuk setiap produk
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="card-modern text-center">
                        <CardContent className="p-8">
                            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Store className="h-8 w-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Lengkap</h3>
                            <p className="text-gray-600">
                                Berbagai macam produk kebutuhan sehari-hari tersedia di satu tempat
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="card-modern text-center">
                        <CardContent className="p-8">
                            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Users className="h-8 w-8 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Ramah</h3>
                            <p className="text-gray-600">
                                Pelayanan ramah dan siap membantu kebutuhan Anda
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Contact Info Section */}
            <section className="container-supermarket py-12">
                <Card className="card-modern bg-gradient-to-br from-blue-600 to-blue-700 text-white">
                    <CardContent className="p-8 md:p-12">
                        <h2 className="text-2xl font-bold mb-8 text-center">
                            Informasi Kontak
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                    <MapPin className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-sm text-blue-200">Alamat</p>
                                    <p className="font-medium">Kaliurang St No.KM.11, Pedak</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                    <Phone className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-sm text-blue-200">Telepon</p>
                                    <p className="font-medium">081239602221</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                    <Mail className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-sm text-blue-200">Email</p>
                                    <p className="font-medium">nedhms@gmail.com</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                    <Clock className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-sm text-blue-200">Jam Operasional</p>
                                    <p className="font-medium">08:00 - 21:30</p>
                                </div>
                            </div>
                        </div>

                        <div className="text-center mt-8">
                            <Link
                                href="/contact"
                                className="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
                            >
                                Hubungi Kami
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </section>

            <Footer />
        </div>
    );
}
