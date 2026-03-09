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

/* ── Animated counter ── */
function useCounter(target: number, duration = 1600, active = false) {
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
  const dashReveal = useReveal(0.1);
  const whyReveal = useReveal(0.1);
  const howReveal = useReveal(0.1);
  const socialReveal = useReveal(0.1);
  const pricingReveal = useReveal(0.1);
  const faqReveal = useReveal(0.1);

  const visitorsCount = useCounter(12847, 1800, dashReveal.visible);
  const revenueCount = useCounter(4280, 1800, dashReveal.visible);
  const commitsCount = useCounter(47, 1600, dashReveal.visible);

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
      <section className="py-24 bg-[#1C1917]" ref={howReveal.ref}>
        <div className={`max-w-5xl mx-auto px-5 transition-all duration-700 ${howReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>

          <p className="text-center text-xs font-semibold uppercase tracking-widest text-terracotta mb-3">How It Reads You</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-14">Grow your revenue in 3 steps</h2>

          {/* Cards row */}
          <div className="flex flex-col sm:flex-row items-stretch gap-0">

            {/* Card 1 */}
            <div className={`flex-1 bg-[#252220] rounded-2xl overflow-hidden border border-white/10 transition-all duration-500 ${howReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`} style={{ transitionDelay: "0ms" }}>
              <div className="h-52 bg-[#1C1917] flex items-center justify-center p-6">
                <div className="w-full bg-[#252220] rounded-xl border border-white/10 overflow-hidden">
                  <div className="flex items-center gap-1.5 px-3 pt-3 pb-2 border-b border-white/5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400/50" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/50" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-400/50" />
                  </div>
                  <div className="px-4 py-3 font-mono text-xs space-y-1">
                    <p className="text-white/30">{"<script"}</p>
                    <p className="pl-3 text-green-400/80">{"defer"}</p>
                    <p className="pl-3"><span className="text-blue-400/70">data-domain</span><span className="text-white/40">{"=\""}</span><span className="text-orange-300/80">yoursite.com</span><span className="text-white/40">{"\""}</span></p>
                    <p className="pl-3"><span className="text-blue-400/70">src</span><span className="text-white/40">{"=\""}</span><span className="text-orange-300/80">tasu.ai/js</span><span className="text-white/40">{"\""}</span></p>
                    <p className="text-white/30">{"</script>"}</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-[13px] font-bold text-white mb-1.5">1. Drop your business</p>
                <p className="text-sm text-white/50 leading-relaxed">Share your website so Tasu can understand your audience, value props, and market position.</p>
              </div>
            </div>

            {/* Arrow 1 */}
            <div className="hidden sm:flex items-center justify-center px-3 shrink-0 text-white/20 text-2xl">&#8594;</div>
            <div className="flex sm:hidden items-center justify-center py-2 text-white/20 text-2xl">&#8595;</div>

            {/* Card 2 */}
            <div className={`flex-1 bg-[#252220] rounded-2xl overflow-hidden border border-white/10 transition-all duration-500 ${howReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`} style={{ transitionDelay: "150ms" }}>
              <div className="h-52 bg-[#1C1917] flex items-center justify-center p-6">
                <div className="grid grid-cols-2 gap-3 w-full max-w-[200px]">
                  {[
                    { name: "Stripe", color: "bg-[#635BFF]", icon: "S" },
                    { name: "Shopify", color: "bg-[#96BF48]", icon: "S" },
                    { name: "GitHub", color: "bg-[#24292E]", icon: "G" },
                    { name: "Analytics", color: "bg-[#E8943A]", icon: "A" },
                  ].map((int) => (
                    <div key={int.name} className="bg-[#252220] rounded-xl p-3 flex flex-col items-center gap-1.5 border border-white/10">
                      <div className={`w-8 h-8 rounded-lg ${int.color} flex items-center justify-center`}>
                        <span className="text-white text-xs font-bold">{int.icon}</span>
                      </div>
                      <span className="text-[10px] text-white/50 font-medium">{int.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-6">
                <p className="text-[13px] font-bold text-white mb-1.5">2. Connect your data</p>
                <p className="text-sm text-white/50 leading-relaxed">Link your revenue, traffic, and code activity so Tasu pinpoints exactly where growth is blocked.</p>
              </div>
            </div>

            {/* Arrow 2 */}
            <div className="hidden sm:flex items-center justify-center px-3 shrink-0 text-white/20 text-2xl">&#8594;</div>
            <div className="flex sm:hidden items-center justify-center py-2 text-white/20 text-2xl">&#8595;</div>

            {/* Card 3 */}
            <div className={`flex-1 bg-[#252220] rounded-2xl overflow-hidden border border-white/10 transition-all duration-500 ${howReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`} style={{ transitionDelay: "300ms" }}>
              <div className="h-52 bg-[#1C1917] flex items-center justify-center p-4">
                <div className="w-full bg-[#252220] rounded-xl border border-white/10 p-3">
                  <div className="flex justify-between items-center mb-3 px-1">
                    <span className="text-[10px] text-white/40 font-medium">Source</span>
                    <span className="text-[10px] text-white/40 font-medium">Revenue</span>
                  </div>
                  {[
                    { source: "Direct", bar: 72, revenue: "$1.2k", focus: false },
                    { source: "Google", bar: 48, revenue: "$798", focus: true },
                    { source: "Twitter/X", bar: 30, revenue: "$498", focus: false },
                    { source: "Product Hunt", bar: 18, revenue: "$210", focus: false },
                  ].map((row) => (
                    <div key={row.source} className={`flex items-center gap-2 py-1.5 px-1 rounded-lg ${row.focus ? "bg-terracotta/10" : ""}`}>
                      <span className="text-[11px] text-white/60 w-24 shrink-0">{row.source}</span>
                      <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${row.focus ? "bg-terracotta" : "bg-white/20"}`} style={{ width: `${row.bar}%` }} />
                      </div>
                      <span className={`text-[11px] font-semibold shrink-0 w-10 text-right ${row.focus ? "text-terracotta" : "text-white/50"}`}>{row.revenue}</span>
                      {row.focus && <span className="text-[9px] bg-terracotta text-white px-1.5 py-0.5 rounded font-bold shrink-0">Focus</span>}
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-6">
                <p className="text-[13px] font-bold text-white mb-1.5">3. Grow your revenue</p>
                <p className="text-sm text-white/50 leading-relaxed">Execute stage-based strategies that move the needle, then watch your revenue explode.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Live dashboard preview ── */}
      <section className="py-24 relative" ref={dashReveal.ref}>
        {/* Gradient band background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#F5F0EA] via-[#EDE5DA] to-[#F5F0EA]" />
        <div className={`max-w-5xl mx-auto px-5 relative transition-all duration-700 delay-100 ${dashReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>

          <p className="text-center text-xs font-semibold uppercase tracking-widest text-warm-gray/60 mb-3">What your dashboard looks like</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-charcoal text-center mb-12">Real data. Real insight. Every morning.</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {[
              { label: "VISITORS (30D)", source: "DataFast", value: visitorsCount.toLocaleString(), change: "+14% vs last month", positive: true },
              { label: "REVENUE (30D)", source: "DataFast", value: `$${revenueCount.toLocaleString()}`, change: "+23% vs last month", positive: true },
              { label: "COMMITS (30D)", source: "GitHub", value: `${commitsCount}`, change: "Last push: 2h ago", positive: false },
            ].map((metric) => (
              <div key={metric.label} className="bg-white/90 backdrop-blur-sm rounded-2xl border border-[#E8E0D8] p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-warm-gray uppercase tracking-wide">{metric.label}</span>
                  <span className="text-[10px] bg-[#F0EAE2] text-warm-gray px-2 py-0.5 rounded-full">{metric.source}</span>
                </div>
                <p className="text-3xl font-bold text-charcoal">{metric.value}</p>
                <p className={`text-xs mt-1 font-medium ${metric.positive ? "text-green-600" : "text-warm-gray/60"}`}>{metric.change}</p>
              </div>
            ))}
          </div>

          {/* AI insight card */}
          <div className="bg-charcoal rounded-2xl p-6 text-cream relative overflow-hidden shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-[#1a1210] to-charcoal opacity-90" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-terracotta/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative flex items-start gap-4">
              <div className="shrink-0 mt-0.5"><TasuLogo size={36} /></div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-cream/40 mb-2">Tasu · Daily report</p>
                <p className="text-[15px] leading-relaxed text-cream/90">
                  Your traffic is up 14% but conversion is stuck at{" "}
                  <span className="text-terracotta font-semibold">2.8%</span>.
                  You shipped 47 commits yet revenue growth is half your traffic growth.{" "}
                  <span className="text-cream font-semibold">The gap is your landing page copy — it speaks to builders, not buyers.</span>{" "}
                  Rewrite the hero today.
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-[10px] font-medium bg-terracotta/20 text-terracotta px-2.5 py-1 rounded-full">conversion</span>
                  <span className="text-[11px] text-cream/30">Today, 7:02 am</span>
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { title: "10x your traffic quality", desc: "Tasu reads sources, spots leaks, and reroutes to high-converting channels.", color: "from-blue-500/10 to-blue-500/0" },
              { title: "Double your conversions", desc: "Analyzes customer paths and pricing to unlock hidden revenue fast.", color: "from-amber-500/10 to-amber-500/0" },
              { title: "Ship features that stick", desc: "Tracks your code deploys and predicts what drives retention and growth.", color: "from-purple-500/10 to-purple-500/0" },
              { title: "Scale to $10k MRR", desc: "Matches your stage to proven strategies from @marclou, @tibo_maker, @robj3d3 and more.", color: "from-green-500/10 to-green-500/0" },
              { title: "End $0 launches", desc: "Delivers stage-specific fixes so you act on real blockers, not generic noise.", color: "from-red-500/10 to-red-500/0" },
              { title: "Reach milestones faster", desc: "Your AI co-founder evolves with your data for precision and clarity that compounds.", color: "from-terracotta/10 to-terracotta/0" },
            ].map((card, i) => (
              <div key={card.title} className={`bg-white/80 backdrop-blur-sm rounded-2xl border border-[#E8E0D8] p-7 hover:shadow-lg transition-all duration-300 group ${whyReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`} style={{ transitionDelay: `${i * 80}ms` }}>
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className="relative">
                  <h3 className="text-base font-semibold text-charcoal mb-2">{card.title}</h3>
                  <p className="text-sm text-warm-gray leading-relaxed">{card.desc}</p>
                </div>
              </div>
            ))}
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
                    { name: "@dankulkov", desc: "Makerbox, growth playbooks" },
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

          <p className="text-center text-sm text-warm-gray max-w-lg mx-auto leading-relaxed mt-8">
            Tasu learns what actually worked for them at every growth stage and adapts it to you. Growth systems, decision models, and tested sequences — not generic advice.
          </p>
        </div>
      </section>

      {/* ── Data sources ── */}
      <section className="py-12 bg-[#F5F0EA]">
        <div className="max-w-5xl mx-auto px-5">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-warm-gray/50 mb-8">Connected to your tools</p>
          <div className="flex flex-wrap items-center justify-center gap-10">
            {[
              { name: "DataFast", sub: "Traffic & Revenue", live: true },
              { name: "GitHub", sub: "Shipping Activity", live: true },
              { name: "Stripe", sub: "Coming soon", live: false },
              { name: "PostHog", sub: "Coming soon", live: false },
            ].map((src) => (
              <div key={src.name} className="flex items-center gap-3 group">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold border ${src.live ? "bg-white border-[#E8E0D8] text-charcoal/60" : "bg-cream border-[#E8E0D8] text-warm-gray/30"}`}>
                  {src.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className={`text-sm font-semibold ${src.live ? "text-charcoal" : "text-warm-gray/50"}`}>{src.name}</p>
                  <p className="text-xs text-warm-gray">{src.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="py-28 px-5 relative" ref={pricingReveal.ref}>
        <div className="absolute inset-0 bg-gradient-to-b from-[#EDE5DA] via-[#E8DFD4] to-[#F5F0EA]" />
        <div className={`max-w-4xl mx-auto relative transition-all duration-700 ${pricingReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
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
      <section className="max-w-2xl mx-auto px-5 py-24 bg-[#F5F0EA]" ref={faqReveal.ref}>
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
