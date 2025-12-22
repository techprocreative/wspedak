import { NextRequest, NextResponse } from 'next/server'

// Knowledge base content for system prompt
const KNOWLEDGE_BASE = `
# Toserba WS Pedak - Customer Service

## Informasi Toko
- Nama: Toserba WS Pedak
- Tagline: Murah • Lengkap • Luas
- Website: https://wstoserba.my.id
- WhatsApp: +62 812-3960-2221
- Email: nedhms@gmail.com
- Alamat: Jalan Kaliurang No.KM.11, Pedak, Sinduharjo, Ngaglik, Sleman, DIY 55581
- Jam Buka: Setiap hari 08:00 - 21:30 WIB

## Kategori Produk
- Makanan & Minuman
- Perawatan Tubuh
- Kebutuhan Rumah Tangga
- Produk Bayi
- Obat & Kesehatan
- Frozen Food
- Elektronik Kecil
- ATK

## Cara Berbelanja
1. Kunjungi website https://wstoserba.my.id
2. Pilih produk dan tambah ke keranjang
3. Checkout via WhatsApp
4. Konfirmasi pesanan dan bayar
5. Pesanan dikirim/diambil

## FAQ
- Gratis ongkir untuk pembelian min. Rp 50.000 di area Pedak
- Pengiriman 1-3 jam setelah konfirmasi pembayaran
- Metode pembayaran: Tunai, Transfer Bank, QRIS
- Semua produk 100% original

## Keunggulan
- Harga Murah
- Produk Lengkap
- Pelayanan Ramah
- Gratis Ongkir
- Pengiriman Cepat
- 100% Original
`

const SYSTEM_PROMPT = `Kamu adalah asisten customer service untuk Toserba WS Pedak, sebuah toko serba ada di Pedak, Yogyakarta.

${KNOWLEDGE_BASE}

## Panduan Respons:
- Gunakan bahasa Indonesia yang ramah dan sopan
- Jawab pertanyaan berdasarkan knowledge base di atas
- Jika tidak tahu jawabannya, arahkan ke WhatsApp +62 812-3960-2221
- Jangan membuat informasi yang tidak ada di knowledge base
- Respons harus singkat dan jelas
- Gunakan emoji secukupnya untuk kesan ramah 😊

## Contoh Sapaan:
- "Halo! Selamat datang di Toserba WS Pedak. Ada yang bisa saya bantu?"
- "Terima kasih sudah menghubungi kami! 😊"
`

export async function POST(req: NextRequest) {
    try {
        const { messages } = await req.json()

        const apiKey = process.env.OPENAI_API_KEY
        const apiUrl = process.env.OPENAI_API_URL || 'https://api.openai.com/v1'
        const model = process.env.OPENAI_MODEL || 'gpt-3.5-turbo'

        if (!apiKey) {
            return NextResponse.json(
                { error: 'Chat service is not configured' },
                { status: 500 }
            )
        }

        const response = await fetch(`${apiUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model,
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    ...messages,
                ],
                max_tokens: 500,
                temperature: 0.7,
            }),
        })

        if (!response.ok) {
            const error = await response.text()
            console.error('LLM API error:', error)
            return NextResponse.json(
                { error: 'Failed to get response from AI' },
                { status: 500 }
            )
        }

        const data = await response.json()
        const assistantMessage = data.choices?.[0]?.message?.content ||
            'Maaf, saya tidak bisa menjawab saat ini. Silakan hubungi kami via WhatsApp di +62 812-3960-2221'

        return NextResponse.json({ message: assistantMessage })
    } catch (error) {
        console.error('Chat API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
