"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Logo SVG as inline component for crisp rendering at small sizes
function TasuLogo({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 500 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="107" y="107" width="286" height="286" rx="52" fill="#EDE7DF" />
      <rect x="124" y="124" width="252" height="252" rx="40" fill="#7D3C1A" transform="rotate(45 250 250)" />
      <rect x="150" y="150" width="200" height="200" rx="32" fill="#C75B30" transform="rotate(45 250 250)" />
      <rect x="179" y="179" width="142" height="142" rx="26" fill="#EDE7DF" transform="rotate(45 250 250)" />
    </svg>
  );
}

function DataSourcePill({ label, color }: { label: string; color: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full border ${color}`}>
      {label}
    </span>
  );
}

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
      <nav className="flex items-center justify-between px-6 sm:px-10 py-5 max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-2.5">
          <TasuLogo size={30} />
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
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-20 pt-6 text-center">

        {/* Data sources badge row */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-9 animate-fade-in">
          <DataSourcePill label="Revenue & traffic" color="bg-amber-50 text-amber-700 border-amber-200" />
          <DataSourcePill label="GitHub activity" color="bg-purple-50 text-purple-700 border-purple-200" />
          <DataSourcePill label="Founder playbooks" color="bg-cream text-warm-gray border-cream-dark" />
          <DataSourcePill label="Daily accountability" color="bg-terracotta/8 text-terracotta border-terracotta/20" />
        </div>

        {/* Logo mark */}
        <div className="mb-7 animate-fade-in-up">
          <TasuLogo size={72} />
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-bold text-charcoal leading-[1.07] tracking-tight mb-5 animate-fade-in-up max-w-2xl">
          Your co-founder.<br />
          <span className="text-terracotta">Connected to everything.</span>
        </h1>

        {/* Subheadline */}
        <p className="text-base sm:text-[1.1rem] text-warm-gray leading-relaxed mb-4 animate-fade-in-up animation-delay-100 max-w-xl">
          Not a chatbot. Tasu reads your revenue, traffic, and code pushes — correlates it all — and tells you exactly what to fix today.
        </p>
        <p className="text-sm text-warm-gray/70 leading-relaxed mb-10 animate-fade-in-up animation-delay-100 max-w-lg">
          Positioning problem? Distribution gap? Shipping hard but nothing's moving? Tasu diagnoses the real blocker at your current revenue level, and keeps you accountable every day.
        </p>

        {/* URL input */}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-lg animate-fade-in-up animation-delay-200"
        >
          <div className="bg-white rounded-2xl border border-cream-dark shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-1">
              <svg
                className="w-4 h-4 text-warm-gray/40 shrink-0"
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
          <p className="text-xs text-warm-gray/45 mt-3">
            Paste your website URL — Tasu reads your product in seconds
          </p>
        </form>

        {/* Social proof */}
        <div className="mt-10 animate-fade-in-up animation-delay-300">
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

      {/* What Tasu sees — data strip */}
      <div className="border-t border-cream-dark/60 bg-white/50">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <p className="text-xs font-semibold text-warm-gray uppercase tracking-wider text-center mb-6">
            What Tasu reads — every day
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Revenue & Traffic */}
            <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-cream-dark">
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-charcoal mb-0.5">Revenue & traffic</p>
                <p className="text-xs text-warm-gray leading-relaxed">via DataFast — MRR, visits, conversion rate, and where your best traffic actually comes from.</p>
              </div>
            </div>

            {/* GitHub */}
            <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-cream-dark">
              <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-charcoal mb-0.5">Code & shipping</p>
                <p className="text-xs text-warm-gray leading-relaxed">via GitHub — commit frequency, what you shipped this week, and whether velocity matches your growth goals.</p>
              </div>
            </div>

            {/* Knowledge */}
            <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-cream-dark">
              <div className="w-8 h-8 rounded-lg bg-terracotta/10 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-terracotta" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-charcoal mb-0.5">Founder playbooks</p>
                <p className="text-xs text-warm-gray leading-relaxed">The sharpest 2026 growth tactics — on positioning, distribution, and conversion — matched to your current revenue stage.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Value props */}
      <div className="border-t border-cream-dark/60">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center mb-3">
                <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-charcoal mb-1.5">Revenue-level aware</h3>
              <p className="text-xs text-warm-gray leading-relaxed">
                At $0, you need positioning. At $1k, conversion. At $10k, distribution. Tasu knows where you are and what moves the needle now.
              </p>
            </div>
            <div>
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center mb-3">
                <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-charcoal mb-1.5">One action, not a list</h3>
              <p className="text-xs text-warm-gray leading-relaxed">
                Every daily report ends with exactly one thing to do. Not a 10-step playbook. One sharp move correlated across all your data.
              </p>
            </div>
            <div>
              <div className="w-8 h-8 rounded-lg bg-terracotta/10 flex items-center justify-center mb-3">
                <svg className="w-4 h-4 text-terracotta" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-charcoal mb-1.5">Built-in accountability</h3>
              <p className="text-xs text-warm-gray leading-relaxed">
                Tasu sees what you shipped and what it produced. It calls out the gap between busy-work and actual progress — every single day.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-cream-dark/60 px-6 py-5 flex items-center justify-between max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <TasuLogo size={18} />
          <span className="text-xs text-warm-gray/50">© 2025 Tasu</span>
        </div>
        <Link href="/privacy" className="text-xs text-warm-gray/50 hover:text-warm-gray transition-colors">
          Privacy
        </Link>
      </div>
    </div>
  );
}
