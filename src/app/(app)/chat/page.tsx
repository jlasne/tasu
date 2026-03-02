"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useRef, useState } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const supabase = createClient();

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  async function loadMessages() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    if (data) setMessages(data);
    setInitialLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setLoading(true);

    // Resize textarea back
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    // Save user message
    const { data: savedMsg } = await supabase
      .from("messages")
      .insert({ user_id: user.id, role: "user", content: userMessage })
      .select()
      .single();

    if (savedMsg) {
      setMessages((prev) => [...prev, savedMsg]);
    }

    // Call API
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();

      if (data.reply) {
        const { data: assistantMsg } = await supabase
          .from("messages")
          .insert({
            user_id: user.id,
            role: "assistant",
            content: data.reply,
          })
          .select()
          .single();

        if (assistantMsg) {
          setMessages((prev) => [...prev, assistantMsg]);
        }
      }
    } catch {
      // Show error in chat
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Sorry, something went wrong. Try again.",
          created_at: new Date().toISOString(),
        },
      ]);
    }

    setLoading(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  function autoResize(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
    setInput(el.value);
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="border-b border-cream-dark px-6 py-4 bg-white/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-terracotta flex items-center justify-center">
            <span className="text-white text-sm font-bold">T</span>
          </div>
          <div>
            <h1 className="text-sm font-semibold text-charcoal">Tasu</h1>
            <p className="text-xs text-warm-gray">Your AI co-founder</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto chat-scroll px-6 py-6">
        {initialLoading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-warm-gray">Loading...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center max-w-md mx-auto">
            <div className="w-12 h-12 rounded-full bg-terracotta/10 flex items-center justify-center mb-4">
              <div className="w-6 h-6 rounded-full bg-terracotta flex items-center justify-center">
                <span className="text-white text-xs font-bold">T</span>
              </div>
            </div>
            <h2 className="text-lg font-semibold text-charcoal mb-2">
              Hey, founder.
            </h2>
            <p className="text-sm text-warm-gray leading-relaxed">
              I&apos;m Tasu, your AI co-founder. Tell me what&apos;s on your
              mind — what you&apos;re stuck on, what numbers you&apos;re looking
              at, what you shipped this week. I&apos;ll give you one concrete
              thing to do next.
            </p>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto space-y-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.role === "user"
                      ? "bg-charcoal text-cream"
                      : "bg-white border border-cream-dark text-charcoal"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">
                    {msg.content}
                  </p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-cream-dark rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-warm-gray/40 animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-warm-gray/40 animate-bounce [animation-delay:0.15s]" />
                    <span className="w-2 h-2 rounded-full bg-warm-gray/40 animate-bounce [animation-delay:0.3s]" />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-cream-dark px-6 py-4 bg-white/50 backdrop-blur-sm">
        <form
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto flex items-end gap-3"
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={autoResize}
            onKeyDown={handleKeyDown}
            placeholder="What's on your mind, founder?"
            rows={1}
            className="flex-1 px-4 py-3 rounded-xl border border-cream-dark bg-white text-charcoal placeholder:text-warm-gray/50 focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta transition resize-none text-sm"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-terracotta hover:bg-terracotta-dark text-white p-3 rounded-xl transition-colors disabled:opacity-30 shrink-0"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
