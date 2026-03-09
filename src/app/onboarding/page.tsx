"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

function TasuLogoIcon({ size = 52 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="85" y="85" width="330" height="330" rx="56" fill="#7B2C0E" transform="rotate(45 250 250)"/>
      <rect x="130" y="130" width="240" height="240" rx="40" fill="#C2581C" transform="rotate(45 250 250)"/>
      <rect x="178" y="178" width="144" height="144" rx="28" fill="#EDE7DF" transform="rotate(45 250 250)"/>
    </svg>
  );
}

const steps = ["basics", "datafast", "revenue", "github", "integrations"] as const;
type Step = typeof steps[number];

export default function OnboardingPage() {
  const [step, setStep] = useState<Step>("basics");
  const [name, setName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [datafastKey, setDatafastKey] = useState("");
  const [selfReportedMrr, setSelfReportedMrr] = useState("");
  const [githubRepo, setGithubRepo] = useState("");
  const [githubToken, setGithubToken] = useState("");
  const [integrationRequest, setIntegrationRequest] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const currentIdx = steps.indexOf(step);

  function next() {
    if (currentIdx < steps.length - 1) {
      setStep(steps[currentIdx + 1]);
    } else {
      handleComplete();
    }
  }

  function skip() {
    if (currentIdx < steps.length - 1) {
      setStep(steps[currentIdx + 1]);
    } else {
      handleComplete();
    }
  }

  async function handleComplete() {
    setLoading(true);
    setError("");

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("Not authenticated."); setLoading(false); return; }

    // Save profile — try with full_name first, fallback without if column missing
    const baseProfile = {
      id: user.id,
      website_url: websiteUrl,
      self_reported_mrr: selfReportedMrr ? parseInt(selfReportedMrr) : null,
      onboarded: true,
      updated_at: new Date().toISOString(),
    };

    const { error: profileErr } = await supabase.from("profiles").upsert({
      ...baseProfile,
      full_name: name,
    });

    if (profileErr) {
      // Column might not exist yet in DB — retry without full_name so onboarding never blocks
      const { error: profileErr2 } = await supabase.from("profiles").upsert(baseProfile);
      if (profileErr2) { setError(profileErr2.message); setLoading(false); return; }
    }

    // Save integrations
    const intData: Record<string, string> = { user_id: user.id };
    if (datafastKey) intData.datafast_api_key = datafastKey;
    if (githubRepo) intData.github_repo_url = githubRepo;
    if (githubToken) intData.github_token = githubToken;

    if (datafastKey || githubRepo) {
      await supabase.from("integrations").upsert(intData);
    }

    // Save integration request
    if (integrationRequest.trim()) {
      await supabase.from("integration_requests").insert({
        user_id: user.id,
        tool_name: integrationRequest.trim(),
      });
    }

    // Webhook POST
    try {
      await fetch("https://n8n.tasu.ai/webhook/1e61bdd1-b319-40d1-b1bf-10fbbcca220b", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          website_url: websiteUrl,
          name,
          self_reported_mrr: selfReportedMrr ? parseInt(selfReportedMrr) : null,
          has_datafast: !!datafastKey,
          has_github: !!githubRepo,
          integration_request: integrationRequest.trim() || null,
        }),
      });
    } catch { /* non-blocking */ }

    router.push("/chat");
    router.refresh();
  }

  const inputCls = "w-full px-4 py-3 rounded-xl border border-cream-dark bg-white text-charcoal placeholder:text-warm-gray/50 focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta/40 text-sm";

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md animate-fade-in-up">
        {/* Logo + progress */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <TasuLogoIcon />
          </div>
          <div className="flex justify-center gap-1.5 mb-6">
            {steps.map((s, i) => (
              <div key={s} className={`h-1 rounded-full transition-all ${i <= currentIdx ? "w-8 bg-terracotta" : "w-4 bg-cream-dark"}`} />
            ))}
          </div>
        </div>

        {/* ── Step: Basics ── */}
        {step === "basics" && (
          <div className="space-y-4 animate-fade-in">
            <h1 className="text-xl font-bold text-charcoal text-center">Let&apos;s get started</h1>
            <p className="text-sm text-warm-gray text-center">Tell Tasu about you and your project.</p>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">Your name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">Website link</label>
              <input type="url" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} placeholder="https://yourstartup.com" className={inputCls} />
            </div>
            <button onClick={next} className="w-full bg-charcoal hover:bg-charcoal/90 text-white font-medium py-3 rounded-xl transition-all text-sm active:scale-[0.98]">
              Continue
            </button>
          </div>
        )}

        {/* ── Step: DataFast ── */}
        {step === "datafast" && (
          <div className="space-y-4 animate-fade-in">
            <h1 className="text-xl font-bold text-charcoal text-center">Connect DataFast</h1>
            <p className="text-sm text-warm-gray text-center">
              Tasu reads your traffic and revenue — read-only, never writes.
            </p>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">DataFast API Key</label>
              <input type="password" value={datafastKey} onChange={(e) => setDatafastKey(e.target.value)} placeholder="df_live_..." className={`${inputCls} font-mono`} />
              <p className="text-xs text-warm-gray/60 mt-1.5">
                Don&apos;t have DataFast?{" "}
                <a href="https://datafa.st/?via=jeremy-lasne" target="_blank" rel="noopener noreferrer" className="text-terracotta hover:text-terracotta-dark font-medium">
                  Create an account (free)
                </a>
              </p>
            </div>
            <button onClick={next} className="w-full bg-charcoal hover:bg-charcoal/90 text-white font-medium py-3 rounded-xl transition-all text-sm active:scale-[0.98]">
              {datafastKey ? "Continue" : "Skip for now"}
            </button>
          </div>
        )}

        {/* ── Step: Self-reported revenue ── */}
        {step === "revenue" && (
          <div className="space-y-4 animate-fade-in">
            <h1 className="text-xl font-bold text-charcoal text-center">Your current revenue</h1>
            <p className="text-sm text-warm-gray text-center">
              {datafastKey
                ? "DataFast handles traffic — this helps us understand your revenue stage."
                : "Without DataFast, this helps Tasu calibrate advice to your stage."}
            </p>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">Monthly recurring revenue (MRR)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-gray text-sm">$</span>
                <input
                  type="number"
                  value={selfReportedMrr}
                  onChange={(e) => setSelfReportedMrr(e.target.value)}
                  placeholder="0"
                  className={`${inputCls} pl-8`}
                />
              </div>
            </div>
            <button onClick={next} className="w-full bg-charcoal hover:bg-charcoal/90 text-white font-medium py-3 rounded-xl transition-all text-sm active:scale-[0.98]">
              Continue
            </button>
            <button onClick={skip} className="w-full text-sm text-warm-gray hover:text-charcoal transition-colors py-2">
              Skip
            </button>
          </div>
        )}

        {/* ── Step: GitHub ── */}
        {step === "github" && (
          <div className="space-y-4 animate-fade-in">
            <h1 className="text-xl font-bold text-charcoal text-center">Connect GitHub</h1>
            <p className="text-sm text-warm-gray text-center">
              Track your shipping velocity. Read-only — we just count commits.
            </p>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">Repository</label>
              <input type="text" value={githubRepo} onChange={(e) => setGithubRepo(e.target.value)} placeholder="owner/repo" className={`${inputCls} font-mono`} />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">Token (private repos only)</label>
              <input type="password" value={githubToken} onChange={(e) => setGithubToken(e.target.value)} placeholder="ghp_..." className={`${inputCls} font-mono`} />
            </div>
            <button onClick={next} className="w-full bg-charcoal hover:bg-charcoal/90 text-white font-medium py-3 rounded-xl transition-all text-sm active:scale-[0.98]">
              {githubRepo ? "Continue" : "Skip for now"}
            </button>
          </div>
        )}

        {/* ── Step: Integration request ── */}
        {step === "integrations" && (
          <div className="space-y-4 animate-fade-in">
            <h1 className="text-xl font-bold text-charcoal text-center">What else do you use?</h1>
            <p className="text-sm text-warm-gray text-center">
              We&apos;re adding more integrations. Tell us what you need so we build it.
            </p>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">Tools you want integrated</label>
              <input
                type="text"
                value={integrationRequest}
                onChange={(e) => setIntegrationRequest(e.target.value)}
                placeholder="Stripe, PostHog, Plausible, Crisp..."
                className={inputCls}
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg animate-fade-in">{error}</p>
            )}

            <button
              onClick={handleComplete}
              disabled={loading}
              className="w-full bg-terracotta hover:bg-terracotta-dark text-white font-medium py-3 rounded-xl transition-all text-sm active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? "Setting up..." : "Done — start chatting"}
            </button>
            <button onClick={skip} disabled={loading} className="w-full text-sm text-warm-gray hover:text-charcoal transition-colors py-2 disabled:opacity-50">
              Skip
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
