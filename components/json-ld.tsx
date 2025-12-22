export default function JsonLd() {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "@id": "https://wspedak.com",
        "name": "Toserba WS Pedak",
        "alternateName": "WS Pedak",
        "description": "Toko serba ada terlengkap di Pedak untuk kebutuhan harian Anda dengan harga murah, produk lengkap, dan area luas.",
        "url": "https://wspedak.com",
        "telephone": "+6281239602221",
        "email": "nedhms@gmail.com",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Kaliurang St No.KM.11, Pedak, Sinduharjo",
            "addressLocality": "Ngaglik",
            "addressRegion": "Sleman",
            "postalCode": "55581",
            "addressCountry": "ID"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": -7.7150,
            "longitude": 110.3973
        },
        "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            "opens": "08:00",
            "closes": "21:30"
        },
        "priceRange": "Rp",
        "currenciesAccepted": "IDR",
        "paymentAccepted": "Cash, Transfer",
        "image": "https://wspedak.com/og-image.jpg",
        "sameAs": []
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
    )
}
