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
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
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

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data: savedMsg } = await supabase
      .from("messages")
      .insert({ user_id: user.id, role: "user", content: userMessage })
      .select()
      .single();

    if (savedMsg) {
      setMessages((prev) => [...prev, savedMsg]);
    }

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
    <div className="flex flex-col h-screen bg-cream">
      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto chat-scroll">
        {initialLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex gap-1.5">
              <span className="w-2 h-2 rounded-full bg-warm-gray/30 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-warm-gray/30 animate-bounce [animation-delay:0.15s]" />
              <span className="w-2 h-2 rounded-full bg-warm-gray/30 animate-bounce [animation-delay:0.3s]" />
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center max-w-md mx-auto px-6">
            <div className="w-14 h-14 rounded-2xl bg-terracotta/10 flex items-center justify-center mb-5">
              <div className="w-8 h-8 rounded-xl bg-terracotta flex items-center justify-center">
                <span className="text-white text-sm font-bold">T</span>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-charcoal mb-2">
              Hey, founder.
            </h2>
            <p className="text-sm text-warm-gray leading-relaxed mb-1">
              I&apos;m Tasu, your AI co-founder.
            </p>
            <p className="text-sm text-warm-gray leading-relaxed">
              Tell me what&apos;s on your mind — what you&apos;re stuck on,
              what numbers you&apos;re looking at, what you shipped this week.
            </p>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto py-8 px-6 space-y-5">
            {messages.map((msg, i) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-message-in`}
                style={{ animationDelay: `${Math.min(i * 0.02, 0.3)}s` }}
              >
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-lg bg-terracotta flex items-center justify-center mr-3 mt-0.5 shrink-0">
                    <span className="text-white text-xs font-bold">T</span>
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.role === "user"
                      ? "bg-charcoal text-cream"
                      : "bg-white border border-cream-dark/60 text-charcoal"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">
                    {msg.content}
                  </p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start animate-message-in">
                <div className="w-7 h-7 rounded-lg bg-terracotta flex items-center justify-center mr-3 mt-0.5 shrink-0">
                  <span className="text-white text-xs font-bold">T</span>
                </div>
                <div className="bg-white border border-cream-dark/60 rounded-2xl px-4 py-3">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-warm-gray/30 animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-warm-gray/30 animate-bounce [animation-delay:0.15s]" />
                    <span className="w-2 h-2 rounded-full bg-warm-gray/30 animate-bounce [animation-delay:0.3s]" />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-2">
        <form
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-white rounded-2xl border border-cream-dark/60 shadow-sm p-2 flex items-end gap-2">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={autoResize}
              onKeyDown={handleKeyDown}
              placeholder="What's on your mind, founder?"
              rows={1}
              className="flex-1 px-3 py-2.5 text-charcoal placeholder:text-warm-gray/50 focus:outline-none resize-none text-sm bg-transparent"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="w-9 h-9 rounded-full bg-terracotta hover:bg-terracotta-dark text-white flex items-center justify-center transition-all disabled:opacity-20 shrink-0 hover:scale-105 active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
              </svg>
            </button>
          </div>
          <p className="text-center text-[11px] text-warm-gray/50 mt-2">
            Tasu gives advice based on your context. Always verify with real data.
          </p>
        </form>
      </div>
    </div>
  );
}
