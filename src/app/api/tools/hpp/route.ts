import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const TOOL_SLUG = "hpp";

export async function POST(request: Request) {
  try {
    // 1. Verify auth with regular client
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // 2. Use admin client for DB writes (bypasses RLS)
    const admin = createAdminClient();
    const payload = await request.json();

    const { data: existing } = await admin
      .from("tool_data")
      .select("id, data, version")
      .eq("user_id", user.id)
      .eq("tool_slug", TOOL_SLUG)
      .single();

    if (existing) {
      // Save snapshot to history (ignore error if table missing)
      try {
        await admin.from("tool_data_history").insert({
          tool_data_id: existing.id,
          user_id: user.id,
          tool_slug: TOOL_SLUG,
          data_snapshot: existing.data,
        });
      } catch (_) { /* history is optional, don't block save */ }

      const { data: updated, error } = await admin
        .from("tool_data")
        .update({ data: payload, version: (existing.version ?? 1) + 1, updated_at: new Date().toISOString() })
        .eq("id", existing.id)
        .select()
        .single();

      if (error) {
        console.error("HPP update error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ message: "Updated", data: updated });
    }

    // First save — INSERT
    const { data: created, error } = await admin
      .from("tool_data")
      .insert({ user_id: user.id, tool_slug: TOOL_SLUG, data: payload })
      .select()
      .single();

    if (error) {
      console.error("HPP insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: "Created", data: created }, { status: 201 });

  } catch (error: any) {
    console.error("API Tools HPP Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    // 1. Verify auth
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // 2. Use admin client for DB reads
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("tool_data")
      .select("data")
      .eq("user_id", user.id)
      .eq("tool_slug", TOOL_SLUG)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 = "no rows returned" — that's fine for first-time users
      console.error("HPP GET error:", error);
    }

    return NextResponse.json({ data: data?.data ?? null });
  } catch (error: any) {
    console.error("HPP GET exception:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
