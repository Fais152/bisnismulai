import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const TOOL_SLUG = "hpp";

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
      // Save to history
      await supabase.from("tool_data_history").insert({
        tool_data_id: existing.id,
        user_id: user.id,
        tool_slug: TOOL_SLUG,
        data_snapshot: existing.data,
      });
      // Update current
      const { data: updated } = await supabase
        .from("tool_data")
        .update({ data: payload, version: (existing.version ?? 1) + 1 })
        .eq("id", existing.id)
        .select()
        .single();
      return NextResponse.json({ message: "Updated", data: updated });
    }

    const { data: created } = await supabase
      .from("tool_data")
      .insert({ user_id: user.id, tool_slug: TOOL_SLUG, data: payload })
      .select()
      .single();
    return NextResponse.json({ message: "Created", data: created }, { status: 201 });
  } catch (error: any) {
    console.error("API Tools HPP Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data } = await supabase
      .from("tool_data")
      .select("data")
      .eq("user_id", user.id)
      .eq("tool_slug", TOOL_SLUG)
      .single();

    return NextResponse.json({ data: data?.data ?? null });
  } catch (error: any) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
