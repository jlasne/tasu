"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useRef, useState } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

// Simple renderer: handles **bold**, line breaks
function MessageContent({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <div className="text-sm leading-relaxed space-y-1">
      {lines.map((line, i) => {
        if (line.trim() === "") return <br key={i} />;
        // Parse **bold**
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        return (
          <p key={i}>
            {parts.map((part, j) => {
              if (part.startsWith("**") && part.endsWith("**")) {
                return <strong key={j}>{part.slice(2, -2)}</strong>;
              }
              return <span key={j}>{part}</span>;
            })}
          </p>
        );
      })}
    </div>
  );
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const supabase = createClient();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { loadMessages(); }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, loading]);

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
          content: "Something went wrong. Try again.",
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
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
    setInput(el.value);
  }

  return (
    <div className="flex flex-col h-screen bg-cream">
      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto chat-scroll">
        {initialLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-warm-gray/25 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-warm-gray/25 animate-bounce [animation-delay:0.15s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-warm-gray/25 animate-bounce [animation-delay:0.3s]" />
            </div>
          </div>
        ) : messages.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <div className="w-12 h-12 rounded-2xl bg-terracotta flex items-center justify-center mb-5 shadow-sm">
              <span className="text-white text-base font-bold">T</span>
            </div>
            <h2 className="text-xl font-semibold text-charcoal mb-2">
              Hey, founder.
            </h2>
            <p className="text-sm text-warm-gray leading-relaxed max-w-xs">
              I&apos;m Tasu — your AI co-founder. Tell me what you&apos;re building,
              what&apos;s stuck, or what your numbers look like.
            </p>
            <div className="mt-6 flex flex-col gap-2 w-full max-w-xs">
              {[
                "What should I fix first on my landing page?",
                "I'm not getting traction — where do I start?",
                "Help me find my first 10 customers.",
              ].map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => {
                    setInput(prompt);
                    textareaRef.current?.focus();
                  }}
                  className="text-left text-xs text-warm-gray bg-white border border-cream-dark rounded-xl px-4 py-3 hover:border-terracotta/30 hover:text-charcoal transition-all"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 space-y-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-message-in`}
              >
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-lg bg-terracotta flex items-center justify-center mr-3 mt-0.5 shrink-0 shadow-sm">
                    <span className="text-white text-xs font-bold">T</span>
                  </div>
                )}
                <div
                  className={`max-w-[82%] rounded-2xl px-4 py-3 ${
                    msg.role === "user"
                      ? "bg-charcoal text-cream"
                      : "bg-white border border-cream-dark/60 text-charcoal shadow-sm"
                  }`}
                >
                  {msg.role === "user" ? (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  ) : (
                    <MessageContent text={msg.content} />
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex justify-start animate-message-in">
                <div className="w-7 h-7 rounded-lg bg-terracotta flex items-center justify-center mr-3 mt-0.5 shrink-0 shadow-sm">
                  <span className="text-white text-xs font-bold">T</span>
                </div>
                <div className="bg-white border border-cream-dark/60 rounded-2xl px-4 py-3.5 shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-warm-gray/40 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-warm-gray/40 animate-bounce [animation-delay:0.15s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-warm-gray/40 animate-bounce [animation-delay:0.3s]" />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className="px-4 sm:px-6 pb-5 sm:pb-6 pt-2 shrink-0">
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl border border-cream-dark/70 shadow-sm overflow-hidden">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={autoResize}
              onKeyDown={handleKeyDown}
              placeholder="What's on your mind, founder?"
              rows={1}
              className="w-full px-4 pt-3.5 pb-2 text-charcoal placeholder:text-warm-gray/40 focus:outline-none resize-none text-sm bg-transparent"
            />
            <div className="flex items-center justify-between px-3 pb-2.5">
              <span className="text-[11px] text-warm-gray/40">
                Shift+Enter for new line
              </span>
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="w-8 h-8 rounded-xl bg-terracotta hover:bg-terracotta-dark text-white flex items-center justify-center transition-all disabled:opacity-20 hover:scale-105 active:scale-95"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
                </svg>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
