import { NextRequest, NextResponse } from 'next/server'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const KB_FILE_PATH = join(process.cwd(), 'docs', 'knowledge-base.md')

export async function GET() {
    try {
        const content = readFileSync(KB_FILE_PATH, 'utf-8')
        return NextResponse.json({ content })
    } catch (error) {
        console.error('Failed to read knowledge base:', error)
        return NextResponse.json(
            { error: 'Failed to read knowledge base' },
            { status: 500 }
        )
    }
}

export async function POST(req: NextRequest) {
    try {
        const { content } = await req.json()

        if (!content || typeof content !== 'string') {
            return NextResponse.json(
                { error: 'Content is required' },
                { status: 400 }
            )
        }

        writeFileSync(KB_FILE_PATH, content, 'utf-8')

        return NextResponse.json({ success: true, message: 'Knowledge base updated successfully' })
    } catch (error) {
        console.error('Failed to write knowledge base:', error)
        return NextResponse.json(
            { error: 'Failed to update knowledge base' },
            { status: 500 }
        )
    }
}
