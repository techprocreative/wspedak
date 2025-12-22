"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Save, RotateCcw, FileText, Loader2, Bot } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

export default function KnowledgeBasePage() {
    const [content, setContent] = useState("")
    const [originalContent, setOriginalContent] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        fetchKnowledgeBase()
    }, [])

    const fetchKnowledgeBase = async () => {
        try {
            const response = await fetch("/api/knowledge-base")
            if (response.ok) {
                const data = await response.json()
                setContent(data.content)
                setOriginalContent(data.content)
            } else {
                toast.error("Gagal memuat knowledge base")
            }
        } catch (error) {
            toast.error("Terjadi kesalahan saat memuat data")
        } finally {
            setIsLoading(false)
        }
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            const { data: { session } } = await supabase.auth.getSession()
            const token = session?.access_token

            const response = await fetch("/api/knowledge-base", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ content }),
            })

            if (response.ok) {
                setOriginalContent(content)
                toast.success("Knowledge base berhasil disimpan!")
            } else {
                toast.error("Gagal menyimpan knowledge base")
            }
        } catch (error) {
            toast.error("Terjadi kesalahan saat menyimpan")
        } finally {
            setIsSaving(false)
        }
    }

    const handleReset = () => {
        setContent(originalContent)
        toast.info("Perubahan dibatalkan")
    }

    const hasChanges = content !== originalContent

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Bot className="h-6 w-6 text-blue-600" />
                        Knowledge Base CS
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Edit informasi yang digunakan oleh Mbak WS (CS Virtual)
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={handleReset}
                        disabled={!hasChanges || isSaving}
                    >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={!hasChanges || isSaving}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        {isSaving ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                            <Save className="h-4 w-4 mr-2" />
                        )}
                        Simpan
                    </Button>
                </div>
            </div>

            {/* Editor */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Editor Knowledge Base
                    </CardTitle>
                    <CardDescription>
                        Dokumen ini berisi informasi toko, FAQ, dan panduan yang digunakan oleh Mbak WS untuk menjawab pertanyaan pelanggan.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="min-h-[500px] font-mono text-sm"
                        placeholder="Masukkan konten knowledge base..."
                    />
                    {hasChanges && (
                        <p className="text-sm text-orange-600 mt-2">
                            * Ada perubahan yang belum disimpan
                        </p>
                    )}
                </CardContent>
            </Card>

            {/* Tips */}
            <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                    <h3 className="font-semibold text-blue-900 mb-2">💡 Tips Penulisan:</h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Gunakan format Markdown untuk struktur yang jelas</li>
                        <li>• Pastikan informasi kontak dan jam buka selalu update</li>
                        <li>• Tambahkan FAQ baru berdasarkan pertanyaan yang sering muncul</li>
                        <li>• Hindari informasi yang terlalu teknis atau membingungkan</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    )
}
