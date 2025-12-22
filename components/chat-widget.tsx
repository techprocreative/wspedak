"use client"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Send, Loader2, Bot, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Message {
    role: "user" | "assistant"
    content: string
}

export function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus()
        }
    }, [isOpen])

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return

        const userMessage: Message = { role: "user", content: input.trim() }
        setMessages((prev) => [...prev, userMessage])
        setInput("")
        setIsLoading(true)

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: [...messages, userMessage],
                }),
            })

            if (!response.ok) {
                throw new Error("Failed to get response")
            }

            const data = await response.json()
            const assistantMessage: Message = {
                role: "assistant",
                content: data.message,
            }
            setMessages((prev) => [...prev, assistantMessage])
        } catch (error) {
            console.error("Chat error:", error)
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content:
                        "Maaf, terjadi kesalahan. Silakan coba lagi atau hubungi kami via WhatsApp di +62 812-3960-2221",
                },
            ])
        } finally {
            setIsLoading(false)
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
        }
    }

    return (
        <>
            {/* Chat Button */}
            <button
                onClick={() => setIsOpen(true)}
                className={cn(
                    "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-all duration-300 flex items-center justify-center",
                    isOpen && "scale-0 opacity-0"
                )}
                aria-label="Open chat"
            >
                <MessageCircle className="h-6 w-6" />
            </button>

            {/* Chat Window */}
            <div
                className={cn(
                    "fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-48px)] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden transition-all duration-300 flex flex-col",
                    isOpen
                        ? "opacity-100 translate-y-0 h-[500px] max-h-[calc(100vh-100px)]"
                        : "opacity-0 translate-y-4 pointer-events-none h-0"
                )}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                            <Bot className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-semibold">CS WS Pedak</h3>
                            <p className="text-xs text-blue-100">Biasanya membalas cepat</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-white/80 hover:text-white transition-colors"
                        aria-label="Close chat"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                    {messages.length === 0 && (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Bot className="h-8 w-8 text-blue-600" />
                            </div>
                            <p className="text-gray-600 text-sm">
                                Halo! 👋 Selamat datang di Toserba WS Pedak.
                                <br />
                                Ada yang bisa saya bantu?
                            </p>
                        </div>
                    )}

                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={cn(
                                "flex gap-2",
                                msg.role === "user" ? "justify-end" : "justify-start"
                            )}
                        >
                            {msg.role === "assistant" && (
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Bot className="h-4 w-4 text-blue-600" />
                                </div>
                            )}
                            <div
                                className={cn(
                                    "max-w-[75%] rounded-2xl px-4 py-2 text-sm",
                                    msg.role === "user"
                                        ? "bg-blue-600 text-white rounded-br-md"
                                        : "bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-md"
                                )}
                            >
                                {msg.content}
                            </div>
                            {msg.role === "user" && (
                                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                                    <User className="h-4 w-4 text-gray-600" />
                                </div>
                            )}
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex gap-2 justify-start">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <Bot className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="bg-white text-gray-800 shadow-sm border border-gray-100 rounded-2xl rounded-bl-md px-4 py-2">
                                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-gray-100 bg-white">
                    <div className="flex gap-2">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ketik pesan..."
                            className="flex-1 px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:border-blue-400 text-sm"
                            disabled={isLoading}
                        />
                        <Button
                            onClick={sendMessage}
                            disabled={!input.trim() || isLoading}
                            size="icon"
                            className="rounded-full bg-blue-600 hover:bg-blue-700 h-10 w-10"
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}
