function ComingSoonBadge() {
  return (
    <span className="text-xs bg-terracotta/10 text-terracotta px-2.5 py-1 rounded-full font-medium">
      Coming soon
    </span>
  );
}

function ConnectorCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-cream-dark p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-cream flex items-center justify-center">
          {icon}
        </div>
        <ComingSoonBadge />
      </div>
      <h3 className="text-sm font-semibold text-charcoal mb-1">{title}</h3>
      <p className="text-xs text-warm-gray leading-relaxed">{description}</p>
    </div>
  );
}

export default function ProjectPage() {
  return (
    <div className="p-6 lg:p-10 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-charcoal mb-2">Project</h1>
        <p className="text-sm text-warm-gray">
          Your business intelligence hub. Tasu will pull data from these sources
          to give you sharper advice.
        </p>
      </div>

      {/* Last analysis */}
      <div className="bg-white rounded-2xl border border-cream-dark p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-charcoal">
            Latest analysis
          </h2>
          <ComingSoonBadge />
        </div>
        <div className="bg-cream rounded-xl p-4">
          <p className="text-sm text-warm-gray text-center py-8">
            Tasu will analyze your business data and surface insights here.
            <br />
            Connect your data sources below to get started.
          </p>
        </div>
      </div>

      {/* Connectors */}
      <h2 className="text-sm font-semibold text-charcoal mb-4">
        Data connectors
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <ConnectorCard
          title="DataFast"
          description="Revenue analytics. MRR, churn, LTV, and conversion metrics pulled in real-time."
          icon={
            <svg className="w-5 h-5 text-terracotta" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
          }
        />
        <ConnectorCard
          title="GitHub"
          description="Shipping activity. Commits, PRs, and deploy frequency so Tasu knows what you've built."
          icon={
            <svg className="w-5 h-5 text-charcoal" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          }
        />
        <ConnectorCard
          title="Website HTML"
          description="Your landing page analysis. Positioning, copy, and conversion signals from your URL."
          icon={
            <svg className="w-5 h-5 text-warm-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
          }
        />
      </div>
    </div>
  );
}
