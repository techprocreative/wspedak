"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

interface Banner {
    id: string;
    title: string;
    imageUrl: string;
    linkUrl: string | null;
}

export function PromoCarousel() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchBanners() {
            try {
                const { data, error } = await supabase
                    .from("banners")
                    .select("id, title, image_url, link_url")
                    .eq("is_active", true)
                    .order("order_index", { ascending: true });

                if (data && !error) {
                    setBanners(
                        data.map((b) => ({
                            id: b.id,
                            title: b.title,
                            imageUrl: b.image_url,
                            linkUrl: b.link_url,
                        }))
                    );
                }
            } catch (error) {
                console.error("Failed to fetch banners:", error);
            }
            setIsLoading(false);
        }

        fetchBanners();
    }, []);

    // Auto-slide
    useEffect(() => {
        if (banners.length <= 1) return;

        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % banners.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [banners.length]);

    const goToPrevious = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
    }, [banners.length]);

    const goToNext = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, [banners.length]);

    if (isLoading) {
        return (
            <div className="w-full aspect-[3/1] bg-gradient-to-r from-blue-100 to-blue-200 animate-pulse rounded-2xl" />
        );
    }

    if (banners.length === 0) {
        // Fallback banner if no banners in database
        return (
            <div className="w-full aspect-[3/1] bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl flex items-center justify-center">
                <div className="text-center text-white px-4">
                    <h2 className="text-2xl md:text-4xl font-bold mb-2">Selamat Datang!</h2>
                    <p className="text-lg md:text-xl text-blue-100">
                        Belanja kebutuhan sehari-hari dengan mudah dan hemat
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full overflow-hidden rounded-2xl group">
            {/* Slides */}
            <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {banners.map((banner) => (
                    <div key={banner.id} className="w-full flex-shrink-0">
                        {banner.linkUrl ? (
                            <Link href={banner.linkUrl}>
                                <div className="relative w-full aspect-[3/1] cursor-pointer">
                                    <Image
                                        src={banner.imageUrl}
                                        alt={banner.title}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                </div>
                            </Link>
                        ) : (
                            <div className="relative w-full aspect-[3/1]">
                                <Image
                                    src={banner.imageUrl}
                                    alt={banner.title}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Navigation Arrows */}
            {banners.length > 1 && (
                <>
                    <button
                        onClick={goToPrevious}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Previous"
                    >
                        <ChevronLeft className="h-6 w-6 text-gray-700" />
                    </button>
                    <button
                        onClick={goToNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Next"
                    >
                        <ChevronRight className="h-6 w-6 text-gray-700" />
                    </button>
                </>
            )}

            {/* Dot Indicators */}
            {banners.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {banners.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-3 h-3 rounded-full transition-all ${index === currentIndex
                                    ? "bg-white w-8"
                                    : "bg-white/50 hover:bg-white/70"
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
