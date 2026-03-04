"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/* ────────────────────────────────────
   Shared components
   ──────────────────────────────────── */

function TasuLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="107" y="107" width="286" height="286" rx="52" fill="#EDE7DF" />
      <rect x="124" y="124" width="252" height="252" rx="40" fill="#7D3C1A" transform="rotate(45 250 250)" />
      <rect x="150" y="150" width="200" height="200" rx="32" fill="#C75B30" transform="rotate(45 250 250)" />
      <rect x="179" y="179" width="142" height="142" rx="26" fill="#EDE7DF" transform="rotate(45 250 250)" />
    </svg>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

/* ────────────────────────────────────
   Scroll reveal hook
   ──────────────────────────────────── */

function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ────────────────────────────────────
   Animated counter hook
   ──────────────────────────────────── */

function useCounter(target: number, duration = 1800, active = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setCount(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, target, duration]);
  return count;
}

/* ────────────────────────────────────
   FAQ Accordion
   ──────────────────────────────────── */

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-cream-dark last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className="text-sm font-medium text-charcoal group-hover:text-terracotta transition-colors pr-4">{q}</span>
        <svg
          className={`w-4 h-4 text-warm-gray shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-96 pb-5" : "max-h-0"}`}>
        <p className="text-sm text-warm-gray leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

/* ────────────────────────────────────
   Main landing page
   ──────────────────────────────────── */

export default function LandingPage() {
  const [url, setUrl] = useState("");
  const router = useRouter();

  const dashboard = useReveal(0.2);
  const integrations = useReveal(0.2);
  const howItWorks = useReveal(0.15);
  const dataSources = useReveal(0.15);
  const pricing = useReveal(0.15);
  const faq = useReveal(0.15);
  const finalCta = useReveal(0.2);

  const visitors = useCounter(2847, 2000, dashboard.visible);
  const revenue = useCounter(4218, 2200, dashboard.visible);
  const commits = useCounter(23, 1500, dashboard.visible);
  const convRate = useCounter(32, 1800, dashboard.visible);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = url.trim();
    const encoded = encodeURIComponent(trimmed);
    router.push(trimmed ? `/login?url=${encoded}&mode=signup` : "/login?mode=signup");
  }

  return (
    <div className="bg-cream">

      {/* ═══════════ NAV ═══════════ */}
      <nav className="sticky top-0 z-50 bg-cream/80 backdrop-blur-md border-b border-cream-dark/30">
        <div className="flex items-center justify-between px-6 sm:px-10 py-4 max-w-5xl mx-auto">
          <div className="flex items-center gap-2.5">
            <TasuLogo size={28} />
            <span className="text-lg font-bold text-charcoal tracking-tight">tasu</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login" className="text-sm text-warm-gray hover:text-charcoal transition-colors px-4 py-2 hidden sm:block">
              Sign in
            </Link>
            <Link
              href="/login?mode=signup"
              className="text-sm font-medium text-white bg-charcoal hover:bg-charcoal/85 px-4 py-2 rounded-full transition-all active:scale-[0.98]"
            >
              Get started free
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══════════ HERO ═══════════ */}
      <section className="px-6 pt-16 sm:pt-24 pb-20 text-center max-w-4xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-terracotta bg-terracotta/8 border border-terracotta/15 px-4 py-1.5 rounded-full mb-8 animate-fade-in">
          <span className="w-1.5 h-1.5 rounded-full bg-terracotta animate-pulse" />
          Your AI co-founder
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-[4rem] font-bold text-charcoal leading-[1.06] tracking-tight mb-6 animate-fade-in-up">
          Let&apos;s 10x your<br />
          revenue together
        </h1>

        {/* Subheadline */}
        <p className="text-base sm:text-lg text-warm-gray leading-relaxed mb-3 animate-fade-in-up animation-delay-100 max-w-2xl mx-auto">
          Not a chatbot — a real co-founder that reads your revenue, traffic, and GitHub pushes.
        </p>
        <p className="text-sm text-warm-gray/70 leading-relaxed mb-10 animate-fade-in-up animation-delay-200 max-w-xl mx-auto">
          Trained by successful founders like{" "}
          <a href="https://x.com/maraborealiss" target="_blank" rel="noopener noreferrer" className="text-charcoal font-medium hover:text-terracotta transition-colors">@marclou</a>,{" "}
          <a href="https://x.com/taborealiss" target="_blank" rel="noopener noreferrer" className="text-charcoal font-medium hover:text-terracotta transition-colors">@tibo_maker</a>,{" "}
          <a href="https://x.com/robj3d3" target="_blank" rel="noopener noreferrer" className="text-charcoal font-medium hover:text-terracotta transition-colors">@robj3d3</a>,{" "}
          <a href="https://x.com/romanbuildsaas" target="_blank" rel="noopener noreferrer" className="text-charcoal font-medium hover:text-terracotta transition-colors">@romanbuildsaas</a>{" "}
          and more.
        </p>

        {/* URL input */}
        <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto animate-fade-in-up animation-delay-300">
          <div className="bg-white rounded-2xl border border-cream-dark shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-1">
              <svg className="w-4 h-4 text-warm-gray/40 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
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
          <p className="text-xs text-warm-gray/45 mt-3">Free to start — no credit card required</p>
        </form>
      </section>

      {/* ═══════════ ANIMATED DASHBOARD MOCKUP ═══════════ */}
      <section className="px-6 pb-20">
        <div
          ref={dashboard.ref}
          className={`max-w-4xl mx-auto reveal-scale ${dashboard.visible ? "visible" : ""}`}
        >
          <div className="bg-white rounded-3xl border border-cream-dark shadow-lg overflow-hidden">
            {/* Mock header bar */}
            <div className="flex items-center gap-2 px-5 py-3 border-b border-cream-dark/60">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cream-dark" />
                <span className="w-2.5 h-2.5 rounded-full bg-cream-dark" />
                <span className="w-2.5 h-2.5 rounded-full bg-cream-dark" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-cream rounded-lg px-8 py-1 text-[10px] text-warm-gray/60 font-mono">tasu.ai/report</div>
              </div>
            </div>

            {/* Dashboard content */}
            <div className="p-6 sm:p-8">
              {/* Metric cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                <div className="bg-cream rounded-2xl p-4">
                  <p className="text-[10px] font-medium text-warm-gray uppercase tracking-wide mb-1">Visitors (30d)</p>
                  <p className="text-2xl font-bold text-charcoal">{visitors.toLocaleString()}</p>
                  <p className="text-[10px] text-green-600 font-medium mt-0.5">+12% vs last month</p>
                </div>
                <div className="bg-cream rounded-2xl p-4">
                  <p className="text-[10px] font-medium text-warm-gray uppercase tracking-wide mb-1">Revenue (30d)</p>
                  <p className="text-2xl font-bold text-charcoal">${revenue.toLocaleString()}</p>
                  <p className="text-[10px] text-green-600 font-medium mt-0.5">+8% MRR growth</p>
                </div>
                <div className="bg-cream rounded-2xl p-4">
                  <p className="text-[10px] font-medium text-warm-gray uppercase tracking-wide mb-1">Conversion</p>
                  <p className="text-2xl font-bold text-charcoal">{(convRate / 10).toFixed(1)}%</p>
                  <p className="text-[10px] text-amber-600 font-medium mt-0.5">Below target 5%</p>
                </div>
                <div className="bg-cream rounded-2xl p-4">
                  <p className="text-[10px] font-medium text-warm-gray uppercase tracking-wide mb-1">Commits (30d)</p>
                  <p className="text-2xl font-bold text-charcoal">{commits}</p>
                  <p className="text-[10px] text-green-600 font-medium mt-0.5">Active shipping</p>
                </div>
              </div>

              {/* Chart + AI insight */}
              <div className="grid sm:grid-cols-5 gap-6">
                {/* Mini bar chart */}
                <div className="sm:col-span-3 bg-cream rounded-2xl p-5">
                  <p className="text-[10px] font-medium text-warm-gray uppercase tracking-wide mb-4">Daily visitors</p>
                  <div className="flex items-end gap-1.5 h-24">
                    {[35, 42, 28, 55, 68, 45, 72, 88, 62, 95, 78, 110, 85, 92].map((h, i) => (
                      <div
                        key={i}
                        className={`flex-1 rounded-t-sm transition-all duration-500 ${dashboard.visible ? "" : "!h-0"}`}
                        style={{
                          height: dashboard.visible ? `${(h / 110) * 100}%` : "0%",
                          backgroundColor: i >= 11 ? "#C75B30" : "#D4CFC7",
                          transitionDelay: `${i * 80}ms`,
                        }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-[9px] text-warm-gray/50">2 weeks ago</span>
                    <span className="text-[9px] text-warm-gray/50">Today</span>
                  </div>
                </div>

                {/* AI insight */}
                <div className="sm:col-span-2 bg-charcoal rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <TasuLogo size={20} />
                      <span className="text-[10px] font-medium text-white/60 uppercase tracking-wide">Tasu says</span>
                    </div>
                    <p className="text-sm text-white/90 leading-relaxed">
                      Your traffic is growing but conversion is stuck at 3.2%. <strong className="text-terracotta">Focus on your hero copy today</strong> — 83% bounce rate signals a positioning problem, not a traffic one.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <span className="text-[10px] text-terracotta font-medium bg-terracotta/15 px-2 py-0.5 rounded-full">positioning</span>
                    <span className="text-[10px] text-white/40">Just now</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ INTEGRATION LOGOS ═══════════ */}
      <section className="px-6 pb-20">
        <div
          ref={integrations.ref}
          className={`max-w-3xl mx-auto text-center reveal ${integrations.visible ? "visible" : ""}`}
        >
          <p className="text-xs font-semibold text-warm-gray uppercase tracking-wider mb-8">Connected to your tools</p>
          <div className="flex items-center justify-center gap-6 sm:gap-10 flex-wrap">
            {/* DataFast */}
            <div className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-white border border-cream-dark flex items-center justify-center group-hover:border-amber-300 transition-colors">
                <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-charcoal">DataFast</p>
                <p className="text-[10px] text-warm-gray">Traffic & Revenue</p>
              </div>
            </div>

            <span className="text-cream-dark text-xl hidden sm:block">+</span>

            {/* Stripe / Payments */}
            <div className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-white border border-cream-dark flex items-center justify-center group-hover:border-purple-300 transition-colors">
                <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-charcoal">Stripe</p>
                <p className="text-[10px] text-warm-gray">via DataFast</p>
              </div>
            </div>

            <span className="text-cream-dark text-xl hidden sm:block">+</span>

            {/* GitHub */}
            <div className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-white border border-cream-dark flex items-center justify-center group-hover:border-charcoal/30 transition-colors">
                <GitHubIcon className="w-5 h-5 text-charcoal" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-charcoal">GitHub</p>
                <p className="text-[10px] text-warm-gray">Shipping Activity</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ HOW IT WORKS ═══════════ */}
      <section className="px-6 pb-20 border-t border-cream-dark/60 pt-16">
        <div
          ref={howItWorks.ref}
          className={`max-w-4xl mx-auto stagger-children ${howItWorks.visible ? "visible" : ""}`}
        >
          <p className="text-xs font-semibold text-warm-gray uppercase tracking-wider text-center mb-10">How it works</p>
          <div className="grid sm:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-terracotta/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-lg font-bold text-terracotta">1</span>
              </div>
              <h3 className="text-base font-semibold text-charcoal mb-2">Connect your data</h3>
              <p className="text-sm text-warm-gray leading-relaxed">Link your DataFast analytics and GitHub repo. Tasu reads your revenue, traffic, and code pushes automatically.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-terracotta/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-lg font-bold text-terracotta">2</span>
              </div>
              <h3 className="text-base font-semibold text-charcoal mb-2">Get your daily report</h3>
              <p className="text-sm text-warm-gray leading-relaxed">Every day, Tasu correlates all your data and diagnoses the one thing holding you back — positioning, conversion, or distribution.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-terracotta/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-lg font-bold text-terracotta">3</span>
              </div>
              <h3 className="text-base font-semibold text-charcoal mb-2">Execute and grow</h3>
              <p className="text-sm text-warm-gray leading-relaxed">One sharp action per day. Mark it done. Tasu tracks your execution and adjusts its advice as your business evolves.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ WHAT TASU READS ═══════════ */}
      <section className="bg-white/60 border-t border-cream-dark/60 px-6 py-16">
        <div
          ref={dataSources.ref}
          className={`max-w-4xl mx-auto stagger-children ${dataSources.visible ? "visible" : ""}`}
        >
          <p className="text-xs font-semibold text-warm-gray uppercase tracking-wider text-center mb-3">What Tasu reads — every day</p>
          <p className="text-center text-sm text-warm-gray mb-10 max-w-md mx-auto">All correlated together to give you one sharp decision.</p>
          <div className="grid sm:grid-cols-3 gap-5">
            <div className="bg-white rounded-2xl border border-cream-dark p-6 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-charcoal mb-1.5">Revenue & traffic</h3>
              <p className="text-xs text-warm-gray leading-relaxed">MRR, visitor count, conversion rate, bounce rate, and where your best traffic actually comes from — all via DataFast.</p>
            </div>
            <div className="bg-white rounded-2xl border border-cream-dark p-6 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center mb-4">
                <GitHubIcon className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-sm font-semibold text-charcoal mb-1.5">Code & shipping</h3>
              <p className="text-xs text-warm-gray leading-relaxed">Commit frequency, what you shipped this week, and whether your velocity matches your revenue goals.</p>
            </div>
            <div className="bg-white rounded-2xl border border-cream-dark p-6 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-terracotta/10 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-terracotta" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-charcoal mb-1.5">Founder playbooks</h3>
              <p className="text-xs text-warm-gray leading-relaxed">The sharpest 2026 growth tactics on positioning, distribution, and conversion — matched to your current revenue stage.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ PRICING ═══════════ */}
      <section className="border-t border-cream-dark/60 px-6 py-16">
        <div
          ref={pricing.ref}
          className={`max-w-4xl mx-auto reveal ${pricing.visible ? "visible" : ""}`}
        >
          <p className="text-xs font-semibold text-warm-gray uppercase tracking-wider text-center mb-3">Pricing</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-charcoal text-center mb-3">Start free. Scale when you&apos;re ready.</h2>
          <p className="text-sm text-warm-gray text-center mb-10 max-w-md mx-auto">No credit card required. Upgrade when Tasu starts making you real money.</p>

          <div className="grid sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
            {/* Free */}
            <div className="bg-white rounded-2xl border border-cream-dark p-6">
              <p className="text-xs font-semibold text-warm-gray uppercase tracking-wide mb-1">Starter</p>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-bold text-charcoal">$0</span>
                <span className="text-sm text-warm-gray">/month</span>
              </div>
              <ul className="space-y-2.5 mb-6">
                {["Chat with your AI co-founder", "Website URL analysis", "3 reports per month", "Basic founder knowledge"].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-warm-gray">
                    <svg className="w-4 h-4 text-green-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/login?mode=signup"
                className="block text-center text-sm font-medium text-charcoal border border-cream-dark hover:border-charcoal/30 py-2.5 rounded-xl transition-all"
              >
                Get started free
              </Link>
            </div>

            {/* Pro */}
            <div className="bg-white rounded-2xl border-2 border-terracotta/30 p-6 relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white bg-terracotta px-3 py-0.5 rounded-full uppercase tracking-wider">
                Recommended
              </span>
              <p className="text-xs font-semibold text-terracotta uppercase tracking-wide mb-1">Pro</p>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-bold text-charcoal">$29</span>
                <span className="text-sm text-warm-gray">/month</span>
              </div>
              <ul className="space-y-2.5 mb-6">
                {[
                  "Everything in Starter",
                  "DataFast integration (revenue + traffic)",
                  "GitHub integration (shipping activity)",
                  "Unlimited daily reports",
                  "Daily email accountability reports",
                  "Full 2026 founder playbooks",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-charcoal">
                    <svg className="w-4 h-4 text-terracotta mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/login?mode=signup"
                className="block text-center text-sm font-medium text-white bg-terracotta hover:bg-terracotta-dark py-2.5 rounded-xl transition-all active:scale-[0.98]"
              >
                Start Pro — 7 day free trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ FAQ ═══════════ */}
      <section className="bg-white/60 border-t border-cream-dark/60 px-6 py-16">
        <div
          ref={faq.ref}
          className={`max-w-2xl mx-auto reveal ${faq.visible ? "visible" : ""}`}
        >
          <p className="text-xs font-semibold text-warm-gray uppercase tracking-wider text-center mb-3">FAQ</p>
          <h2 className="text-2xl font-bold text-charcoal text-center mb-8">Got questions?</h2>
          <div className="bg-white rounded-2xl border border-cream-dark px-6">
            <FAQItem
              q="What exactly is Tasu?"
              a="Tasu is an AI co-founder that connects to your real business data — revenue (via DataFast), traffic, and GitHub activity — and gives you one sharp action per day. It's not a generic chatbot. It's a co-founder that knows your numbers."
            />
            <FAQItem
              q="How does Tasu read my revenue?"
              a="Through DataFast, which connects to your payment provider (Stripe, Lemon Squeezy, etc.) and your analytics. Tasu reads your MRR, visitor count, conversion rate, and traffic sources. Your API key stays encrypted and is never exposed."
            />
            <FAQItem
              q="Do I need DataFast?"
              a="DataFast is strongly recommended for the best experience — it's how Tasu gets your revenue and traffic data. If you don't have it yet, you can sign up at datafa.st and connect it in Settings. Tasu still works without it, but the advice will be less data-driven."
            />
            <FAQItem
              q="Is my data safe?"
              a="Yes. API keys are stored encrypted in Supabase with Row Level Security. Tasu reads your data but never writes to your payment provider or GitHub. All data stays on your account."
            />
            <FAQItem
              q="Can I use Tasu without GitHub?"
              a="Absolutely. GitHub is optional — it helps Tasu track your shipping velocity and keep you accountable. Without it, Tasu focuses on your revenue and traffic data instead."
            />
            <FAQItem
              q="Who are the founders that trained Tasu?"
              a="Tasu's knowledge base is built from real growth strategies used by successful solo founders and indie makers. The tactics are battle-tested, not theoretical — focused on positioning, distribution, and conversion at every revenue stage."
            />
          </div>
        </div>
      </section>

      {/* ═══════════ FINAL CTA ═══════════ */}
      <section className="border-t border-cream-dark/60 px-6 py-20">
        <div
          ref={finalCta.ref}
          className={`max-w-xl mx-auto text-center reveal-scale ${finalCta.visible ? "visible" : ""}`}
        >
          <TasuLogo size={52} />
          <h2 className="text-2xl sm:text-3xl font-bold text-charcoal mt-5 mb-3">
            Ready to stop guessing?
          </h2>
          <p className="text-sm text-warm-gray mb-8 max-w-md mx-auto leading-relaxed">
            Your co-founder is waiting. Paste your URL, connect your data, and wake up every morning knowing exactly what to do.
          </p>
          <Link
            href="/login?mode=signup"
            className="inline-flex items-center gap-2 text-sm font-medium text-white bg-charcoal hover:bg-charcoal/85 px-6 py-3 rounded-full transition-all active:scale-[0.98]"
          >
            Get started free
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <div className="border-t border-cream-dark/60 px-6 py-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <TasuLogo size={18} />
            <span className="text-xs text-warm-gray/50">&copy; 2025 Tasu. Your AI co-founder.</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-xs text-warm-gray/50 hover:text-warm-gray transition-colors">Privacy</Link>
            <a href="https://x.com/tasu_ai" target="_blank" rel="noopener noreferrer" className="text-xs text-warm-gray/50 hover:text-warm-gray transition-colors">Twitter</a>
          </div>
        </div>
      </div>
    </div>
  );
}
