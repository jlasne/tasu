import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// PATCH /api/report/[id] — toggle a suggestion's done status
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { suggestionId, done } = await req.json();

  // Fetch the report
  const { data: report, error } = await supabase
    .from("daily_reports")
    .select("suggestions, user_id")
    .eq("id", params.id)
    .single();

  if (error || !report) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }

  if (report.user_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Update suggestion done status
  const updatedSuggestions = (report.suggestions as Array<{ id: string; done: boolean }>).map(
    (s) => (s.id === suggestionId ? { ...s, done } : s)
  );

  const { error: updateError } = await supabase
    .from("daily_reports")
    .update({ suggestions: updatedSuggestions })
    .eq("id", params.id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
