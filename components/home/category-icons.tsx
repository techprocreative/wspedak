"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import {
    Package,
    Coffee,
    Milk,
    Cookie,
    Home,
    Sparkles,
    Baby,
    Pill,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

interface Category {
    name: string;
    icon: React.ReactNode;
    color: string;
}

// Icon mapping for categories
const categoryIcons: Record<string, { icon: React.ReactNode; color: string }> = {
    "Sembako": { icon: <Package className="h-6 w-6" />, color: "bg-orange-100 text-orange-600" },
    "Minuman": { icon: <Coffee className="h-6 w-6" />, color: "bg-blue-100 text-blue-600" },
    "Susu": { icon: <Milk className="h-6 w-6" />, color: "bg-cyan-100 text-cyan-600" },
    "Snack": { icon: <Cookie className="h-6 w-6" />, color: "bg-amber-100 text-amber-600" },
    "Rumah Tangga": { icon: <Home className="h-6 w-6" />, color: "bg-green-100 text-green-600" },
    "Perawatan Diri": { icon: <Sparkles className="h-6 w-6" />, color: "bg-pink-100 text-pink-600" },
    "Bayi": { icon: <Baby className="h-6 w-6" />, color: "bg-purple-100 text-purple-600" },
    "Obat-obatan": { icon: <Pill className="h-6 w-6" />, color: "bg-red-100 text-red-600" },
};

const defaultIcon = { icon: <Package className="h-6 w-6" />, color: "bg-gray-100 text-gray-600" };

export function CategoryIcons() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    useEffect(() => {
        async function fetchCategories() {
            try {
                const { data, error } = await supabase
                    .from("categories")
                    .select("name")
                    .order("name", { ascending: true });

                if (data && !error) {
                    setCategories(
                        data.map((c) => ({
                            name: c.name,
                            ...((categoryIcons[c.name] || defaultIcon)),
                        }))
                    );
                }
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            }
            setIsLoading(false);
        }

        fetchCategories();
    }, []);

    const updateScrollButtons = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
        }
    };

    useEffect(() => {
        updateScrollButtons();
        window.addEventListener("resize", updateScrollButtons);
        return () => window.removeEventListener("resize", updateScrollButtons);
    }, [categories]);

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const scrollAmount = 200;
            scrollRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
            setTimeout(updateScrollButtons, 300);
        }
    };

    if (isLoading) {
        return (
            <div className="flex gap-4 overflow-hidden">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 animate-pulse">
                        <div className="w-16 h-16 rounded-2xl bg-gray-200" />
                        <div className="w-12 h-3 rounded bg-gray-200" />
                    </div>
                ))}
            </div>
        );
    }

    if (categories.length === 0) {
        return null;
    }

    return (
        <div className="relative">
            {/* Left Arrow */}
            {canScrollLeft && (
                <button
                    onClick={() => scroll("left")}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-gray-50"
                >
                    <ChevronLeft className="h-5 w-5 text-gray-600" />
                </button>
            )}

            {/* Scrollable Container */}
            <div
                ref={scrollRef}
                onScroll={updateScrollButtons}
                className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-2 py-2"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                {categories.map((category) => (
                    <Link
                        key={category.name}
                        href={`/products?category=${encodeURIComponent(category.name)}`}
                        className="flex flex-col items-center gap-2 min-w-[80px] group"
                    >
                        <div
                            className={`w-16 h-16 rounded-2xl ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}
                        >
                            {category.icon}
                        </div>
                        <span className="text-xs font-medium text-gray-700 text-center line-clamp-1">
                            {category.name}
                        </span>
                    </Link>
                ))}
            </div>

            {/* Right Arrow */}
            {canScrollRight && (
                <button
                    onClick={() => scroll("right")}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-gray-50"
                >
                    <ChevronRight className="h-5 w-5 text-gray-600" />
                </button>
            )}
        </div>
    );
}
