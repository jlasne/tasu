"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/* ── Logo ── */
function TasuLogo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="85" y="85" width="330" height="330" rx="56" fill="#7B2C0E" transform="rotate(45 250 250)"/>
      <rect x="130" y="130" width="240" height="240" rx="40" fill="#C2581C" transform="rotate(45 250 250)"/>
      <rect x="178" y="178" width="144" height="144" rx="28" fill="#EDE7DF" transform="rotate(45 250 250)"/>
    </svg>
  );
}

/* ── Scroll reveal hook ── */
function useReveal(threshold = 0.12) {
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

/* ── FAQ ── */
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#E8E0D8] last:border-0">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-5 text-left gap-4">
        <span className="text-[15px] font-medium text-charcoal">{q}</span>
        <svg className={`w-5 h-5 text-warm-gray shrink-0 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-64 pb-5" : "max-h-0"}`}>
        <p className="text-sm text-warm-gray leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

/* ── Plan card ── */
function PlanCard({
  name, price, launchPrice, period = "/mo", description, features, cta, highlighted = false, badge,
}: {
  name: string; price: string; launchPrice?: string; period?: string; description: string;
  features: string[]; cta: string; highlighted?: boolean; badge?: string;
}) {
  return (
    <div className={`relative rounded-3xl p-8 flex flex-col ${
      highlighted ? "bg-charcoal text-cream shadow-2xl scale-[1.03]" : "bg-white border border-[#E8E0D8]"
    }`}>
      {badge && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="bg-terracotta text-white text-[11px] font-semibold px-4 py-1.5 rounded-full whitespace-nowrap">{badge}</span>
        </div>
      )}
      <div className="mb-6">
        <p className={`text-xs font-semibold uppercase tracking-widest mb-2 ${highlighted ? "text-cream/60" : "text-warm-gray"}`}>{name}</p>
        <div className="flex items-end gap-2">
          {launchPrice ? (
            <>
              <span className={`text-4xl font-bold ${highlighted ? "text-cream" : "text-charcoal"}`}>{launchPrice}</span>
              <span className={`text-lg line-through mb-1 ${highlighted ? "text-cream/30" : "text-warm-gray/40"}`}>{price}</span>
              <span className={`text-sm mb-1 ${highlighted ? "text-cream/60" : "text-warm-gray"}`}>{period}</span>
            </>
          ) : (
            <>
              <span className={`text-4xl font-bold ${highlighted ? "text-cream" : "text-charcoal"}`}>{price}</span>
              <span className={`text-sm mb-1 ${highlighted ? "text-cream/60" : "text-warm-gray"}`}>{period}</span>
            </>
          )}
        </div>
        <p className={`text-sm mt-2 leading-relaxed ${highlighted ? "text-cream/70" : "text-warm-gray"}`}>{description}</p>
      </div>
      <ul className="space-y-3 flex-1 mb-8">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-sm">
            <svg className="w-4 h-4 mt-0.5 shrink-0 text-terracotta" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            <span className={highlighted ? "text-cream/80" : "text-charcoal"}>{f}</span>
          </li>
        ))}
      </ul>
      <Link
        href="/login"
        className={`block text-center py-3.5 rounded-xl font-semibold text-sm transition-all ${
          highlighted
            ? "bg-terracotta hover:bg-terracotta-dark text-white"
            : "bg-cream hover:bg-cream-dark text-charcoal border border-[#E8E0D8]"
        }`}
      >
        {cta}
      </Link>
    </div>
  );
}

export default function LandingPage() {
  const heroReveal = useReveal(0);
  const whyReveal = useReveal(0.1);
  const howReveal = useReveal(0.1);
  const socialReveal = useReveal(0.1);
  const pricingReveal = useReveal(0.1);
  const faqReveal = useReveal(0.1);

  return (
    <div className="min-h-screen text-charcoal font-sans">

      {/* ── Dot grid background (aicofounder style) ── */}
      <div className="fixed inset-0 -z-10" style={{
        backgroundColor: "#F5F0EA",
        backgroundImage: "radial-gradient(circle, #c8c5be 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }} />

      {/* ── Nav ── */}
      <header className="sticky top-0 z-50 backdrop-blur-xl border-b border-[#E8E0D8]/60" style={{ backgroundColor: "rgba(245,240,234,0.85)" }}>
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <TasuLogo size={32} />
            <span className="text-lg font-bold tracking-tight text-charcoal">tasu</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-warm-gray hover:text-charcoal transition-colors font-medium hidden sm:block">
              Sign in
            </Link>
            <Link
              href="/login?mode=signup"
              className="bg-charcoal hover:bg-charcoal/90 text-cream text-sm font-semibold px-5 py-2.5 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Request access
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="max-w-5xl mx-auto px-5 pt-24 pb-20 text-center" ref={heroReveal.ref}>
        <div className={`transition-all duration-700 ${heroReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>

          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-[#E8E0D8] rounded-full px-4 py-2 mb-8 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-terracotta animate-pulse" />
            <span className="text-xs font-semibold text-charcoal tracking-wide uppercase">Your Co-Founder Agent</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.05] tracking-tight text-charcoal mb-6">
            Grow like a founder<br />
            <span className="bg-gradient-to-r from-terracotta to-[#E8943A] bg-clip-text text-transparent">who already made it.</span>
          </h1>

          <p className="text-lg sm:text-xl text-warm-gray leading-relaxed max-w-2xl mx-auto mb-3">
            Trained on successful makers, Tasu reads your business, revenue, traffic, and code — so it actually makes you grow.
          </p>

          <p className="text-base text-charcoal/70 max-w-xl mx-auto mb-4 font-medium">
            Claude reads code. Tasu reads business.
          </p>

          <p className="text-sm text-warm-gray/70 max-w-lg mx-auto mb-10">
            Your data, your stage, one agent aligning everything toward your next MRR jump.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login?mode=signup"
              className="bg-gradient-to-r from-terracotta to-[#D4722A] hover:from-terracotta-dark hover:to-terracotta text-white font-semibold px-8 py-4 rounded-xl text-base transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-terracotta/20"
            >
              Start growing now
            </Link>
            <p className="text-xs text-warm-gray/60">No credit card required</p>
          </div>
        </div>
      </section>

      {/* ── How It Reads You ── */}
      <section className="max-w-7xl mx-auto px-4 py-24" ref={howReveal.ref}>
        <div className={`transition-all duration-700 ${howReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>

          <div className="mb-12 flex w-full flex-col text-center md:mb-20">
            <p className="mb-3 text-sm font-medium uppercase tracking-wider text-terracotta">How It Reads You</p>
            <h2 className="mx-auto text-3xl font-extrabold tracking-tight text-charcoal md:text-5xl">Grow your revenue in 3 steps</h2>
          </div>

          {/* Cards row */}
          <div className="flex flex-col justify-center gap-6 max-lg:items-center lg:flex-row">

            {/* Card 1 */}
            <div className={`rounded-[1.3rem] border border-[#E8E0D8] bg-white/60 backdrop-blur-sm p-1.5 transition-all duration-500 ${howReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`} style={{ transitionDelay: "0ms" }}>
              <div className="mx-auto w-full max-w-lg rounded-2xl bg-white overflow-hidden shadow-sm">
                <div className="relative h-48 bg-[#FAF7F3] flex items-center justify-center p-6">
                  <div className="w-full bg-white rounded-xl border border-[#E8E0D8] overflow-hidden shadow-sm">
                    <div className="flex items-center gap-1.5 px-3 pt-3 pb-2 border-b border-[#E8E0D8]">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-400/40" />
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/40" />
                      <span className="w-2.5 h-2.5 rounded-full bg-green-400/40" />
                    </div>
                    <div className="px-4 py-3 font-mono text-xs space-y-1">
                      <p className="text-charcoal/40">{"<script"}</p>
                      <p className="pl-3 text-green-700/70">{"defer"}</p>
                      <p className="pl-3"><span className="text-blue-700/60">data-domain</span><span className="text-charcoal/30">{"=\""}</span><span className="text-terracotta">yoursite.com</span><span className="text-charcoal/30">{"\""}</span></p>
                      <p className="pl-3"><span className="text-blue-700/60">src</span><span className="text-charcoal/30">{"=\""}</span><span className="text-terracotta">tasu.ai/js</span><span className="text-charcoal/30">{"\""}</span></p>
                      <p className="text-charcoal/40">{"</script>"}</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-charcoal mb-1.5">1. Drop your business</h3>
                  <p className="text-sm text-warm-gray leading-relaxed">Share your website so Tasu can understand your audience, value props, and market position.</p>
                </div>
              </div>
            </div>

            {/* Arrow 1 */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="text-warm-gray/40 mx-auto w-6 shrink-0 max-lg:rotate-90">
              <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
            </svg>

            {/* Card 2 */}
            <div className={`rounded-[1.3rem] border border-[#E8E0D8] bg-white/60 backdrop-blur-sm p-1.5 transition-all duration-500 ${howReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`} style={{ transitionDelay: "150ms" }}>
              <div className="mx-auto w-full max-w-lg rounded-2xl bg-white overflow-hidden shadow-sm">
                <div className="relative h-48 bg-[#FAF7F3] flex items-center justify-center p-6">
                  <div className="grid grid-cols-2 gap-3 w-full max-w-[200px]">
                    {[
                      { name: "Stripe", color: "bg-[#635BFF]", icon: "S" },
                      { name: "DataFast", color: "bg-[#E8943A]", icon: "D" },
                      { name: "GitHub", color: "bg-[#24292E]", icon: "G" },
                      { name: "Analytics", color: "bg-[#4285F4]", icon: "A" },
                    ].map((int) => (
                      <div key={int.name} className="bg-white rounded-xl p-3 flex flex-col items-center gap-1.5 border border-[#E8E0D8] shadow-sm">
                        <div className={`w-8 h-8 rounded-lg ${int.color} flex items-center justify-center`}>
                          <span className="text-white text-xs font-bold">{int.icon}</span>
                        </div>
                        <span className="text-[10px] text-warm-gray font-medium">{int.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-charcoal mb-1.5">2. Connect your data</h3>
                  <p className="text-sm text-warm-gray leading-relaxed">Link your revenue, traffic, and code activity so Tasu pinpoints exactly where growth is blocked.</p>
                </div>
              </div>
            </div>

            {/* Arrow 2 */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="text-warm-gray/40 mx-auto w-6 shrink-0 max-lg:rotate-90">
              <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
            </svg>

            {/* Card 3 */}
            <div className={`rounded-[1.3rem] border border-[#E8E0D8] bg-white/60 backdrop-blur-sm p-1.5 transition-all duration-500 ${howReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`} style={{ transitionDelay: "300ms" }}>
              <div className="mx-auto w-full max-w-lg rounded-2xl bg-white overflow-hidden shadow-sm">
                <div className="relative h-48 bg-[#FAF7F3] flex items-center justify-center p-4">
                  <div className="w-full bg-white rounded-xl border border-[#E8E0D8] p-3 shadow-sm">
                    <div className="flex justify-between items-center mb-3 px-1">
                      <span className="text-[10px] text-warm-gray font-medium">Source</span>
                      <span className="text-[10px] text-warm-gray font-medium">Revenue</span>
                    </div>
                    {[
                      { source: "Direct", bar: 72, revenue: "$1.2k", focus: false },
                      { source: "Google", bar: 48, revenue: "$798", focus: true },
                      { source: "Twitter/X", bar: 30, revenue: "$498", focus: false },
                      { source: "Product Hunt", bar: 18, revenue: "$210", focus: false },
                    ].map((row) => (
                      <div key={row.source} className={`flex items-center gap-2 py-1.5 px-1 rounded-lg ${row.focus ? "bg-terracotta/5" : ""}`}>
                        <span className="text-[11px] text-charcoal/60 w-24 shrink-0">{row.source}</span>
                        <div className="flex-1 h-1.5 bg-[#F0EAE2] rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${row.focus ? "bg-terracotta" : "bg-charcoal/15"}`} style={{ width: `${row.bar}%` }} />
                        </div>
                        <span className={`text-[11px] font-semibold shrink-0 w-10 text-right ${row.focus ? "text-terracotta" : "text-charcoal/50"}`}>{row.revenue}</span>
                        {row.focus && <span className="text-[9px] bg-terracotta text-white px-1.5 py-0.5 rounded font-bold shrink-0">Focus</span>}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-charcoal mb-1.5">3. Grow your revenue</h3>
                  <p className="text-sm text-warm-gray leading-relaxed">Execute stage-based strategies that move the needle, then watch your revenue explode.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── "Why don't you grow?" ── */}
      <section className="max-w-5xl mx-auto px-5 py-28" ref={whyReveal.ref}>
        <div className={`transition-all duration-700 ${whyReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest text-warm-gray/50 mb-3">Signal over noise</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-charcoal mb-4">{`"Why don't you grow?"`}</h2>
            <p className="text-base text-warm-gray max-w-2xl mx-auto leading-relaxed">
              {`You've watched other founders blow up while you're stuck tweaking your landing page again. Tasu ends the guessing game — shows why growth isn't happening, and how to fix it.`}
            </p>
          </div>

          {/* Bento grid */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            {/* Large card - Traffic */}
            <div className={`md:col-span-4 relative bg-white/80 backdrop-blur-sm rounded-2xl border border-[#E8E0D8] p-7 overflow-hidden group hover:shadow-lg transition-all duration-300 ${whyReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`} style={{ transitionDelay: "0ms" }}>
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-t-2xl" />
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" /></svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-charcoal mb-2">10x your traffic quality</h3>
                  <p className="text-sm text-warm-gray leading-relaxed">Tasu reads sources, spots leaks, and reroutes your efforts to high-converting channels — no more wasted spend on dead-end visitors.</p>
                </div>
              </div>
            </div>

            {/* Tall card - Scale */}
            <div className={`md:col-span-2 md:row-span-2 relative bg-white/80 backdrop-blur-sm rounded-2xl border border-[#E8E0D8] p-7 overflow-hidden group hover:shadow-lg transition-all duration-300 flex flex-col ${whyReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`} style={{ transitionDelay: "80ms" }}>
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-400 rounded-t-2xl" />
              <div className="w-10 h-10 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center shrink-0 mb-4">
                <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>
              </div>
              <h3 className="text-lg font-semibold text-charcoal mb-2">Scale to $10k MRR</h3>
              <p className="text-sm text-warm-gray leading-relaxed flex-1">Matches your exact stage to proven strategies from @marclou, @tibo_maker, @levelsio and more. No generic playbook — real moves that worked at your revenue level.</p>
              <div className="mt-4 flex items-center gap-2">
                <div className="h-2 flex-1 bg-[#F0EAE2] rounded-full overflow-hidden"><div className="h-full w-3/4 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full" /></div>
                <span className="text-xs font-semibold text-green-600">$7.5k</span>
              </div>
            </div>

            {/* Two medium cards */}
            <div className={`md:col-span-2 relative bg-white/80 backdrop-blur-sm rounded-2xl border border-[#E8E0D8] p-7 overflow-hidden group hover:shadow-lg transition-all duration-300 ${whyReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`} style={{ transitionDelay: "160ms" }}>
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-400 rounded-t-2xl" />
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0 mb-3">
                <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-base font-semibold text-charcoal mb-1">Double your conversions</h3>
              <p className="text-sm text-warm-gray leading-relaxed">Analyzes customer paths and pricing to unlock hidden revenue fast.</p>
            </div>

            <div className={`md:col-span-2 relative bg-white/80 backdrop-blur-sm rounded-2xl border border-[#E8E0D8] p-7 overflow-hidden group hover:shadow-lg transition-all duration-300 ${whyReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`} style={{ transitionDelay: "240ms" }}>
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-violet-400 rounded-t-2xl" />
              <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0 mb-3">
                <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /></svg>
              </div>
              <h3 className="text-base font-semibold text-charcoal mb-1">Ship features that stick</h3>
              <p className="text-sm text-warm-gray leading-relaxed">Tracks your code deploys and predicts what drives retention and growth.</p>
            </div>

            {/* Bottom row */}
            <div className={`md:col-span-3 relative bg-white/80 backdrop-blur-sm rounded-2xl border border-[#E8E0D8] p-7 overflow-hidden group hover:shadow-lg transition-all duration-300 ${whyReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`} style={{ transitionDelay: "320ms" }}>
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-rose-400 rounded-t-2xl" />
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" /></svg>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-charcoal mb-1">End $0 launches</h3>
                  <p className="text-sm text-warm-gray leading-relaxed">Delivers stage-specific fixes so you act on real blockers, not generic noise.</p>
                </div>
              </div>
            </div>

            <div className={`md:col-span-3 relative bg-white/80 backdrop-blur-sm rounded-2xl border border-[#E8E0D8] p-7 overflow-hidden group hover:shadow-lg transition-all duration-300 ${whyReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`} style={{ transitionDelay: "400ms" }}>
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-terracotta to-[#E8943A] rounded-t-2xl" />
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-terracotta" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-charcoal mb-1">Reach milestones faster</h3>
                  <p className="text-sm text-warm-gray leading-relaxed">Your AI co-founder evolves with your data for precision and clarity that compounds.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Scrolling founders strip (aicofounder-style carousel) ── */}
      <section className="border-y border-[#E8E0D8] overflow-hidden py-16 bg-white/60 backdrop-blur-sm" ref={socialReveal.ref}>
        <div className={`transition-all duration-700 ${socialReveal.visible ? "opacity-100" : "opacity-0"}`}>
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-warm-gray/50 mb-8">Trained on strategies from proven makers</p>

          {/* Scrolling carousel */}
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white/60 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white/60 to-transparent z-10 pointer-events-none" />
            <div className="flex gap-6 animate-[scrollLeft_20s_linear_infinite]">
              {[...Array(2)].map((_, rep) => (
                <div key={rep} className="flex gap-6 shrink-0">
                  {[
                    { name: "@marclou", desc: "ShipFast, $300k+ MRR" },
                    { name: "@tibo_maker", desc: "Tweethunter, acquired" },
                    { name: "@robj3d3", desc: "Indie hacker, multi-exit" },
                    { name: "@romanbuildsaas", desc: "SaaS growth strategies" },
                    { name: "@levelsio", desc: "NomadList, PhotoAI" },
                    { name: "@thepatwalls", desc: "Starter Story, $1M+ ARR" },
                  ].map((founder) => (
                    <div key={`${rep}-${founder.name}`} className="flex items-center gap-3 bg-white rounded-xl border border-[#E8E0D8] px-5 py-3 shrink-0 shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-terracotta/20 to-terracotta/5 flex items-center justify-center text-xs font-bold text-terracotta">
                        {founder.name.slice(1, 3).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-charcoal">{founder.name}</p>
                        <p className="text-[11px] text-warm-gray">{founder.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="max-w-2xl mx-auto mt-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[#E8E0D8] p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="shrink-0 mt-0.5"><TasuLogo size={28} /></div>
                <div>
                  <p className="text-sm font-semibold text-charcoal mb-1">Built on real playbooks</p>
                  <p className="text-sm text-warm-gray leading-relaxed">
                    Tasu learns what actually worked for them at every growth stage and adapts it to <span className="text-charcoal font-medium">your</span> business. Growth systems, decision models, and tested sequences — not generic advice.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Connected to your tools (logo cloud) ── */}
      <section className="py-16">
        <div className="relative mx-auto max-w-3xl px-4">
          <h2 className="mb-6 text-center font-medium text-lg text-warm-gray tracking-tight md:text-2xl">
            Connected to your <span className="font-semibold text-charcoal">tools</span>
          </h2>
          <div className="relative grid grid-cols-2 md:grid-cols-3 border-x border-[#E8E0D8]">
            {/* Full-width top border */}
            <div className="absolute left-1/2 -translate-x-1/2 -top-px w-screen border-t border-[#E8E0D8] pointer-events-none" />

            {/* Row 1 */}
            <div className="relative flex items-center justify-center bg-[#F0EAE2] px-4 py-8 md:p-8 border-r border-b border-[#E8E0D8]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="GitHub" className="pointer-events-none h-5 md:h-6 select-none brightness-0 opacity-50" src="https://svgl.app/library/github_wordmark_light.svg" />
              <svg className="absolute -right-[12.5px] -bottom-[12.5px] z-10 w-6 h-6 text-[#D5CEC6]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1}><path d="M12 5v14m-7-7h14" /></svg>
            </div>
            <div className="flex items-center justify-center px-4 py-8 md:p-8 border-b border-[#E8E0D8] md:border-r">
              <span className="text-base md:text-lg font-bold tracking-tight text-charcoal/50 select-none">DataFast</span>
            </div>
            <div className="relative flex items-center justify-center bg-[#F0EAE2] px-4 py-8 md:p-8 border-r border-b border-[#E8E0D8] md:border-r-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="Claude" className="pointer-events-none h-5 md:h-6 select-none brightness-0 opacity-50" src="https://svgl.app/library/claude-ai-wordmark-icon_light.svg" />
              <svg className="absolute -right-[12.5px] -bottom-[12.5px] z-10 hidden w-6 h-6 text-[#D5CEC6] md:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1}><path d="M12 5v14m-7-7h14" /></svg>
              <svg className="absolute -left-[12.5px] -bottom-[12.5px] z-10 hidden w-6 h-6 text-[#D5CEC6] md:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1}><path d="M12 5v14m-7-7h14" /></svg>
            </div>

            {/* Row 2 */}
            <div className="relative flex items-center justify-center px-4 py-8 md:p-8 border-r border-[#E8E0D8] md:border-b-0 border-b md:bg-transparent bg-[#F0EAE2]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="OpenAI" className="pointer-events-none h-5 md:h-6 select-none brightness-0 opacity-50" src="https://svgl.app/library/openai_wordmark_light.svg" />
            </div>
            <div className="relative flex items-center justify-center px-4 py-8 md:p-8 border-[#E8E0D8] md:border-r md:bg-[#F0EAE2] border-b md:border-b-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="Stripe" className="pointer-events-none h-5 md:h-6 select-none brightness-0 opacity-50" src="https://svgl.app/library/stripe-wordmark-slate.svg" />
            </div>
            <div className="flex items-center justify-center bg-[#F0EAE2] md:bg-transparent px-4 py-8 md:p-8 border-r border-[#E8E0D8] md:border-r-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="Vercel" className="pointer-events-none h-4 md:h-5 select-none brightness-0 opacity-50" src="https://svgl.app/library/vercel_wordmark.svg" />
            </div>

            {/* Full-width bottom border */}
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-px w-screen border-b border-[#E8E0D8] pointer-events-none" />
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="py-28 px-5" ref={pricingReveal.ref}>
        <div className={`max-w-4xl mx-auto transition-all duration-700 ${pricingReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-[#E8E0D8] rounded-full px-3 py-1.5 mb-4 shadow-sm">
              <svg className="w-3.5 h-3.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              <span className="text-xs font-semibold text-charcoal">Read-only access. Your data stays yours.</span>
            </div>
            <p className="text-xs font-semibold uppercase tracking-widest text-warm-gray/50 mb-3">Pricing</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-charcoal">Simple, founder-first pricing</h2>
            <p className="text-warm-gray mt-3 text-base">No VC dilution. No equity. Just the co-founder expertise you need.</p>
          </div>

          <p className="text-center text-sm text-terracotta font-semibold mb-10">
            Launch price for the first 100 founders — then it goes up.
          </p>

          <div className="grid sm:grid-cols-2 gap-6 items-center max-w-3xl mx-auto">
            <PlanCard
              name="Starter"
              price="€19"
              description="Daily intelligence reports from your data. Clarity delivered every morning."
              features={[
                "Daily AI report every morning",
                "DataFast + GitHub integration",
                "Revenue, traffic & code analysis",
                "Actionable daily suggestions",
                "Task tracking",
              ]}
              cta="Start with Starter"
            />
            <PlanCard
              name="Founder"
              price="€39"
              launchPrice="€19"
              description="Everything in Starter plus your AI co-founder on demand. Chat, strategize, execute."
              features={[
                "Everything in Starter",
                "Unlimited co-founder chat",
                "Revenue-aware advice",
                "Stage-matched growth strategies",
                "Priority new integrations",
              ]}
              cta="Claim launch price"
              highlighted
              badge="First 100 — 50% off"
            />
          </div>

          <p className="text-center text-xs text-warm-gray/50 mt-6">
            Or go lifetime: <span className="font-semibold text-charcoal">€200</span> for the Founder plan — forever. Limited spots.
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="max-w-2xl mx-auto px-5 py-24" ref={faqReveal.ref}>
        <div className={`transition-all duration-700 ${faqReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-warm-gray/50 mb-3">FAQ</p>
            <h2 className="text-3xl font-bold text-charcoal">Got questions?</h2>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-[#E8E0D8] px-6 shadow-sm">
            {[
              {
                q: "What exactly is Tasu?",
                a: "Tasu is an AI co-founder agent — not a chatbot. It reads your revenue, traffic, and GitHub activity every morning and gives you one sharp action to take. It thinks like a founder who's been there before.",
              },
              {
                q: "How does Tasu read my data?",
                a: "Read-only API keys. We connect to DataFast for revenue and traffic, and GitHub for commit activity. We never write, modify, or take admin actions on your accounts.",
              },
              {
                q: "Do I need DataFast or GitHub?",
                a: "They're optional but recommended. Without integrations, Tasu still works with your self-reported data and founder playbooks — but live data makes reports much sharper.",
              },
              {
                q: "What makes this different from ChatGPT?",
                a: "ChatGPT gives generic advice. Tasu reads YOUR numbers every morning — your actual revenue, traffic sources, conversion rate, commit velocity — and tells you the ONE thing to fix today based on strategies that worked for founders at your exact stage.",
              },
              {
                q: "Is my data safe?",
                a: "Yes. Read-only API keys only. We never write to your accounts, never share your data, and never use it to train models. Your numbers stay private.",
              },
              {
                q: "Can I cancel anytime?",
                a: "Yes. No lock-in, no annual commitment. Cancel from your account settings at any time.",
              },
            ].map((item) => (
              <FAQItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="relative py-28 px-5 text-center overflow-hidden">
        <div className="absolute inset-0 bg-charcoal" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-terracotta/10 rounded-full blur-[120px] -translate-y-1/2" />
        <div className="max-w-2xl mx-auto relative">
          <div className="flex justify-center mb-6"><TasuLogo size={52} /></div>
          <h2 className="text-3xl sm:text-4xl font-bold text-cream mb-4">
            Start growing like a founder<br />who already made it.
          </h2>
          <p className="text-cream/60 text-base mb-8 leading-relaxed">
            Early access is limited to 100 founders. Claim your spot and get your first daily report within 24 hours.
          </p>
          <Link
            href="/login?mode=signup"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-terracotta to-[#D4722A] hover:from-terracotta-dark hover:to-terracotta text-white font-semibold px-8 py-4 rounded-xl text-base transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-terracotta/30"
          >
            Start growing now
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-charcoal border-t border-white/5 py-8 px-5">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-cream/30">
          <div className="flex items-center gap-2">
            <TasuLogo size={20} />
            <span className="font-semibold text-cream/50">tasu</span>
          </div>
          <p>&copy; {new Date().getFullYear()} Tasu. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="hover:text-cream/60 transition-colors">Privacy</Link>
            <a href="https://x.com/tasu_ai" target="_blank" rel="noopener noreferrer" className="hover:text-cream/60 transition-colors">X / Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
