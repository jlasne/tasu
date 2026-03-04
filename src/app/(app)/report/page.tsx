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

interface Report {
  id: string;
  generated_at: string;
  summary: string;
  suggestions: Suggestion[];
  metrics: {
    visitors_30d?: number | null;
    revenue_30d?: number | null;
    conversion_rate?: number | null;
    commits_30d?: number | null;
  };
  datafast_data: Record<string, unknown> | null;
  github_data: Record<string, unknown> | null;
}

const categoryColors: Record<string, string> = {
  positioning: "bg-blue-50 text-blue-700 border-blue-200",
  conversion: "bg-amber-50 text-amber-700 border-amber-200",
  distribution: "bg-green-50 text-green-700 border-green-200",
  code: "bg-purple-50 text-purple-700 border-purple-200",
  accountability: "bg-terracotta/10 text-terracotta border-terracotta/20",
  general: "bg-cream text-warm-gray border-cream-dark",
};

function MetricCard({ label, value, unit }: { label: string; value: string | number | null; unit?: string }) {
  return (
    <div className="bg-white rounded-2xl border border-cream-dark p-4">
      <p className="text-xs text-warm-gray mb-1">{label}</p>
      <p className="text-xl font-semibold text-charcoal">
        {value === null || value === undefined ? (
          <span className="text-warm-gray/40 text-base">—</span>
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

function ReportCard({ report, onToggle }: { report: Report; onToggle: (reportId: string, sugId: string, done: boolean) => void }) {
  const date = new Date(report.generated_at);
  const isToday = new Date().toDateString() === date.toDateString();
  const doneCount = report.suggestions?.filter((s) => s.done).length ?? 0;
  const total = report.suggestions?.length ?? 0;

  return (
    <div className="bg-white rounded-2xl border border-cream-dark overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-cream-dark/60 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-sm font-semibold text-charcoal">
              {isToday ? "Today" : date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
            </span>
            {isToday && (
              <span className="text-[10px] font-medium bg-terracotta/10 text-terracotta px-2 py-0.5 rounded-full">
                Latest
              </span>
            )}
          </div>
          <p className="text-xs text-warm-gray">
            {date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
          </p>
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

      {/* Metrics row */}
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

      {/* Summary */}
      <div className="px-5 py-4 border-b border-cream-dark/60">
        <p className="text-sm text-charcoal leading-relaxed">{report.summary}</p>
      </div>

      {/* Suggestions */}
      {report.suggestions && report.suggestions.length > 0 && (
        <div className="px-5 py-4 space-y-2.5">
          <p className="text-xs font-medium text-warm-gray uppercase tracking-wide mb-3">
            Actions
          </p>
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
                    s.done
                      ? "border-terracotta bg-terracotta"
                      : "border-cream-dark group-hover:border-terracotta/50"
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
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClient();

  useEffect(() => {
    loadReports();
  }, []);

  async function loadReports() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("reports")
      .select("*")
      .eq("user_id", user.id)
      .order("generated_at", { ascending: false })
      .limit(10);

    if (data) setReports(data as Report[]);
    setLoading(false);
  }

  async function generateReport() {
    setGenerating(true);
    setError("");

    try {
      const res = await fetch("/api/report/generate", { method: "POST" });
      const data = await res.json();

      if (data.report) {
        setReports((prev) => [data.report as Report, ...prev]);
      } else {
        setError(data.error || "Failed to generate report.");
      }
    } catch {
      setError("Something went wrong. Try again.");
    }

    setGenerating(false);
  }

  async function handleToggle(reportId: string, sugId: string, done: boolean) {
    // Optimistic update
    setReports((prev) =>
      prev.map((r) =>
        r.id === reportId
          ? {
              ...r,
              suggestions: r.suggestions.map((s) =>
                s.id === sugId ? { ...s, done } : s
              ),
            }
          : r
      )
    );

    await fetch(`/api/report/${reportId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ suggestionId: sugId, done }),
    });
  }

  return (
    <div className="p-6 lg:p-10 max-w-3xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-charcoal mb-1">Daily Reports</h1>
          <p className="text-sm text-warm-gray">
            AI analysis combining your traffic, revenue, and code activity.
          </p>
        </div>
        <button
          onClick={generateReport}
          disabled={generating}
          className="flex items-center gap-2 bg-charcoal hover:bg-charcoal/85 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all disabled:opacity-50 active:scale-[0.98] shrink-0"
        >
          {generating ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
              Generate report
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* No integrations nudge */}
      {!loading && reports.length === 0 && (
        <div className="bg-white rounded-2xl border border-cream-dark p-8 text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-terracotta/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-terracotta" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
          </div>
          <h2 className="text-base font-semibold text-charcoal mb-2">No reports yet</h2>
          <p className="text-sm text-warm-gray mb-5 max-w-xs mx-auto">
            Connect DataFast and GitHub in Settings for richer reports. Or generate one now with what Tasu already knows.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/settings"
              className="text-sm font-medium text-terracotta hover:text-terracotta-dark transition-colors"
            >
              Connect integrations →
            </Link>
            <span className="text-warm-gray/30">|</span>
            <button
              onClick={generateReport}
              disabled={generating}
              className="text-sm font-medium text-charcoal hover:text-terracotta transition-colors disabled:opacity-50"
            >
              Generate anyway
            </button>
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-cream-dark p-5 animate-pulse">
              <div className="h-4 bg-cream-dark rounded w-32 mb-3" />
              <div className="h-3 bg-cream-dark rounded w-full mb-2" />
              <div className="h-3 bg-cream-dark rounded w-4/5" />
            </div>
          ))}
        </div>
      )}

      {/* Reports list */}
      {!loading && reports.length > 0 && (
        <div className="space-y-5">
          {reports.map((report) => (
            <ReportCard key={report.id} report={report} onToggle={handleToggle} />
          ))}
        </div>
      )}
    </div>
  );
}
