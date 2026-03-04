"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xs font-semibold text-warm-gray uppercase tracking-wide mb-4">{children}</h2>;
}

function Field({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-charcoal mb-1">{label}</label>
      {description && <p className="text-xs text-warm-gray mb-2">{description}</p>}
      {children}
    </div>
  );
}

export default function SettingsPage() {
  // Profile
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [context, setContext] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  // Integrations
  const [datafastKey, setDatafastKey] = useState("");
  const [githubRepo, setGithubRepo] = useState("");
  const [githubToken, setGithubToken] = useState("");
  const [datafastConnected, setDatafastConnected] = useState(false);
  const [githubConnected, setGithubConnected] = useState(false);
  const [integrationSaving, setIntegrationSaving] = useState(false);
  const [integrationSaved, setIntegrationSaved] = useState(false);

  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const [{ data: profile }, { data: integration }] = await Promise.all([
      supabase
        .from("profiles")
        .select("website_url, business_context")
        .eq("id", user.id)
        .single(),
      supabase
        .from("integrations")
        .select("datafast_api_key, github_repo_url, github_token")
        .eq("user_id", user.id)
        .single(),
    ]);

    if (profile) {
      setWebsiteUrl(profile.website_url || "");
      setContext(profile.business_context || "");
    }

    if (integration) {
      setDatafastKey(integration.datafast_api_key ? "••••••••" : "");
      setDatafastConnected(!!integration.datafast_api_key);
      setGithubRepo(integration.github_repo_url || "");
      setGithubToken(integration.github_token ? "••••••••" : "");
      setGithubConnected(!!integration.github_repo_url);
    }

    setLoading(false);
  }

  async function saveProfile() {
    setProfileSaving(true);
    setProfileSaved(false);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("profiles").upsert({
      id: user.id,
      website_url: websiteUrl,
      business_context: context,
      updated_at: new Date().toISOString(),
    });

    setProfileSaving(false);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  }

  async function saveIntegrations() {
    setIntegrationSaving(true);
    setIntegrationSaved(false);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const upsertData: Record<string, string | boolean> = {
      user_id: user.id,
      updated_at: new Date().toISOString(),
      github_repo_url: githubRepo,
    };

    // Only update key if it's been changed (not masked)
    if (datafastKey && !datafastKey.includes("•")) {
      upsertData.datafast_api_key = datafastKey;
    }
    if (githubToken && !githubToken.includes("•")) {
      upsertData.github_token = githubToken;
    }

    await supabase.from("integrations").upsert(upsertData);

    setIntegrationSaving(false);
    setIntegrationSaved(true);
    setDatafastConnected(!!datafastKey);
    setGithubConnected(!!githubRepo);
    setTimeout(() => setIntegrationSaved(false), 2000);
  }

  if (loading) {
    return (
      <div className="p-6 lg:p-10">
        <div className="animate-pulse space-y-4 max-w-2xl">
          <div className="h-7 bg-cream-dark rounded w-32" />
          <div className="h-4 bg-cream-dark rounded w-64" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-2xl space-y-10">
      {/* ── Profile ── */}
      <section>
        <SectionTitle>Business profile</SectionTitle>
        <div className="space-y-4">
          <Field label="Website URL">
            <input
              type="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://yourstartup.com"
              className="w-full px-4 py-2.5 rounded-xl border border-cream-dark bg-white text-charcoal placeholder:text-warm-gray/40 focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta/40 text-sm transition"
            />
          </Field>
          <Field
            label="Business context"
            description="What you sell, who buys it, what's working, what's not. Tasu uses this to personalize every message."
          >
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              rows={6}
              className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-white text-charcoal placeholder:text-warm-gray/40 focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta/40 text-sm transition resize-none"
              placeholder="E.g. SaaS tool for indie developers, $29/mo, ~40 users, main issue is low trial conversion..."
            />
          </Field>
          <button
            onClick={saveProfile}
            disabled={profileSaving}
            className="bg-charcoal hover:bg-charcoal/85 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-all disabled:opacity-50 active:scale-[0.98]"
          >
            {profileSaving ? "Saving..." : profileSaved ? "Saved ✓" : "Save profile"}
          </button>
        </div>
      </section>

      <div className="border-t border-cream-dark" />

      {/* ── DataFast ── */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <SectionTitle>DataFast — Revenue & Traffic</SectionTitle>
          {datafastConnected && (
            <span className="text-[10px] font-medium bg-green-100 text-green-700 px-2 py-0.5 rounded-full mb-4">
              Connected
            </span>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-cream-dark p-5 space-y-4">
          <p className="text-sm text-warm-gray leading-relaxed">
            Connect DataFast to pull real revenue, traffic, and conversion data into your daily reports.
            {!datafastConnected && (
              <> Don&apos;t have DataFast?{" "}
                <a
                  href="https://datafa.st/?via=jeremy-lasne"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-terracotta hover:text-terracotta-dark font-medium transition-colors"
                >
                  Sign up here ↗
                </a>
              </>
            )}
          </p>

          <Field label="DataFast API Key">
            <input
              type="password"
              value={datafastKey}
              onChange={(e) => setDatafastKey(e.target.value)}
              onFocus={() => {
                if (datafastKey.includes("•")) setDatafastKey("");
              }}
              placeholder="df_live_..."
              className="w-full px-4 py-2.5 rounded-xl border border-cream-dark bg-white text-charcoal placeholder:text-warm-gray/40 focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta/40 text-sm font-mono transition"
            />
            <p className="text-xs text-warm-gray/60 mt-1.5">
              Find your API key in DataFast → Website settings → API tab.
            </p>
          </Field>
        </div>
      </section>

      {/* ── GitHub ── */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <SectionTitle>GitHub — Shipping activity</SectionTitle>
          {githubConnected && (
            <span className="text-[10px] font-medium bg-green-100 text-green-700 px-2 py-0.5 rounded-full mb-4">
              Connected
            </span>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-cream-dark p-5 space-y-4">
          <p className="text-sm text-warm-gray leading-relaxed">
            Tasu reads your commit activity to track shipping velocity and keep you accountable on momentum.
          </p>

          <Field label="Repository" description="Your main project repo (public repos don't need a token).">
            <input
              type="text"
              value={githubRepo}
              onChange={(e) => setGithubRepo(e.target.value)}
              placeholder="owner/repo or https://github.com/owner/repo"
              className="w-full px-4 py-2.5 rounded-xl border border-cream-dark bg-white text-charcoal placeholder:text-warm-gray/40 focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta/40 text-sm font-mono transition"
            />
          </Field>

          <Field
            label="Personal Access Token (optional)"
            description="Required only for private repos. Needs repo read scope."
          >
            <input
              type="password"
              value={githubToken}
              onChange={(e) => setGithubToken(e.target.value)}
              onFocus={() => {
                if (githubToken.includes("•")) setGithubToken("");
              }}
              placeholder="ghp_..."
              className="w-full px-4 py-2.5 rounded-xl border border-cream-dark bg-white text-charcoal placeholder:text-warm-gray/40 focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta/40 text-sm font-mono transition"
            />
          </Field>
        </div>
      </section>

      {/* Save integrations */}
      <button
        onClick={saveIntegrations}
        disabled={integrationSaving}
        className="bg-charcoal hover:bg-charcoal/85 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-all disabled:opacity-50 active:scale-[0.98]"
      >
        {integrationSaving ? "Saving..." : integrationSaved ? "Saved ✓" : "Save integrations"}
      </button>
    </div>
  );
}
