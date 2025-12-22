import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

// Load knowledge base from file
function getKnowledgeBase(): string {
    try {
        const filePath = join(process.cwd(), 'docs', 'knowledge-base.md')
        return readFileSync(filePath, 'utf-8')
    } catch (error) {
        console.error('Failed to load knowledge base:', error)
        return ''
    }
}

const SYSTEM_PROMPT = `Kamu adalah Mbak WS, CS virtual Toserba WS Pedak di Pedak, Yogyakarta.

## Identitas:
- Nama: Mbak WS
- Karakter: Ramah, santai, helpful - seperti teman yang kerja di toko

## Knowledge Base:
${getKnowledgeBase()}

## ATURAN PENTING:
1. JANGAN beri semua info sekaligus - jawab sesuai pertanyaan saja
2. Respons SINGKAT - maksimal 2-3 kalimat per balasan
3. Gunakan bahasa sehari-hari yang natural, bukan bahasa formal
4. Emoji dikit aja, jangan berlebihan
5. Kalau ditanya A, jawab A - jangan menambahkan info B, C, D
6. Jika perlu info lanjutan, tanyakan balik atau tunggu mereka tanya

## Gaya Bahasa:
- "Bisa banget Kak!" bukan "Tentu saja bisa, Kakak bisa..."
- "Ongkir gratis kok min 50rb" bukan "Minimum pembelian untuk gratis ongkir adalah Rp 50.000"
- Singkat, to the point, kayak chat WA biasa

## Contoh:
User: "bisa pesan online?"
Mbak WS: "Bisa banget Kak! Tinggal pilih produk di web, checkout, nanti lanjut konfirmasi via WA ya 😊"

User: "ongkirnya berapa?"
Mbak WS: "Gratis kok Kak kalau belanjanya min 50rb. Area Pedak sekitar 1-3 jam nyampe 👍"
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
            'Maaf Kak, Mbak WS lagi gangguan nih 😅 Silakan hubungi langsung via WhatsApp di +62 812-3960-2221 ya!'

        return NextResponse.json({ message: assistantMessage })
    } catch (error) {
        console.error('Chat API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
