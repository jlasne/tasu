"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Integration {
  datafast_api_key: string | null;
  github_repo_url: string | null;
}

function ConnectorCard({
  title,
  description,
  icon,
  connected,
  settingsHref,
  badge,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  connected: boolean;
  settingsHref: string;
  badge?: React.ReactNode;
}) {
  return (
    <div className={`bg-white rounded-2xl border p-5 transition-all ${connected ? "border-green-200" : "border-cream-dark"}`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${connected ? "bg-green-50" : "bg-cream"}`}>
          {icon}
        </div>
        {connected ? (
          <span className="text-xs font-medium bg-green-100 text-green-700 px-2.5 py-1 rounded-full">
            Connected
          </span>
        ) : (
          <Link
            href={settingsHref}
            className="text-xs font-medium text-terracotta hover:text-terracotta-dark border border-terracotta/30 hover:border-terracotta px-2.5 py-1 rounded-full transition-colors"
          >
            Connect →
          </Link>
        )}
      </div>
      <h3 className="text-sm font-semibold text-charcoal mb-1">{title}</h3>
      <p className="text-xs text-warm-gray leading-relaxed">{description}</p>
      {badge}
    </div>
  );
}

export default function ProjectPage() {
  const [integration, setIntegration] = useState<Integration | null>(null);
  const [loading, setLoading] = useState(true);
  const [datafastData, setDatafastData] = useState<Record<string, number | null> | null>(null);
  const [githubData, setGithubData] = useState<{totalCommitsLast30: number; lastCommitDate: string | null; owner: string; repo: string} | null>(null);
  const supabase = createClient();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { loadIntegration(); }, []);

  async function loadIntegration() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("integrations")
      .select("datafast_api_key, github_repo_url")
      .eq("user_id", user.id)
      .single();

    setIntegration(data);
    setLoading(false);

    // Fetch live data if connected
    if (data?.datafast_api_key) {
      fetch("/api/integrations/datafast")
        .then((r) => r.json())
        .then((d) => {
          if (d.overview) setDatafastData(d.overview);
        })
        .catch(() => {});
    }

    if (data?.github_repo_url) {
      fetch("/api/integrations/github")
        .then((r) => r.json())
        .then((d) => {
          if (d.totalCommitsLast30 !== undefined) setGithubData(d);
        })
        .catch(() => {});
    }
  }

  const datafastConnected = !!integration?.datafast_api_key;
  const githubConnected = !!integration?.github_repo_url;

  return (
    <div className="p-6 lg:p-10 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-charcoal mb-2">Project</h1>
        <p className="text-sm text-warm-gray">
          Your business intelligence hub. Connect your data sources to unlock richer AI reports.
        </p>
      </div>

      {/* Live snapshot */}
      {(datafastData || githubData) && (
        <div className="mb-8">
          <h2 className="text-xs font-semibold text-warm-gray uppercase tracking-wide mb-3">Live snapshot</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {datafastData && (
              <>
                <div className="bg-white rounded-2xl border border-cream-dark p-4">
                  <p className="text-xs text-warm-gray mb-1">Visitors (30d)</p>
                  <p className="text-xl font-semibold text-charcoal">{datafastData.visitors ?? "—"}</p>
                </div>
                <div className="bg-white rounded-2xl border border-cream-dark p-4">
                  <p className="text-xs text-warm-gray mb-1">Revenue (30d)</p>
                  <p className="text-xl font-semibold text-charcoal">
                    {datafastData.revenue != null ? `$${datafastData.revenue}` : "—"}
                  </p>
                </div>
                <div className="bg-white rounded-2xl border border-cream-dark p-4">
                  <p className="text-xs text-warm-gray mb-1">Conversion</p>
                  <p className="text-xl font-semibold text-charcoal">
                    {datafastData.conversion_rate != null ? `${datafastData.conversion_rate}%` : "—"}
                  </p>
                </div>
              </>
            )}
            {githubData && (
              <div className="bg-white rounded-2xl border border-cream-dark p-4">
                <p className="text-xs text-warm-gray mb-1">Commits (30d)</p>
                <p className="text-xl font-semibold text-charcoal">{githubData.totalCommitsLast30}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Generate report CTA */}
      <div className="bg-charcoal rounded-2xl p-5 mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-white mb-1">Ready for your daily briefing?</p>
          <p className="text-xs text-white/60">Tasu will analyze all connected data and give you one sharp action.</p>
        </div>
        <Link
          href="/report"
          className="shrink-0 bg-terracotta hover:bg-terracotta-dark text-white text-sm font-medium px-4 py-2 rounded-xl transition-all active:scale-[0.98]"
        >
          View reports →
        </Link>
      </div>

      {/* Connectors */}
      <h2 className="text-xs font-semibold text-warm-gray uppercase tracking-wide mb-4">Data connectors</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <ConnectorCard
          title="DataFast"
          description="Revenue, traffic, conversion rates and referrer sources. The financial pulse of your product."
          connected={datafastConnected}
          settingsHref="/settings"
          icon={
            <svg className={`w-5 h-5 ${datafastConnected ? "text-green-600" : "text-terracotta"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
          }
          badge={
            !datafastConnected ? (
              <p className="text-[10px] text-warm-gray/60 mt-2">
                Recommended.{" "}
                <a href="https://datafa.st/?via=jeremy-lasne" target="_blank" rel="noopener noreferrer" className="text-terracotta hover:underline">
                  Get DataFast ↗
                </a>
              </p>
            ) : undefined
          }
        />

        <ConnectorCard
          title="GitHub"
          description="Commit frequency, recent pushes, and shipping momentum. Keeps Tasu honest about what you're building."
          connected={githubConnected}
          settingsHref="/settings"
          icon={
            <svg className={`w-5 h-5 ${githubConnected ? "text-green-600" : "text-charcoal"}`} fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          }
        />

        <ConnectorCard
          title="Website analysis"
          description="Your landing page copy and positioning signals, read automatically from your URL."
          connected={false}
          settingsHref="/settings"
          icon={
            <svg className="w-5 h-5 text-warm-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
          }
          badge={
            <p className="text-[10px] text-warm-gray/60 mt-2">Auto-read from your website URL in Settings.</p>
          }
        />
      </div>

      {loading && (
        <div className="mt-4 text-center">
          <p className="text-xs text-warm-gray animate-pulse">Loading integration status...</p>
        </div>
      )}
    </div>
  );
}
