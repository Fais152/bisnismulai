import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (!user || authError) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const admin = createAdminClient();
    const { data, error } = await admin
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      return NextResponse.json({
        data: {
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name ?? "",
          business_type: null,
          business_stage: null,
          initial_capital: null,
          target_monthly_revenue: null,
          onboarding_completed: false,
          current_phase: 1,
        }
      });
    }

    return NextResponse.json({ data });
  } catch (e: any) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { full_name, business_type, business_stage, initial_capital, target_monthly_revenue, current_phase } = body;

    if (full_name) {
      await supabase.auth.updateUser({ data: { full_name } });
    }

    const admin = createAdminClient();
    const { data, error } = await admin
      .from("users")
      .upsert({
        id: user.id,
        email: user.email!,
        full_name: full_name ?? user.user_metadata?.full_name ?? "User",
        business_type: business_type ?? null,
        business_stage: business_stage ?? null,
        initial_capital: initial_capital ? parseInt(initial_capital) : null,
        target_monthly_revenue: target_monthly_revenue ? parseInt(target_monthly_revenue) : null,
        ...(current_phase !== undefined && { current_phase }),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ data, message: "Profil berhasil diperbarui" });
  } catch (e: any) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
