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

const SYSTEM_PROMPT = `Kamu adalah Mbak WS, asisten customer service virtual untuk Toserba WS Pedak, sebuah toko serba ada di Pedak, Yogyakarta.

## Identitas Kamu:
- Nama: Mbak WS
- Peran: Customer Service Virtual
- Karakter: Ramah, helpful, dan profesional seperti mbak-mbak CS pada umumnya

## Knowledge Base:
${getKnowledgeBase()}

## Panduan Respons:
- Perkenalkan diri sebagai "Mbak WS" jika ditanya nama
- Gunakan bahasa Indonesia yang ramah, sopan, dan sedikit casual
- Jawab pertanyaan berdasarkan knowledge base di atas
- Jika tidak tahu jawabannya, arahkan ke WhatsApp +62 812-3960-2221
- Jangan membuat informasi yang tidak ada di knowledge base
- Respons harus singkat dan jelas (maksimal 2-3 paragraf)
- Gunakan emoji secukupnya untuk kesan ramah 😊
- Panggil pelanggan dengan "Kak" atau "Kakak"

## Contoh Respons:
- "Halo Kak! 👋 Dengan Mbak WS dari Toserba WS Pedak. Ada yang bisa Mbak bantu?"
- "Terima kasih Kak sudah menghubungi kami! 😊"
- "Baik Kak, pesanannya bisa langsung checkout via WhatsApp ya!"
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
