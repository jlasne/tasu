"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

function AvatarRow() {
  const initials = ["JM", "SK", "AL", "RP", "ND", "BT", "CW"];
  return (
    <div className="flex items-center gap-3">
      <div className="flex -space-x-2">
        {initials.map((init) => (
          <div
            key={init}
            className="w-8 h-8 rounded-full bg-cream-dark border-2 border-cream flex items-center justify-center text-xs font-medium text-warm-gray"
          >
            {init}
          </div>
        ))}
      </div>
      <span className="text-sm text-warm-gray">
        Trusted by 50+ solo founders
      </span>
    </div>
  );
}

export default function LandingPage() {
  const [url, setUrl] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const encoded = encodeURIComponent(url.trim());
    router.push(url.trim() ? `/login?url=${encoded}` : "/login");
  }

  return (
    <div className="min-h-screen bg-cream relative overflow-hidden">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-terracotta flex items-center justify-center">
            <span className="text-white text-sm font-bold">T</span>
          </div>
          <span className="text-xl font-bold text-charcoal tracking-tight">
            tasu
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-charcoal hover:text-terracotta transition-colors px-4 py-2 rounded-full border border-cream-dark hover:border-terracotta/30"
          >
            Sign in
          </Link>
          <Link
            href="/login?mode=signup"
            className="text-sm font-medium text-white bg-charcoal hover:bg-charcoal/90 px-4 py-2 rounded-full transition-colors"
          >
            Sign up
          </Link>
        </div>
      </nav>

      {/* Floating cards - decorative, only on wide screens */}
      <div className="hidden 2xl:block pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        {/* Left card */}
        <div className="absolute top-40 left-12 animate-float-slow">
          <div className="bg-white rounded-2xl shadow-sm border border-cream-dark/40 p-4 w-60 rotate-[-2deg]">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-md bg-cream-dark flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-warm-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="text-xs font-medium text-warm-gray">Conversion analysis</span>
            </div>
            <p className="text-sm text-charcoal font-medium mb-1">
              Landing page gets 2.4k visits/mo
            </p>
            <p className="text-xs text-warm-gray">
              But only 1.2% convert. Fix positioning before spending more on distribution.
            </p>
            <div className="mt-3 flex items-center gap-1.5">
              <div className="h-1.5 flex-1 rounded-full bg-terracotta/20">
                <div className="h-full w-[12%] rounded-full bg-terracotta" />
              </div>
              <span className="text-[10px] text-warm-gray font-medium">1.2%</span>
            </div>
          </div>
        </div>

        {/* Right top card */}
        <div className="absolute top-36 right-12 animate-float-delayed">
          <div className="bg-white rounded-2xl shadow-sm border border-cream-dark/40 p-4 w-52 rotate-[1deg]">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-terracotta flex items-center justify-center">
                <span className="text-white text-[10px] font-bold">T</span>
              </div>
              <span className="text-xs font-medium text-charcoal">Tasu</span>
              <span className="ml-auto w-2 h-2 rounded-full bg-green-400" />
            </div>
            <p className="text-xs text-warm-gray leading-relaxed">
              &ldquo;Rewrite your hero headline to lead with the outcome, not the feature.&rdquo;
            </p>
          </div>
        </div>

        {/* Right bottom card */}
        <div className="absolute bottom-48 right-16 animate-float-slow">
          <div className="bg-amber-50 rounded-xl shadow-sm border border-amber-200/50 p-3 w-48 rotate-[2deg]">
            <p className="text-xs text-amber-800">
              <span className="font-semibold">Key insight:</span> No direct competitor in the local market
            </p>
          </div>
        </div>
      </div>

      {/* Hero - centered */}
      <main className="relative z-10 max-w-2xl mx-auto px-6 pt-20 sm:pt-28 pb-24 text-center">
        <div className="inline-flex items-center gap-2 bg-charcoal text-cream text-sm px-4 py-1.5 rounded-full mb-8 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-terracotta animate-pulse" />
          AI co-founder
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-charcoal leading-[1.1] tracking-tight mb-5 animate-fade-in-up">
          Make something people
          <br />
          actually want
        </h1>

        <p className="text-lg text-warm-gray leading-relaxed mb-10 animate-fade-in-up animation-delay-100 max-w-lg mx-auto">
          Research and grow your product with an AI co-founder who actually knows your numbers.
        </p>

        {/* URL Input - main CTA */}
        <form
          onSubmit={handleSubmit}
          className="animate-fade-in-up animation-delay-200"
        >
          <div className="bg-white rounded-2xl border border-cream-dark shadow-sm p-2 max-w-xl mx-auto">
            <div className="relative">
              <textarea
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder="Paste your website URL to get started..."
                rows={2}
                className="w-full px-4 pt-3 pb-10 text-charcoal placeholder:text-warm-gray/50 focus:outline-none resize-none text-[15px] bg-transparent rounded-xl"
              />
              <div className="absolute bottom-2 right-2">
                <button
                  type="submit"
                  className="w-9 h-9 rounded-full bg-terracotta hover:bg-terracotta-dark text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-6 mt-4">
            <Link
              href="/login"
              className="text-sm text-warm-gray hover:text-charcoal transition-colors flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
              Or start a conversation
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-warm-gray/60 hover:text-warm-gray transition-colors"
            >
              Privacy
            </Link>
          </div>
        </form>

        {/* Social proof */}
        <div className="mt-16 flex justify-center animate-fade-in-up animation-delay-300">
          <AvatarRow />
        </div>
      </main>

      {/* Bottom features */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-cream-dark/40 p-5 text-center hover:bg-white/80 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-terracotta/10 flex items-center justify-center mx-auto mb-3">
              <svg className="w-5 h-5 text-terracotta" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-charcoal mb-1">Real business context</h3>
            <p className="text-xs text-warm-gray">Tasu reads your landing page and learns your numbers. No generic advice.</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-cream-dark/40 p-5 text-center hover:bg-white/80 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center mx-auto mb-3">
              <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-charcoal mb-1">One concrete action</h3>
            <p className="text-xs text-warm-gray">Every session ends with something you can do today. Not a playbook.</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-cream-dark/40 p-5 text-center hover:bg-white/80 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-3">
              <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-charcoal mb-1">Knows your numbers</h3>
            <p className="text-xs text-warm-gray">Revenue-aware insights that push you toward your next milestone.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
