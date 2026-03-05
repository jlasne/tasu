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
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left gap-4"
      >
        <span className="text-[15px] font-medium text-charcoal">{q}</span>
        <svg
          className={`w-5 h-5 text-warm-gray shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
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
  name, price, period = "/mo", description, features, cta, highlighted = false,
}: {
  name: string; price: string; period?: string; description: string;
  features: string[]; cta: string; highlighted?: boolean;
}) {
  return (
    <div className={`relative rounded-3xl p-8 flex flex-col ${
      highlighted
        ? "bg-charcoal text-cream shadow-2xl scale-[1.03]"
        : "bg-white border border-[#E8E0D8]"
    }`}>
      {highlighted && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="bg-terracotta text-white text-[11px] font-semibold px-4 py-1.5 rounded-full">
            Most popular
          </span>
        </div>
      )}
      <div className="mb-6">
        <p className={`text-xs font-semibold uppercase tracking-widest mb-2 ${highlighted ? "text-cream/60" : "text-warm-gray"}`}>{name}</p>
        <div className="flex items-end gap-1">
          <span className={`text-4xl font-bold ${highlighted ? "text-cream" : "text-charcoal"}`}>{price}</span>
          <span className={`text-sm mb-1 ${highlighted ? "text-cream/60" : "text-warm-gray"}`}>{period}</span>
        </div>
        <p className={`text-sm mt-2 leading-relaxed ${highlighted ? "text-cream/70" : "text-warm-gray"}`}>{description}</p>
      </div>
      <ul className="space-y-3 flex-1 mb-8">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-sm">
            <svg className={`w-4 h-4 mt-0.5 shrink-0 ${highlighted ? "text-terracotta" : "text-terracotta"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
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
  const pricingReveal = useReveal(0.1);
  const faqReveal = useReveal(0.1);
  const foundersReveal = useReveal(0.1);

  const visitorsCount = useCounter(12847, 1800, dashReveal.visible);
  const revenueCount = useCounter(4280, 1800, dashReveal.visible);
  const commitsCount = useCounter(47, 1600, dashReveal.visible);

  const founders = ["@marclou", "@tibo_maker", "@robj3d3", "@romanbuildsaas"];

  return (
    <div className="min-h-screen bg-[#F5F0EA] text-charcoal font-sans">

      {/* ── Nav ── */}
      <header className="sticky top-0 z-50 bg-[#F5F0EA]/90 backdrop-blur-md border-b border-[#E8E0D8]/60">
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
              href="/login"
              className="bg-charcoal hover:bg-charcoal/90 text-cream text-sm font-semibold px-5 py-2.5 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Request access
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="max-w-5xl mx-auto px-5 pt-20 pb-16 text-center" ref={heroReveal.ref}>
        <div className={`transition-all duration-700 ${heroReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>

          {/* Early access badge */}
          <div className="inline-flex items-center gap-2 bg-white border border-[#E8E0D8] rounded-full px-4 py-2 mb-8 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-terracotta animate-pulse" />
            <span className="text-xs font-semibold text-charcoal tracking-wide uppercase">Early Access — Limited spots</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.05] tracking-tight text-charcoal mb-6">
            Keep 100% of your company.<br />
            <span className="text-terracotta">Grow with an AI co-founder.</span>
          </h1>

          <p className="text-lg sm:text-xl text-warm-gray leading-relaxed max-w-2xl mx-auto mb-4">
            With Tasu you keep 100% of your company with an AI expert co-founder that leads you to your next revenue milestone.
          </p>

          <p className="text-sm text-warm-gray/70 max-w-xl mx-auto mb-10">
            Trained by successful founders like{" "}
            {founders.map((f, i) => (
              <span key={f}>
                <span className="font-semibold text-charcoal">{f}</span>
                {i < founders.length - 1 ? ", " : " and more."}
              </span>
            ))}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/login"
              className="bg-charcoal hover:bg-charcoal/90 text-cream font-semibold px-8 py-4 rounded-xl text-base transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg"
            >
              Request early access →
            </Link>
            <p className="text-xs text-warm-gray/60">No credit card required</p>
          </div>
        </div>
      </section>

      {/* ── Live data strip ── */}
      <section className="max-w-5xl mx-auto px-5 pb-20" ref={dashReveal.ref}>
        <div className={`transition-all duration-700 delay-100 ${dashReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>

          {/* Section label */}
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-warm-gray/60 mb-8">
            Your co-founder reads everything — every morning
          </p>

          {/* Animated metrics grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-2xl border border-[#E8E0D8] p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-warm-gray uppercase tracking-wide">Visitors (30d)</span>
                <span className="text-[10px] bg-[#F0EAE2] text-warm-gray px-2 py-0.5 rounded-full">DataFast</span>
              </div>
              <p className="text-3xl font-bold text-charcoal">{visitorsCount.toLocaleString()}</p>
              <p className="text-xs text-green-600 mt-1 font-medium">↑ 14% vs last month</p>
            </div>

            <div className="bg-white rounded-2xl border border-[#E8E0D8] p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-warm-gray uppercase tracking-wide">Revenue (30d)</span>
                <span className="text-[10px] bg-[#F0EAE2] text-warm-gray px-2 py-0.5 rounded-full">Stripe</span>
              </div>
              <p className="text-3xl font-bold text-charcoal">${revenueCount.toLocaleString()}</p>
              <p className="text-xs text-green-600 mt-1 font-medium">↑ 23% vs last month</p>
            </div>

            <div className="bg-white rounded-2xl border border-[#E8E0D8] p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-warm-gray uppercase tracking-wide">Commits (30d)</span>
                <span className="text-[10px] bg-[#F0EAE2] text-warm-gray px-2 py-0.5 rounded-full">GitHub</span>
              </div>
              <p className="text-3xl font-bold text-charcoal">{commitsCount}</p>
              <p className="text-xs text-warm-gray/60 mt-1">Last push: 2h ago</p>
            </div>
          </div>

          {/* AI insight card */}
          <div className="bg-charcoal rounded-2xl p-6 text-cream relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-charcoal to-[#1a1210] opacity-80" />
            <div className="relative flex items-start gap-4">
              <div className="shrink-0 mt-0.5">
                <TasuLogo size={36} />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-cream/40 mb-2">Tasu · Daily report</p>
                <p className="text-[15px] leading-relaxed text-cream/90">
                  Your traffic is up 14% but conversion is stuck at{" "}
                  <span className="text-terracotta font-semibold">2.8%</span>.
                  You shipped 47 commits this month yet revenue growth is half your traffic growth.{" "}
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

      {/* ── Data sources ── */}
      <section className="border-y border-[#E8E0D8] bg-white py-10">
        <div className="max-w-5xl mx-auto px-5">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-warm-gray/50 mb-8">Connected to your tools</p>
          <div className="flex flex-wrap items-center justify-center gap-10">
            {[
              { name: "DataFast", sub: "Traffic & Revenue", emoji: "📊" },
              { name: "Stripe", sub: "via DataFast", emoji: "💳" },
              { name: "GitHub", sub: "Shipping Activity", emoji: "⚙️" },
            ].map((src) => (
              <div key={src.name} className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-[#F5F0EA] flex items-center justify-center text-xl">{src.emoji}</div>
                <div>
                  <p className="text-sm font-semibold text-charcoal">{src.name}</p>
                  <p className="text-xs text-warm-gray">{src.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What you get ── */}
      <section className="max-w-5xl mx-auto px-5 py-24">
        <div className="text-center mb-14" ref={foundersReveal.ref}>
          <div className={`transition-all duration-700 ${foundersReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <p className="text-xs font-semibold uppercase tracking-widest text-warm-gray/50 mb-3">What Tasu reads — every day</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-charcoal">All correlated together.<br />One sharp decision.</h2>
          </div>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            {
              icon: "📊",
              title: "Revenue & traffic",
              desc: "MRR, visitor count, conversion rate, bounce rate, and where your best traffic actually comes from — all via DataFast.",
            },
            {
              icon: "⚙️",
              title: "Code & shipping",
              desc: "Commit frequency, what you shipped this week, and whether your velocity matches your revenue goals.",
            },
            {
              icon: "🧠",
              title: "Founder playbooks",
              desc: "The sharpest 2025 growth tactics on positioning, distribution, and conversion — matched to your current revenue stage.",
            },
          ].map((card) => (
            <div key={card.title} className="bg-white rounded-2xl border border-[#E8E0D8] p-6 hover:shadow-md transition-shadow">
              <div className="text-3xl mb-4">{card.icon}</div>
              <h3 className="text-base font-semibold text-charcoal mb-2">{card.title}</h3>
              <p className="text-sm text-warm-gray leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="bg-[#F0EAE2] py-24 px-5" ref={pricingReveal.ref}>
        <div className={`max-w-5xl mx-auto transition-all duration-700 ${pricingReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-warm-gray/50 mb-3">Pricing</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-charcoal">Simple, founder-first pricing</h2>
            <p className="text-warm-gray mt-3 text-base">No VC dilution. No equity. Just the co-founder expertise you need.</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 items-center">
            <PlanCard
              name="Starter"
              price="€9"
              description="Daily intelligence reports from your integrations. No fluff, just the numbers and one sharp action."
              features={[
                "Daily AI report every morning",
                "DataFast revenue & traffic",
                "GitHub shipping activity",
                "Website + knowledge context",
                "Actionable suggestions",
              ]}
              cta="Start with Starter"
            />
            <PlanCard
              name="Pro"
              price="€29"
              description="Everything in Starter plus 100 chat credits per week to go deeper on any topic."
              features={[
                "Everything in Starter",
                "100 chat credits / week",
                "AI co-founder on demand",
                "Revenue-aware advice",
                "Positioning & conversion help",
              ]}
              cta="Start Pro — 7 days free"
              highlighted
            />
            <PlanCard
              name="Plus"
              price="€59"
              description="For founders moving fast. 1000 chat credits a week and priority access to new features."
              features={[
                "Everything in Pro",
                "1 000 chat credits / week",
                "Priority feature access",
                "Early access to new playbooks",
                "Founder community access",
              ]}
              cta="Start with Plus"
            />
          </div>
        </div>
      </section>

      {/* ── Social proof strip ── */}
      <section className="bg-white border-y border-[#E8E0D8] py-14 px-5">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-warm-gray/50 mb-6">Built on knowledge from</p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {founders.map((f) => (
              <span key={f} className="text-base font-semibold text-charcoal/70 hover:text-charcoal transition-colors cursor-default">{f}</span>
            ))}
            <span className="text-warm-gray/50 text-sm">and many more</span>
          </div>
          <p className="mt-6 text-sm text-warm-gray max-w-lg mx-auto leading-relaxed">
            The playbooks, frameworks, and mental models that helped these indie founders go from $0 to their first $10k MRR — built into every report and conversation.
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
          <div className="bg-white rounded-2xl border border-[#E8E0D8] px-6">
            {[
              {
                q: "What exactly is Tasu?",
                a: "Tasu is an AI co-founder — not a chatbot. It reads your revenue, traffic, and GitHub activity every morning and gives you one sharp action to take. It thinks like a founder who's been there before.",
              },
              {
                q: "How does Tasu read my revenue?",
                a: "Tasu connects to DataFast, which aggregates your Stripe revenue, visitor data, conversion rate, bounce rate, and traffic sources. Setup takes under 5 minutes.",
              },
              {
                q: "Do I need DataFast or GitHub?",
                a: "They're optional but highly recommended. Without integrations, Tasu still works — but the daily reports are based on your context and founder playbooks only, not live data.",
              },
              {
                q: "What are chat credits?",
                a: "Chat credits are used when you have a conversation with Tasu. Each message exchange costs one credit. Starter plan has no chat — you get the daily report only. Pro gets 100/week, Plus gets 1000/week.",
              },
              {
                q: "Is my data safe?",
                a: "Yes. We use read-only API keys for DataFast and GitHub. We never write to your accounts, and your data is never shared or used to train models.",
              },
              {
                q: "Can I cancel anytime?",
                a: "Yes. No lock-in, no annual commitment required. Cancel from your account settings at any time and you won't be charged again.",
              },
            ].map((item) => (
              <FAQItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="bg-charcoal py-24 px-5 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-center mb-6">
            <TasuLogo size={52} />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-cream mb-4">
            Stop guessing. Start growing.
          </h2>
          <p className="text-cream/60 text-base mb-8 leading-relaxed">
            Early access is limited. Join now and get your first daily report within 24 hours of setup.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-terracotta hover:bg-terracotta-dark text-white font-semibold px-8 py-4 rounded-xl text-base transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg"
          >
            Request early access
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
          <p>© {new Date().getFullYear()} Tasu. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="hover:text-cream/60 transition-colors">Privacy</Link>
            <a href="https://x.com/tasu_ai" target="_blank" rel="noopener noreferrer" className="hover:text-cream/60 transition-colors">X / Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
