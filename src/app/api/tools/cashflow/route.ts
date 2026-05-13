import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const TOOL_SLUG = "cashflow";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = await request.json();

    const { data: existing } = await supabase
      .from("tool_data")
      .select("id, data, version")
      .eq("user_id", user.id)
      .eq("tool_slug", TOOL_SLUG)
      .single();

    if (existing) {
      try {
        await supabase.from("tool_data_history").insert({
          tool_data_id: existing.id,
          user_id: user.id,
          tool_slug: TOOL_SLUG,
          data_snapshot: existing.data,
        });
      } catch (_) { }

      const { data: updated, error } = await supabase
        .from("tool_data")
        .update({ data: payload, version: (existing.version ?? 1) + 1, updated_at: new Date().toISOString() })
        .eq("id", existing.id)
        .select()
        .single();

      if (error) {
        console.error("Cashflow update error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ message: "Updated", data: updated });
    }

    const { data: created, error } = await supabase
      .from("tool_data")
      .insert({ user_id: user.id, tool_slug: TOOL_SLUG, data: payload })
      .select()
      .single();

    if (error) {
      console.error("Cashflow insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: "Created", data: created }, { status: 201 });

  } catch (error: any) {
    console.error("API Tools Cashflow Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase
      .from("tool_data")
      .select("data")
      .eq("user_id", user.id)
      .eq("tool_slug", TOOL_SLUG)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Cashflow GET error:", error);
    }

    return NextResponse.json({ data: data?.data ?? null });
  } catch (error: any) {
    console.error("Cashflow GET exception:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
