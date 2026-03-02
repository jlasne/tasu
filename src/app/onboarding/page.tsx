"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [context, setContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  async function handleComplete() {
    setLoading(true);
    setError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Not authenticated.");
      setLoading(false);
      return;
    }

    const { error: upsertError } = await supabase.from("profiles").upsert({
      id: user.id,
      website_url: websiteUrl,
      business_context: context,
      onboarded: true,
      updated_at: new Date().toISOString(),
    });

    if (upsertError) {
      setError(upsertError.message);
      setLoading(false);
      return;
    }

    router.push("/chat");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-cream dot-grid flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-lg">
        {/* Progress */}
        <div className="flex items-center gap-3 mb-8">
          <div
            className={`h-1.5 flex-1 rounded-full ${step >= 1 ? "bg-terracotta" : "bg-cream-dark"}`}
          />
          <div
            className={`h-1.5 flex-1 rounded-full ${step >= 2 ? "bg-terracotta" : "bg-cream-dark"}`}
          />
        </div>

        <div className="mb-2">
          <span className="text-xs text-warm-gray uppercase tracking-wide">
            Step {step} of 2
          </span>
        </div>

        {step === 1 && (
          <>
            <h1 className="text-2xl font-bold text-charcoal mb-2">
              What&apos;s your startup&apos;s landing page?
            </h1>
            <p className="text-sm text-warm-gray mb-6">
              Tasu will use this to understand your positioning and messaging.
            </p>
            <input
              type="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://yourstartup.com"
              className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-white text-charcoal placeholder:text-warm-gray/50 focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta transition mb-6"
            />
            <button
              onClick={() => setStep(2)}
              className="w-full bg-terracotta hover:bg-terracotta-dark text-white font-medium py-3 rounded-xl transition-colors"
            >
              Next
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="text-2xl font-bold text-charcoal mb-2">
              Give Tasu context about your business
            </h1>
            <p className="text-sm text-warm-gray mb-6">
              What do you sell? Who buys it? What&apos;s working? What&apos;s
              not? Be honest — Tasu works best with real context.
            </p>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              rows={8}
              placeholder="We sell a project management tool for freelancers. Most users come from Twitter. Our conversion rate from landing page is about 2%. We charge $19/mo and have 34 paying customers..."
              className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-white text-charcoal placeholder:text-warm-gray/50 focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta transition resize-none mb-2"
            />
            <p className="text-xs text-warm-gray mb-6">
              You can update this anytime in Settings.
            </p>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg mb-4">
                {error}
              </p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 rounded-xl border border-cream-dark text-charcoal font-medium hover:bg-cream-dark/30 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleComplete}
                disabled={loading}
                className="flex-1 bg-terracotta hover:bg-terracotta-dark text-white font-medium py-3 rounded-xl transition-colors disabled:opacity-50"
              >
                {loading ? "Saving..." : "Start chatting with Tasu"}
              </button>
            </div>

            <div className="mt-8 p-4 rounded-xl bg-cream-dark/30 border border-cream-dark">
              <p className="text-xs text-warm-gray font-medium mb-2">
                Coming soon
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs bg-white px-2.5 py-1 rounded-full text-warm-gray border border-cream-dark">
                  DataFast — revenue analytics
                </span>
                <span className="text-xs bg-white px-2.5 py-1 rounded-full text-warm-gray border border-cream-dark">
                  GitHub — shipping activity
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
