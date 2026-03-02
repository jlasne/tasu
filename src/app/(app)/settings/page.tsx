"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [context, setContext] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("profiles")
      .select("website_url, business_context")
      .eq("id", user.id)
      .single();

    if (data) {
      setWebsiteUrl(data.website_url || "");
      setContext(data.business_context || "");
    }
    setLoading(false);
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);

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

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (loading) {
    return (
      <div className="p-6 lg:p-10">
        <p className="text-sm text-warm-gray">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-2xl">
      <h1 className="text-2xl font-bold text-charcoal mb-2">Settings</h1>
      <p className="text-sm text-warm-gray mb-8">
        Update your business context. Changes here make Tasu smarter.
      </p>

      <div className="space-y-6">
        {/* Website URL */}
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1">
            Website URL
          </label>
          <input
            type="url"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            placeholder="https://yourstartup.com"
            className="w-full px-4 py-2.5 rounded-xl border border-cream-dark bg-white text-charcoal placeholder:text-warm-gray/50 focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta transition"
          />
        </div>

        {/* Business context */}
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1">
            Business context
          </label>
          <p className="text-xs text-warm-gray mb-2">
            What you sell, who buys it, what&apos;s working, what&apos;s not.
          </p>
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            rows={8}
            className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-white text-charcoal placeholder:text-warm-gray/50 focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta transition resize-none"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-terracotta hover:bg-terracotta-dark text-white font-medium px-6 py-2.5 rounded-xl transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : saved ? "Saved!" : "Save changes"}
        </button>
      </div>

      {/* Coming soon */}
      <div className="mt-12">
        <h2 className="text-sm font-semibold text-charcoal mb-4">
          Integrations
        </h2>
        <div className="space-y-3">
          {[
            {
              name: "DataFast",
              desc: "Connect revenue analytics",
            },
            {
              name: "GitHub",
              desc: "Connect shipping activity",
            },
            {
              name: "Email check-ins",
              desc: "Get weekly nudges from Tasu",
            },
          ].map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between bg-white rounded-xl border border-cream-dark px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-charcoal">
                  {item.name}
                </p>
                <p className="text-xs text-warm-gray">{item.desc}</p>
              </div>
              <span className="text-xs bg-cream-dark text-warm-gray px-2.5 py-1 rounded-full">
                Coming soon
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
