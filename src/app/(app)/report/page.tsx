"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Suggestion {
  id: string;
  text: string;
  category: string;
  done: boolean;
}

interface DailyReport {
  id: string;
  date: string;
  generated_at: string;
  summary: string;
  suggestions: Suggestion[];
  metrics: {
    visitors_30d?: number | null;
    revenue_30d?: number | null;
    conversion_rate?: number | null;
    commits_30d?: number | null;
  };
}

interface Integration {
  datafast_api_key: string | null;
  github_repo_url: string | null;
}

const categoryColors: Record<string, string> = {
  positioning: "bg-blue-50 text-blue-700 border-blue-200",
  conversion: "bg-amber-50 text-amber-700 border-amber-200",
  distribution: "bg-green-50 text-green-700 border-green-200",
  code: "bg-purple-50 text-purple-700 border-purple-200",
  accountability: "bg-terracotta/10 text-terracotta border-terracotta/20",
  general: "bg-cream text-warm-gray border-cream-dark",
};

function IntegrationBanner({ integration }: { integration: Integration | null }) {
  const missingDatafast = !integration?.datafast_api_key;
  const missingGithub = !integration?.github_repo_url;
  if (!missingDatafast && !missingGithub) return null;

  const missing = [
    missingDatafast && "DataFast",
    missingGithub && "GitHub",
  ].filter(Boolean).join(" and ");

  return (
    <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm">
      <svg className="w-4 h-4 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
      <span className="text-amber-800">
        Connect <span className="font-semibold">{missing}</span> to get richer daily reports.{" "}
        <Link href="/settings" className="underline font-medium hover:text-amber-900">
          Settings »
        </Link>
      </span>
    </div>
  );
}

function MetricCard({ label, value, unit }: { label: string; value: string | number | null; unit?: string }) {
  return (
    <div className="bg-white rounded-2xl border border-cream-dark p-4">
      <p className="text-xs text-warm-gray mb-1">{label}</p>
      <p className="text-xl font-semibold text-charcoal">
        {value === null || value === undefined ? (
          <span className="text-warm-gray/40 text-base">&mdash;</span>
        ) : (
          <>
            {unit === "$" && <span className="text-base mr-0.5">$</span>}
            {value}
            {unit && unit !== "$" && <span className="text-sm text-warm-gray ml-0.5">{unit}</span>}
          </>
        )}
      </p>
    </div>
  );
}

function ReportCard({
  report,
  onToggle,
}: {
  report: DailyReport;
  onToggle: (reportId: string, sugId: string, done: boolean) => void;
}) {
  const today = new Date().toISOString().split("T")[0] === report.date;
  const doneCount = report.suggestions?.filter((s) => s.done).length ?? 0;
  const total = report.suggestions?.length ?? 0;

  return (
    <div className="bg-white rounded-2xl border border-cream-dark overflow-hidden">
      <div className="px-5 py-4 border-b border-cream-dark/60 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-sm font-semibold text-charcoal">
              {today
                ? "Today"
                : new Date(report.date + "T12:00:00").toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                  })}
            </span>
            {today && (
              <span className="text-[10px] font-medium bg-terracotta/10 text-terracotta px-2 py-0.5 rounded-full">
                Latest
              </span>
            )}
          </div>
          <p className="text-xs text-warm-gray">{report.date}</p>
        </div>
        {total > 0 && (
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-24 rounded-full bg-cream-dark overflow-hidden">
              <div
                className="h-full rounded-full bg-terracotta transition-all"
                style={{ width: `${(doneCount / total) * 100}%` }}
              />
            </div>
            <span className="text-xs text-warm-gray">{doneCount}/{total}</span>
          </div>
        )}
      </div>

      {report.metrics && (
        <div className="px-5 py-4 grid grid-cols-2 sm:grid-cols-4 gap-3 border-b border-cream-dark/60">
          <MetricCard label="Visitors (30d)" value={report.metrics.visitors_30d ?? null} />
          <MetricCard label="Revenue (30d)" value={report.metrics.revenue_30d ?? null} unit="$" />
          <MetricCard
            label="Conversion"
            value={report.metrics.conversion_rate != null ? `${report.metrics.conversion_rate}` : null}
            unit="%"
          />
          <MetricCard label="Commits (30d)" value={report.metrics.commits_30d ?? null} />
        </div>
      )}

      {report.summary && (
        <div className="px-5 py-4 border-b border-cream-dark/60">
          <p className="text-sm text-charcoal leading-relaxed">{report.summary}</p>
        </div>
      )}

      {report.suggestions && report.suggestions.length > 0 && (
        <div className="px-5 py-4 space-y-2.5">
          <p className="text-xs font-medium text-warm-gray uppercase tracking-wide mb-3">Actions</p>
          {report.suggestions.map((s) => (
            <label
              key={s.id}
              className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all group ${
                s.done
                  ? "bg-cream/60 border-cream-dark opacity-60"
                  : "bg-white border-cream-dark hover:border-terracotta/30"
              }`}
            >
              <div className="mt-0.5 shrink-0">
                <input
                  type="checkbox"
                  checked={s.done}
                  onChange={(e) => onToggle(report.id, s.id, e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                    s.done ? "border-terracotta bg-terracotta" : "border-cream-dark group-hover:border-terracotta/50"
                  }`}
                >
                  {s.done && (
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  )}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm leading-snug ${s.done ? "line-through text-warm-gray" : "text-charcoal"}`}>
                  {s.text}
                </p>
              </div>
              {s.category && (
                <span
                  className={`shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                    categoryColors[s.category] ?? categoryColors.general
                  }`}
                >
                  {s.category}
                </span>
              )}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ReportPage() {
  const [reports, setReports] = useState<DailyReport[]>([]);
  const [integration, setIntegration] = useState<Integration | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { loadReports(); }, []);

  async function loadReports() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const [{ data: reportData }, { data: integrationData }] = await Promise.all([
      supabase
        .from("daily_reports")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false })
        .limit(14),
      supabase
        .from("integrations")
        .select("datafast_api_key, github_repo_url")
        .eq("user_id", user.id)
        .single(),
    ]);

    if (reportData) setReports(reportData as DailyReport[]);
    if (integrationData) setIntegration(integrationData as Integration);
    setLoading(false);
  }

  async function handleToggle(reportId: string, suggestionId: string, done: boolean) {
    setReports((prev) =>
      prev.map((r) =>
        r.id === reportId
          ? { ...r, suggestions: r.suggestions.map((s) => (s.id === suggestionId ? { ...s, done } : s)) }
          : r
      )
    );
    await fetch(`/api/report/${reportId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ suggestionId, done }),
    });
  }

  return (
    <div className="flex-1 overflow-y-auto bg-cream">
      <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-charcoal mb-1">Daily Reports</h1>
            <p className="text-sm text-warm-gray">Generated automatically every morning based on your data.</p>
          </div>
          <div className="flex items-center gap-1.5 bg-white border border-cream-dark rounded-xl px-3 py-2 text-xs text-warm-gray shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Auto-generated
          </div>
        </div>

        <IntegrationBanner integration={integration} />

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="flex gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-warm-gray/25 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-warm-gray/25 animate-bounce [animation-delay:0.15s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-warm-gray/25 animate-bounce [animation-delay:0.3s]" />
            </div>
          </div>
        ) : reports.length === 0 ? (
          <div className="bg-white rounded-2xl border border-cream-dark p-10 text-center">
            <h3 className="text-sm font-semibold text-charcoal mb-2">Your first report is on its way</h3>
            <p className="text-xs text-warm-gray max-w-xs mx-auto">
              Daily reports are generated automatically each morning. Connect DataFast and GitHub in{" "}
              <Link href="/settings" className="text-terracotta hover:underline">Settings</Link>{" "}
              for richer insights.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {reports.map((report) => (
              <ReportCard key={report.id} report={report} onToggle={handleToggle} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
