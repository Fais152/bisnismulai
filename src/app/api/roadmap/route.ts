import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (!user || authError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user profile for current_phase and onboarding status
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("current_phase, onboarding_completed")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 });
    }

    if (!profile.onboarding_completed) {
      return NextResponse.json({ error: "Onboarding not completed", redirect: "/onboarding" }, { status: 403 });
    }

    // Get all phase progress for this user
    const { data: phases, error: phasesError } = await supabase
      .from("phase_progress")
      .select("*")
      .eq("user_id", user.id)
      .order("phase_number", { ascending: true });

    if (phasesError) {
      console.error("Error fetching roadmap phases:", phasesError);
      return NextResponse.json({ error: "Failed to fetch roadmap data" }, { status: 500 });
    }

    // Calculate overall progress based on completed checklist items across all phases
    let totalItems = 0;
    let completedItems = 0;

    const formattedPhases = phases.map((p) => {
      const checklist = (p.checklist_items || []) as any[];
      const doneCount = checklist.filter((item) => item.completed).length;
      
      totalItems += checklist.length;
      completedItems += doneCount;

      // Define titles and durations based on phase number
      const phaseMeta: Record<number, { title: string, tagline: string, duration: string }> = {
        1: { title: "Mental Reset", tagline: "Bongkar mindset sebelum mulai", duration: "Minggu 1–2" },
        2: { title: "Validasi Ide", tagline: "Uji ide sebelum modal keluar", duration: "Minggu 2–6" },
        3: { title: "Bangun Fondasi", tagline: "Sistem sebelum skala", duration: "Bulan 2–3" },
        4: { title: "Launch Pertama", tagline: "Dapatkan 10 pelanggan pertama", duration: "Bulan 3–5" },
        5: { title: "Stabilisasi", tagline: "Dari chaos ke sistem yang berulang", duration: "Bulan 5–9" },
        6: { title: "Skala", tagline: "Tumbuh dengan sengaja, bukan kebetulan", duration: "Bulan 9+" }
      };

      const meta = phaseMeta[p.phase_number] || { title: "Unknown", tagline: "", duration: "" };

      return {
        phase_number: p.phase_number,
        name: meta.title,
        tagline: meta.tagline,
        status: p.status,
        duration_label: meta.duration,
        checklist_progress: { done: doneCount, total: checklist.length },
        completed_at: p.completed_at
      };
    });

    const overall_progress_pct = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

    return NextResponse.json({
      current_phase: profile.current_phase || 1,
      overall_progress_pct,
      phases: formattedPhases
    });

  } catch (error: any) {
    console.error("Roadmap GET exception:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
