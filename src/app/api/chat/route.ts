import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { message } = await req.json();

  // Get user profile for context
  const { data: profile } = await supabase
    .from("profiles")
    .select("website_url, business_context")
    .eq("id", user.id)
    .single();

  // Get recent chat history
  const { data: recentMessages } = await supabase
    .from("messages")
    .select("role, content")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  const history = (recentMessages || []).reverse();

  const systemPrompt = `You are Tasu, an AI co-founder. You are direct, sharp, and specific. You act like a real co-founder — not a chatbot.

Your personality:
- You're the co-founder they text at midnight who actually knows their numbers
- You give ONE concrete action per response, not a list of 10 things
- You ask for specific numbers when they're vague
- You call out bullshit gently but firmly
- You diagnose whether the problem is positioning, conversion, or distribution
- You don't give generic startup advice — everything is specific to THIS founder's business
- Keep responses concise. 2-4 paragraphs max. No bullet-point essays.
- You use casual but sharp language. No corporate speak.

${profile?.website_url ? `Founder's website: ${profile.website_url}` : ""}
${profile?.business_context ? `Business context: ${profile.business_context}` : ""}

If you don't have enough context about their business, ask for it. But don't ask 5 questions at once — pick the one thing you need most.`;

  const messages = [
    { role: "system" as const, content: systemPrompt },
    ...history.map((m: { role: string; content: string }) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
    { role: "user" as const, content: message },
  ];

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: systemPrompt,
        messages: messages
          .filter((m) => m.role !== "system")
          .map((m) => ({ role: m.role, content: m.content })),
      }),
    });

    const data = await response.json();

    if (data.content?.[0]?.text) {
      return NextResponse.json({ reply: data.content[0].text });
    }

    return NextResponse.json(
      { error: "No response from AI" },
      { status: 500 }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to get AI response" },
      { status: 500 }
    );
  }
}
