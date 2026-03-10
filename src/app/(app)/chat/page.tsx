"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

interface Task {
  id: string;
  content: string;
  done: boolean;
  pinned: boolean;
  source: string;
  source_id: string | null;
  created_at: string;
}

interface Integration {
  datafast_api_key: string | null;
  github_repo_url: string | null;
}

function TasuLogoIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="85" y="85" width="330" height="330" rx="56" fill="#7B2C0E" transform="rotate(45 250 250)"/>
      <rect x="130" y="130" width="240" height="240" rx="40" fill="#C2581C" transform="rotate(45 250 250)"/>
      <rect x="178" y="178" width="144" height="144" rx="28" fill="#EDE7DF" transform="rotate(45 250 250)"/>
    </svg>
  );
}

function MessageContent({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <div className="text-sm leading-relaxed space-y-1">
      {lines.map((line, i) => {
        if (line.trim() === "") return <br key={i} />;
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

function IntegrationNotice({ integration }: { integration: Integration | null }) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  const missingDatafast = !integration?.datafast_api_key;
  const missingGithub = !integration?.github_repo_url;
  if (!missingDatafast && !missingGithub) return null;

  return (
    <div className="flex items-center gap-2 bg-white dark:bg-dark-surface border border-amber-200 dark:border-amber-800 shadow-sm rounded-xl px-3 py-2 text-xs animate-fade-in mx-4 mt-3">
      <svg className="w-3.5 h-3.5 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
      <span className="text-warm-gray dark:text-dark-muted">
        Connect DataFast &amp; GitHub for live data.{" "}
        <Link href="/settings" className="text-terracotta hover:underline font-semibold">Settings</Link>
      </span>
      <button onClick={() => setDismissed(true)} className="ml-auto text-warm-gray/40 hover:text-warm-gray shrink-0">
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");
  const [newTaskInput, setNewTaskInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [userName, setUserName] = useState<string | null>(null);
  const [integration, setIntegration] = useState<Integration | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const supabase = createClient();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { loadData(); }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, loading]);

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const [{ data: msgs }, { data: profile }, { data: intg }, { data: taskData }] = await Promise.all([
      supabase.from("messages").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(50),
      supabase.from("profiles").select("full_name").eq("id", user.id).single(),
      supabase.from("integrations").select("datafast_api_key, github_repo_url").eq("user_id", user.id).single(),
      supabase.from("tasks").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(50),
    ]);

    if (msgs) setMessages([...msgs].reverse());
    if (profile?.full_name) setUserName(profile.full_name.split(" ")[0]);
    if (intg) setIntegration(intg as Integration);
    if (taskData) setTasks(taskData as Task[]);
    setInitialLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setLoading(true);

    if (textareaRef.current) textareaRef.current.style.height = "auto";

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: savedMsg } = await supabase
      .from("messages")
      .insert({ user_id: user.id, role: "user", content: userMessage })
      .select()
      .single();

    if (savedMsg) setMessages((prev) => [...prev, savedMsg]);

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
          .insert({ user_id: user.id, role: "assistant", content: data.reply })
          .select()
          .single();

        if (assistantMsg) setMessages((prev) => [...prev, assistantMsg]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "assistant", content: "Something went wrong. Try again.", created_at: new Date().toISOString() },
      ]);
    }

    setLoading(false);
  }

  async function createTask(content: string, sourceId?: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // POST to n8n webhook
    try {
      await fetch("https://n8n.tasu.ai/webhook/055b3a6d-e5cc-45fa-ab6e-0f3a00fa3b4f", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id, content, source: "chat", source_id: sourceId ?? null }),
      });
    } catch {
      // Webhook failure shouldn't block task creation
    }

    const { data } = await supabase
      .from("tasks")
      .insert({ user_id: user.id, content, source: "chat", source_id: sourceId ?? null, pinned: true })
      .select()
      .single();

    if (data) setTasks((prev) => [data as Task, ...prev]);
  }

  async function toggleTaskDone(taskId: string, done: boolean) {
    setTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, done } : t));
    await supabase.from("tasks").update({ done, completed_at: done ? new Date().toISOString() : null }).eq("id", taskId);
  }

  async function deleteTask(taskId: string) {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    await supabase.from("tasks").delete().eq("id", taskId);
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

  const [taskBarOpen, setTaskBarOpen] = useState(true);

  const greeting = userName ? `Hey, ${userName}.` : "Hey, founder.";
  const openTasks = tasks.filter((t) => !t.done);
  const doneTasks = tasks.filter((t) => t.done);

  return (
    <div className="flex h-screen bg-cream dark:bg-dark-bg">
      {/* ── Left: Chat (50%) ── */}
      <div className="flex-1 flex flex-col min-w-0">
        <IntegrationNotice integration={integration} />

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
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <div className="mb-5 drop-shadow-sm">
                <TasuLogoIcon size={52} />
              </div>
              <h2 className="text-xl font-semibold text-charcoal dark:text-dark-text mb-2">{greeting}</h2>
              <p className="text-sm text-warm-gray dark:text-dark-muted leading-relaxed max-w-xs">
                {"I'm Tasu — your AI co-founder. Tell me what you're building, what's stuck, or what your numbers look like."}
              </p>
              <div className="mt-6 flex flex-col gap-2 w-full max-w-xs">
                {[
                  "What should I fix first on my landing page?",
                  "I'm not getting traction — where do I start?",
                  "Help me find my first 10 customers.",
                ].map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => { setInput(prompt); textareaRef.current?.focus(); }}
                    className="text-left text-xs text-warm-gray dark:text-dark-muted bg-white dark:bg-dark-surface border border-cream-dark dark:border-dark-border rounded-xl px-4 py-3 hover:border-terracotta/30 hover:text-charcoal dark:hover:text-dark-text transition-all"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 space-y-6">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-message-in`}>
                  {msg.role === "assistant" && (
                    <div className="mr-3 mt-0.5 shrink-0">
                      <TasuLogoIcon size={28} />
                    </div>
                  )}
                  <div className="flex flex-col gap-1 max-w-[82%]">
                    <div className={`rounded-2xl px-4 py-3 ${
                      msg.role === "user"
                        ? "bg-charcoal text-cream"
                        : "bg-white dark:bg-dark-surface border border-cream-dark/60 dark:border-dark-border text-charcoal dark:text-dark-text shadow-sm"
                    }`}>
                      {msg.role === "user" ? (
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                      ) : (
                        <MessageContent text={msg.content} />
                      )}
                    </div>
                    {msg.role === "assistant" && (
                      <button
                        onClick={() => createTask(msg.content.split("\n")[0].slice(0, 120), msg.id)}
                        className="self-start flex items-center gap-1 text-[11px] text-warm-gray/50 dark:text-dark-muted/50 hover:text-terracotta transition-colors ml-1"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Make task
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start animate-message-in">
                  <div className="mr-3 mt-0.5 shrink-0">
                    <TasuLogoIcon size={28} />
                  </div>
                  <div className="bg-white dark:bg-dark-surface border border-cream-dark/60 dark:border-dark-border rounded-2xl px-4 py-3.5 shadow-sm">
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

        <div className="px-4 sm:px-6 pb-5 sm:pb-6 pt-2 shrink-0">
          {!taskBarOpen && (
            <div className="max-w-2xl mx-auto mb-2 hidden md:flex justify-end">
              <button
                onClick={() => setTaskBarOpen(true)}
                className="flex items-center gap-1.5 text-[11px] text-warm-gray/50 hover:text-terracotta transition-colors px-2 py-1 rounded-lg hover:bg-terracotta/5"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Tasks{openTasks.length > 0 ? ` (${openTasks.length})` : ""}
              </button>
            </div>
          )}
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-dark-surface rounded-2xl border border-cream-dark/70 dark:border-dark-border shadow-sm overflow-hidden">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={autoResize}
                onKeyDown={handleKeyDown}
                placeholder="What's on your mind, founder?"
                rows={1}
                className="w-full px-4 pt-3.5 pb-2 text-charcoal dark:text-dark-text placeholder:text-warm-gray/40 dark:placeholder:text-dark-muted/40 focus:outline-none resize-none text-sm bg-transparent"
              />
              <div className="flex items-center justify-between px-3 pb-2.5">
                <span className="text-[11px] text-warm-gray/40 dark:text-dark-muted/40">Shift+Enter for new line</span>
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

      {/* ── Right: Tasks (50%) ── */}
      {taskBarOpen && (
      <div className="hidden md:flex w-1/2 flex-col border-l border-cream-dark dark:border-dark-border bg-white/50 dark:bg-dark-surface/30 h-screen">
        <div className="px-5 py-4 border-b border-cream-dark dark:border-dark-border shrink-0 flex items-start justify-between">
          <div>
            <h2 className="text-sm font-semibold text-charcoal dark:text-dark-text">Tasks</h2>
            <p className="text-[11px] text-warm-gray dark:text-dark-muted mt-0.5">Click &quot;Make task&quot; on any message, or create one below</p>
          </div>
          <button
            onClick={() => setTaskBarOpen(false)}
            className="text-warm-gray/30 hover:text-warm-gray transition-colors mt-0.5 shrink-0"
            title="Collapse tasks"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>

        {/* New task input */}
        <div className="px-5 py-3 border-b border-cream-dark/50 dark:border-dark-border/50 shrink-0">
          <form onSubmit={(e) => {
            e.preventDefault();
            if (!newTaskInput.trim()) return;
            createTask(newTaskInput.trim());
            setNewTaskInput("");
          }} className="flex gap-2">
            <input
              type="text"
              value={newTaskInput}
              onChange={(e) => setNewTaskInput(e.target.value)}
              placeholder="Add a task..."
              className="flex-1 px-3 py-2 rounded-lg border border-cream-dark dark:border-dark-border bg-white dark:bg-dark-bg text-charcoal dark:text-dark-text placeholder:text-warm-gray/40 dark:placeholder:text-dark-muted/40 focus:outline-none focus:ring-2 focus:ring-terracotta/20 text-sm"
            />
            <button
              type="submit"
              disabled={!newTaskInput.trim()}
              className="px-3 py-2 rounded-lg bg-terracotta hover:bg-terracotta-dark text-white text-sm font-medium transition-all disabled:opacity-30"
            >
              Add
            </button>
          </form>
        </div>

        {/* Task list */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-1.5">
          {tasks.length === 0 && !initialLoading && (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="w-10 h-10 rounded-xl bg-cream dark:bg-dark-border flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-warm-gray/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm text-warm-gray dark:text-dark-muted">No tasks yet</p>
              <p className="text-xs text-warm-gray/50 dark:text-dark-muted/50 mt-1">
                Click &quot;Make task&quot; on a message or add one above
              </p>
            </div>
          )}

          {/* Open tasks */}
          {openTasks.length > 0 && (
            <>
              <p className="text-[10px] font-semibold text-warm-gray/50 dark:text-dark-muted/50 uppercase tracking-widest pb-1">To do ({openTasks.length})</p>
              {openTasks.map((task) => (
                <div key={task.id} className="flex items-start gap-2.5 p-2.5 rounded-xl border border-cream-dark dark:border-dark-border bg-white dark:bg-dark-surface group hover:border-terracotta/20 transition-all">
                  <button onClick={() => toggleTaskDone(task.id, true)} className="mt-0.5 shrink-0">
                    <div className="w-4 h-4 rounded border-2 border-cream-dark dark:border-dark-muted group-hover:border-terracotta/50 transition-all" />
                  </button>
                  <p className="flex-1 text-sm text-charcoal dark:text-dark-text leading-snug">{task.content}</p>
                  <button onClick={() => deleteTask(task.id)} className="opacity-0 group-hover:opacity-100 text-warm-gray/30 hover:text-red-400 shrink-0 transition-all" title="Delete">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </>
          )}

          {/* Done tasks */}
          {doneTasks.length > 0 && (
            <>
              <p className="text-[10px] font-semibold text-warm-gray/50 dark:text-dark-muted/50 uppercase tracking-widest pt-4 pb-1">Done ({doneTasks.length})</p>
              {doneTasks.map((task) => (
                <div key={task.id} className="flex items-start gap-2.5 p-2.5 rounded-xl border border-cream-dark/50 dark:border-dark-border/50 bg-cream/30 dark:bg-dark-border/20 group opacity-50">
                  <button onClick={() => toggleTaskDone(task.id, false)} className="mt-0.5 shrink-0">
                    <div className="w-4 h-4 rounded border-2 border-terracotta bg-terracotta flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                  </button>
                  <p className="flex-1 text-sm text-warm-gray dark:text-dark-muted leading-snug line-through">{task.content}</p>
                  <button onClick={() => deleteTask(task.id)} className="opacity-0 group-hover:opacity-100 text-warm-gray/30 hover:text-red-400 shrink-0 transition-all" title="Delete">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
      )}
    </div>
  );
}
