"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LandingPage() {
  const [url, setUrl] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = url.trim();
    const encoded = encodeURIComponent(trimmed);
    router.push(trimmed ? `/login?url=${encoded}&mode=signup` : "/login?mode=signup");
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 sm:px-10 py-6 max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-terracotta flex items-center justify-center">
            <span className="text-white text-xs font-bold">T</span>
          </div>
          <span className="text-lg font-bold text-charcoal tracking-tight">tasu</span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="text-sm text-warm-gray hover:text-charcoal transition-colors px-4 py-2"
          >
            Sign in
          </Link>
          <Link
            href="/login?mode=signup"
            className="text-sm font-medium text-white bg-charcoal hover:bg-charcoal/85 px-4 py-2 rounded-full transition-all active:scale-[0.98]"
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-24 pt-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 text-xs font-medium text-warm-gray bg-white border border-cream-dark px-3 py-1.5 rounded-full mb-8 animate-fade-in shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-terracotta animate-pulse" />
          AI co-founder for solo builders
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-charcoal leading-[1.08] tracking-tight mb-5 animate-fade-in-up max-w-2xl">
          Make something<br />
          people actually want
        </h1>

        {/* Subheadline */}
        <p className="text-base sm:text-lg text-warm-gray leading-relaxed mb-12 animate-fade-in-up animation-delay-100 max-w-md">
          Paste your website. Get one concrete thing to do next.
          No fluff, no playbooks — just focus.
        </p>

        {/* URL input */}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-lg animate-fade-in-up animation-delay-200"
        >
          <div className="bg-white rounded-2xl border border-cream-dark shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-1">
              <svg
                className="w-4 h-4 text-warm-gray/50 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
              </svg>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="yourwebsite.com"
                className="flex-1 py-3.5 text-charcoal placeholder:text-warm-gray/40 focus:outline-none text-[15px] bg-transparent min-w-0"
              />
              <button
                type="submit"
                className="shrink-0 w-9 h-9 rounded-xl bg-terracotta hover:bg-terracotta-dark text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
                </svg>
              </button>
            </div>
          </div>
          <p className="text-xs text-warm-gray/50 mt-3">
            Free to start — no credit card required
          </p>
        </form>

        {/* Social proof */}
        <div className="mt-12 animate-fade-in-up animation-delay-300">
          <div className="flex items-center justify-center gap-3">
            <div className="flex -space-x-1.5">
              {["JM", "SK", "AL", "RP", "ND"].map((init) => (
                <div
                  key={init}
                  className="w-7 h-7 rounded-full bg-cream-dark border-2 border-cream flex items-center justify-center text-[10px] font-semibold text-warm-gray"
                >
                  {init}
                </div>
              ))}
            </div>
            <span className="text-sm text-warm-gray">
              Trusted by 50+ solo founders
            </span>
          </div>
        </div>
      </main>

      {/* Feature strip */}
      <div className="border-t border-cream-dark/60">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div>
              <div className="w-8 h-8 rounded-lg bg-terracotta/10 flex items-center justify-center mb-3">
                <svg className="w-4 h-4 text-terracotta" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-charcoal mb-1">Reads your product</h3>
              <p className="text-xs text-warm-gray leading-relaxed">Tasu scans your landing page and learns your context. No lengthy setup.</p>
            </div>
            <div>
              <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center mb-3">
                <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-charcoal mb-1">One action, not a list</h3>
              <p className="text-xs text-warm-gray leading-relaxed">Every session ends with exactly one thing you can do today. Not ten.</p>
            </div>
            <div>
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center mb-3">
                <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-charcoal mb-1">Blunt, not diplomatic</h3>
              <p className="text-xs text-warm-gray leading-relaxed">Tasu tells you what's actually wrong. Sharp feedback, not reassurance.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-5 flex items-center justify-between max-w-5xl mx-auto w-full">
        <span className="text-xs text-warm-gray/50">© 2025 Tasu</span>
        <Link href="/privacy" className="text-xs text-warm-gray/50 hover:text-warm-gray transition-colors">
          Privacy
        </Link>
      </div>
    </div>
  );
}
