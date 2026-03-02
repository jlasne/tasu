import Link from "next/link";

function FloatingCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-lg border border-cream-dark/50 p-4 ${className}`}
    >
      {children}
    </div>
  );
}

function AvatarRow() {
  const initials = ["JM", "SK", "AL", "RP", "ND"];
  return (
    <div className="flex items-center gap-2">
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
      <span className="text-sm text-warm-gray ml-2">
        Trusted by 50+ solo founders
      </span>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-cream dot-grid">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-charcoal tracking-tight">
            tasu
          </span>
          <span className="text-xs text-warm-gray">.ai</span>
        </div>
        <Link
          href="/login"
          className="text-sm font-medium text-charcoal hover:text-terracotta transition-colors"
        >
          Sign in
        </Link>
      </nav>

      {/* Hero */}
      <main className="max-w-6xl mx-auto px-6 pt-16 pb-24">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left: Copy */}
          <div className="flex-1 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-charcoal text-cream text-sm px-4 py-1.5 rounded-full mb-8">
              <span className="w-2 h-2 rounded-full bg-terracotta animate-pulse" />
              AI co-founder
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-charcoal leading-[1.1] tracking-tight mb-6">
              Watch your AI co-founder push you to your next revenue milestone.
            </h1>

            <p className="text-lg text-warm-gray leading-relaxed mb-8">
              Tasu looks at your real numbers and tells you the next move — not a
              generic playbook. The co-founder you text at midnight who actually
              knows your numbers.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                href="/login"
                className="inline-flex items-center justify-center bg-terracotta hover:bg-terracotta-dark text-white font-medium px-8 py-3.5 rounded-full transition-colors text-base"
              >
                Start building with Tasu
              </Link>
              <Link
                href="/privacy"
                className="inline-flex items-center justify-center text-warm-gray hover:text-charcoal font-medium px-6 py-3.5 transition-colors text-sm"
              >
                Privacy &rarr;
              </Link>
            </div>

            <AvatarRow />
          </div>

          {/* Right: Floating cards */}
          <div className="flex-1 relative min-h-[420px] hidden lg:block">
            {/* Diagnosis card */}
            <FloatingCard className="absolute top-0 right-0 w-72 rotate-2 hover:rotate-0 transition-transform">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-terracotta/10 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-terracotta"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <span className="text-xs font-medium text-warm-gray uppercase tracking-wide">
                  Diagnosis
                </span>
              </div>
              <p className="text-sm text-charcoal font-medium mb-1">
                Your conversion is the bottleneck.
              </p>
              <p className="text-xs text-warm-gray">
                Landing page gets 2.4k visits/mo but only 1.2% convert. Fix
                positioning before spending more on distribution.
              </p>
            </FloatingCard>

            {/* Action card */}
            <FloatingCard className="absolute top-36 left-4 w-64 -rotate-1 hover:rotate-0 transition-transform">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <span className="text-xs font-medium text-warm-gray uppercase tracking-wide">
                  Next action
                </span>
              </div>
              <p className="text-sm text-charcoal font-medium">
                Rewrite your hero headline to lead with the outcome, not the
                feature.
              </p>
            </FloatingCard>

            {/* Insight card */}
            <FloatingCard className="absolute bottom-4 right-8 w-60 rotate-1 hover:rotate-0 transition-transform">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-terracotta flex items-center justify-center">
                  <span className="text-white text-xs font-bold">T</span>
                </div>
                <span className="text-xs font-medium text-charcoal">Tasu</span>
              </div>
              <p className="text-xs text-warm-gray">
                &ldquo;You shipped 3 features this week but MRR is flat. Let&apos;s
                talk about what&apos;s actually moving the needle.&rdquo;
              </p>
            </FloatingCard>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-24 text-center">
          <p className="text-sm text-warm-gray mb-6">
            Not another AI chatbot. Tasu is built for founders who want
            accountability, not platitudes.
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-xs text-warm-gray/70">
            <span>Real business context</span>
            <span>&middot;</span>
            <span>Revenue-aware (coming soon)</span>
            <span>&middot;</span>
            <span>One concrete action per session</span>
            <span>&middot;</span>
            <span>Knows your numbers</span>
          </div>
        </div>
      </main>
    </div>
  );
}
