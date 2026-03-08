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

interface Task {
  id: string;
  content: string;
  done: boolean;
  pinned: boolean;
  source: string;
}

interface Integration {
  datafast_api_key: string | null;
  github_repo_url: string | null;
}

const categoryColors: Record<string, string> = {
  positioning: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
  conversion: "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  distribution: "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800",
  code: "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800",
  accountability: "bg-terracotta/10 text-terracotta border-terracotta/20",
  general: "bg-cream dark:bg-dark-border text-warm-gray dark:text-dark-muted border-cream-dark dark:border-dark-border",
};

function MetricCard({ label, value, unit }: { label: string; value: string | number | null; unit?: string }) {
  return (
    <div className="bg-white dark:bg-dark-surface rounded-xl border border-cream-dark dark:border-dark-border p-3">
      <p className="text-[11px] text-warm-gray dark:text-dark-muted mb-0.5">{label}</p>
      <p className="text-lg font-semibold text-charcoal dark:text-dark-text">
        {value === null || value === undefined ? (
          <span className="text-warm-gray/40 text-base">&mdash;</span>
        ) : (
          <>
            {unit === "$" && <span className="text-sm mr-0.5">$</span>}
            {value}
            {unit && unit !== "$" && <span className="text-xs text-warm-gray dark:text-dark-muted ml-0.5">{unit}</span>}
          </>
        )}
      </p>
    </div>
  );
}

function ReportCard({ report, onToggle }: { report: DailyReport; onToggle: (reportId: string, sugId: string, done: boolean) => void }) {
  const today = new Date().toISOString().split("T")[0] === report.date;
  const doneCount = report.suggestions?.filter((s) => s.done).length ?? 0;
  const total = report.suggestions?.length ?? 0;

  return (
    <div className="bg-white dark:bg-dark-surface rounded-2xl border border-cream-dark dark:border-dark-border overflow-hidden">
      <div className="px-5 py-4 border-b border-cream-dark/60 dark:border-dark-border flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-sm font-semibold text-charcoal dark:text-dark-text">
              {today ? "Today" : new Date(report.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
            </span>
            {today && (
              <span className="text-[10px] font-medium bg-terracotta/10 text-terracotta px-2 py-0.5 rounded-full">Latest</span>
            )}
          </div>
          <p className="text-xs text-warm-gray dark:text-dark-muted">{report.date}</p>
        </div>
        {total > 0 && (
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-24 rounded-full bg-cream-dark dark:bg-dark-border overflow-hidden">
              <div className="h-full rounded-full bg-terracotta transition-all" style={{ width: `${(doneCount / total) * 100}%` }} />
            </div>
            <span className="text-xs text-warm-gray dark:text-dark-muted">{doneCount}/{total}</span>
          </div>
        )}
      </div>

      {report.metrics && (
        <div className="px-5 py-4 grid grid-cols-2 sm:grid-cols-4 gap-3 border-b border-cream-dark/60 dark:border-dark-border">
          <MetricCard label="Visitors (30d)" value={report.metrics.visitors_30d ?? null} />
          <MetricCard label="Revenue (30d)" value={report.metrics.revenue_30d ?? null} unit="$" />
          <MetricCard label="Conversion" value={report.metrics.conversion_rate != null ? `${report.metrics.conversion_rate}` : null} unit="%" />
          <MetricCard label="Commits (30d)" value={report.metrics.commits_30d ?? null} />
        </div>
      )}

      {report.summary && (
        <div className="px-5 py-4 border-b border-cream-dark/60 dark:border-dark-border">
          <p className="text-sm text-charcoal dark:text-dark-text leading-relaxed">{report.summary}</p>
        </div>
      )}

      {report.suggestions && report.suggestions.length > 0 && (
        <div className="px-5 py-4 space-y-2.5">
          <p className="text-xs font-medium text-warm-gray dark:text-dark-muted uppercase tracking-wide mb-3">Actions</p>
          {report.suggestions.map((s) => (
            <label
              key={s.id}
              className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all group ${
                s.done
                  ? "bg-cream/60 dark:bg-dark-border/30 border-cream-dark dark:border-dark-border opacity-60"
                  : "bg-white dark:bg-dark-surface border-cream-dark dark:border-dark-border hover:border-terracotta/30"
              }`}
            >
              <div className="mt-0.5 shrink-0">
                <input type="checkbox" checked={s.done} onChange={(e) => onToggle(report.id, s.id, e.target.checked)} className="sr-only" />
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                  s.done ? "border-terracotta bg-terracotta" : "border-cream-dark dark:border-dark-muted group-hover:border-terracotta/50"
                }`}>
                  {s.done && (
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  )}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm leading-snug ${s.done ? "line-through text-warm-gray dark:text-dark-muted" : "text-charcoal dark:text-dark-text"}`}>
                  {s.text}
                </p>
              </div>
              {s.category && (
                <span className={`shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full border ${categoryColors[s.category] ?? categoryColors.general}`}>
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
  const [tasks, setTasks] = useState<Task[]>([]);
  const [integration, setIntegration] = useState<Integration | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { loadReports(); }, []);

  async function loadReports() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const [{ data: reportData }, { data: integrationData }, { data: taskData }] = await Promise.all([
      supabase.from("daily_reports").select("*").eq("user_id", user.id).order("date", { ascending: false }).limit(14),
      supabase.from("integrations").select("datafast_api_key, github_repo_url").eq("user_id", user.id).single(),
      supabase.from("tasks").select("*").eq("user_id", user.id).eq("done", false).order("created_at", { ascending: false }).limit(20),
    ]);

    if (reportData) setReports(reportData as DailyReport[]);
    if (integrationData) setIntegration(integrationData as Integration);
    if (taskData) setTasks(taskData as Task[]);
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

  async function toggleTaskDone(taskId: string) {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    await supabase.from("tasks").update({ done: true, completed_at: new Date().toISOString() }).eq("id", taskId);
  }

  const hasMissing = !integration?.datafast_api_key || !integration?.github_repo_url;

  return (
    <div className="flex-1 overflow-y-auto bg-cream dark:bg-dark-bg">
      <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-charcoal dark:text-dark-text mb-1">Daily Reports</h1>
            <p className="text-sm text-warm-gray dark:text-dark-muted">Generated automatically every morning based on your data.</p>
          </div>
          <div className="flex items-center gap-1.5 bg-white dark:bg-dark-surface border border-cream-dark dark:border-dark-border rounded-xl px-3 py-2 text-xs text-warm-gray dark:text-dark-muted shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Auto-generated
          </div>
        </div>

        {/* Open tasks */}
        {tasks.length > 0 && (
          <div className="bg-white dark:bg-dark-surface rounded-2xl border border-cream-dark dark:border-dark-border p-5">
            <p className="text-xs font-semibold text-warm-gray dark:text-dark-muted uppercase tracking-wide mb-3">Open tasks</p>
            <div className="space-y-2">
              {tasks.map((task) => (
                <div key={task.id} className="flex items-start gap-3 group">
                  <button onClick={() => toggleTaskDone(task.id)} className="mt-0.5 shrink-0">
                    <div className="w-4 h-4 rounded border-2 border-cream-dark dark:border-dark-muted group-hover:border-terracotta/50 transition-all" />
                  </button>
                  <p className="text-sm text-charcoal dark:text-dark-text leading-snug">{task.content}</p>
                  <span className="text-[10px] text-warm-gray/40 dark:text-dark-muted/40 shrink-0 mt-0.5">{task.source}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {hasMissing && (
          <div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-3 text-sm">
            <svg className="w-4 h-4 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <span className="text-amber-800 dark:text-amber-200">
              Connect DataFast &amp; GitHub for live data.{" "}
              <Link href="/settings" className="underline font-semibold hover:text-amber-900 dark:hover:text-amber-100">Settings</Link>
            </span>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="flex gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-warm-gray/25 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-warm-gray/25 animate-bounce [animation-delay:0.15s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-warm-gray/25 animate-bounce [animation-delay:0.3s]" />
            </div>
          </div>
        ) : reports.length === 0 ? (
          <div className="bg-white dark:bg-dark-surface rounded-2xl border border-cream-dark dark:border-dark-border p-10 text-center">
            <h3 className="text-sm font-semibold text-charcoal dark:text-dark-text mb-2">Your first report is on its way</h3>
            <p className="text-xs text-warm-gray dark:text-dark-muted max-w-xs mx-auto">
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
