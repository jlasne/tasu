import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const DATAFAST_BASE = "https://datafa.st/api/v1/analytics";

export async function GET() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get user's DataFast API key
  const { data: integration } = await supabase
    .from("integrations")
    .select("datafast_api_key")
    .eq("user_id", user.id)
    .single();

  if (!integration?.datafast_api_key) {
    return NextResponse.json({ error: "DataFast not connected" }, { status: 404 });
  }

  const apiKey = integration.datafast_api_key;
  const headers = { Authorization: `Bearer ${apiKey}` };

  // Date range: last 30 days
  const endAt = new Date().toISOString().split("T")[0];
  const startAt = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  try {
    // Fetch overview + timeseries in parallel
    const [overviewRes, timeseriesRes] = await Promise.all([
      fetch(
        `${DATAFAST_BASE}/overview?startAt=${startAt}&endAt=${endAt}&fields=visitors,sessions,bounce_rate,avg_session_duration,revenue,revenue_per_visitor,conversion_rate`,
        { headers }
      ),
      fetch(
        `${DATAFAST_BASE}/timeseries?startAt=${startAt}&endAt=${endAt}&fields=visitors,sessions,revenue,conversion_rate,name`,
        { headers }
      ),
    ]);

    if (!overviewRes.ok) {
      const errText = await overviewRes.text();
      return NextResponse.json(
        { error: `DataFast overview error: ${overviewRes.status}`, detail: errText },
        { status: overviewRes.status }
      );
    }

    const [overview, timeseries] = await Promise.all([
      overviewRes.json(),
      timeseriesRes.ok ? timeseriesRes.json() : { data: [] },
    ]);

    return NextResponse.json({
      overview: overview.data?.[0] ?? null,
      timeseries: timeseries.data ?? [],
      totals: timeseries.totals ?? null,
      period: { startAt, endAt },
    });
  } catch (err) {
    console.error("DataFast fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch DataFast data" }, { status: 500 });
  }
}
