import { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://wstoserba.my.id'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin/', '/api/', '/dashboard/', '/login/', '/register/'],
            },
        ],
        sitemap: `${BASE_URL}/sitemap.xml`,
    }
}
