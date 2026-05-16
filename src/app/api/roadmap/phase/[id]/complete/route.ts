import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (!user || authError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const phaseId = parseInt(id);
    if (isNaN(phaseId) || phaseId < 1 || phaseId > 6) {
      return NextResponse.json({ error: "Invalid phase ID" }, { status: 400 });
    }

    // Prevent completing phase 6 (it's ongoing)
    if (phaseId === 6) {
      return NextResponse.json({ error: "Phase 6 cannot be completed, it is ongoing" }, { status: 400 });
    }

    // 1. Fetch current phase progress
    const { data: phase, error: phaseError } = await supabase
      .from("phase_progress")
      .select("id, status, checklist_items")
      .eq("user_id", user.id)
      .eq("phase_number", phaseId)
      .single();

    if (phaseError || !phase) {
      return NextResponse.json({ error: "Phase progress not found" }, { status: 404 });
    }

    if (phase.status === "completed") {
      return NextResponse.json({ message: "Phase already completed" });
    }

    // 2. Verify Gate
    const checklistItems = phase.checklist_items as any[];
    const totalChecklist = checklistItems.length;
    const completedChecklist = checklistItems.filter(i => i.completed).length;
    
    let gateMet = false;
    if (phaseId === 1) {
      gateMet = completedChecklist >= 3;
    } else if (phaseId >= 2 && phaseId <= 5) {
      gateMet = completedChecklist === totalChecklist;
    }

    if (!gateMet) {
      return NextResponse.json({ error: "Gate requirements not met" }, { status: 400 });
    }

    const nextPhaseId = phaseId + 1;

    // 3. Mark current phase as completed
    const { error: updateCurrentError } = await supabase
      .from("phase_progress")
      .update({ 
        status: "completed", 
        completed_at: new Date().toISOString() 
      })
      .eq("id", phase.id);

    if (updateCurrentError) throw updateCurrentError;

    // 4. Mark next phase as active
    const { error: updateNextError } = await supabase
      .from("phase_progress")
      .update({ status: "active" })
      .eq("user_id", user.id)
      .eq("phase_number", nextPhaseId);

    if (updateNextError) throw updateNextError;

    // 5. Update users.current_phase
    // Use an admin client here if RLS prevents updating users table without checks, 
    // but we already applied RLS policies allowing users to update their own record!
    const { error: userUpdateError } = await supabase
      .from("users")
      .update({ current_phase: nextPhaseId })
      .eq("id", user.id);

    if (userUpdateError) throw userUpdateError;

    return NextResponse.json({
      phase_completed: phaseId,
      next_phase_unlocked: nextPhaseId,
      message: `Successfully completed phase ${phaseId}`
    });

  } catch (error: any) {
    console.error("Roadmap Phase Complete exception:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
