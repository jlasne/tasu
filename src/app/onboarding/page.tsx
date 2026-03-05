"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function OnboardingPage() {
  const [name, setName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  async function handleComplete(e: React.FormEvent) {
    e.preventDefault();
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
      full_name: name,
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
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <svg width="52" height="52" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="85" y="85" width="330" height="330" rx="56" fill="#7B2C0E" transform="rotate(45 250 250)"/>
              <rect x="130" y="130" width="240" height="240" rx="40" fill="#C2581C" transform="rotate(45 250 250)"/>
              <rect x="178" y="178" width="144" height="144" rx="28" fill="#EDE7DF" transform="rotate(45 250 250)"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-charcoal mb-2">
            Almost there
          </h1>
          <p className="text-sm text-warm-gray">
            Tell Tasu a little about you so it can help you better.
          </p>
        </div>

        <form onSubmit={handleComplete} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">
              Your name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
              className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-white text-charcoal placeholder:text-warm-gray/50 focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta/40 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">
              Your website
            </label>
            <input
              type="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://yourstartup.com"
              className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-white text-charcoal placeholder:text-warm-gray/50 focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta/40 text-sm"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg animate-fade-in">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-charcoal hover:bg-charcoal/90 text-white font-medium py-3 rounded-xl transition-all disabled:opacity-50 text-sm active:scale-[0.98] mt-2"
          >
            {loading ? "Setting up..." : "Start chatting with Tasu"}
          </button>
        </form>
      </div>
    </div>
  );
}
