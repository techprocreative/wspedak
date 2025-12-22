import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'

// Create Supabase client lazily to avoid build errors
function getSupabaseClient(authToken: string | null = null) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
        return null
    }

    const options = authToken
        ? { global: { headers: { Authorization: authToken } } }
        : {}

    return createClient(supabaseUrl, supabaseKey, options)
}

// Fallback to file if database is not available
function getFileKnowledgeBase(): string {
    try {
        const filePath = join(process.cwd(), 'docs', 'knowledge-base.md')
        return readFileSync(filePath, 'utf-8')
    } catch (error) {
        return ''
    }
}

export async function GET() {
    try {
        const supabase = getSupabaseClient()

        if (supabase) {
            // Try to get from database first
            const { data, error } = await supabase
                .from('settings')
                .select('value')
                .eq('key', 'knowledge_base')
                .single()

            if (!error && data) {
                return NextResponse.json({ content: data.value, source: 'database' })
            }
        }

        // Fallback to file
        const content = getFileKnowledgeBase()
        return NextResponse.json({ content, source: 'file' })
    } catch (error) {
        console.error('Failed to read knowledge base:', error)
        const content = getFileKnowledgeBase()
        return NextResponse.json({ content, source: 'file' })
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

        const authHeader = req.headers.get('Authorization')
        const supabase = getSupabaseClient(authHeader)

        if (!supabase) {
            return NextResponse.json(
                { error: 'Database not configured' },
                { status: 500 }
            )
        }

        // Upsert to database
        const { error } = await supabase
            .from('settings')
            .upsert(
                {
                    key: 'knowledge_base',
                    value: content,
                    updated_at: new Date().toISOString()
                },
                { onConflict: 'key' }
            )

        if (error) {
            console.error('Database error:', error)
            return NextResponse.json(
                { error: 'Failed to save to database: ' + error.message },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true, message: 'Knowledge base updated successfully' })
    } catch (error) {
        console.error('Failed to write knowledge base:', error)
        return NextResponse.json(
            { error: 'Failed to update knowledge base' },
            { status: 500 }
        )
    }
}
