import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/chat";
  const websiteUrl = searchParams.get("url");
  const name = searchParams.get("name");

  if (code) {
    const supabase = createClient();
    const { error, data } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data.user) {
      // Save profile data if provided (from sign-up flow)
      if (websiteUrl || name) {
        await supabase.from("profiles").upsert({
          id: data.user.id,
          ...(websiteUrl ? { website_url: websiteUrl } : {}),
          ...(name ? { full_name: name } : {}),
          onboarded: true,
          updated_at: new Date().toISOString(),
        });
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login`);
}
