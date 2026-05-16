import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
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

    // Get user profile for current_phase and onboarding status
    const { data: profile } = await supabase
      .from("users")
      .select("current_phase, onboarding_completed")
      .eq("id", user.id)
      .single();

    if (!profile?.onboarding_completed) {
      return NextResponse.json({ error: "Onboarding not completed" }, { status: 403 });
    }

    if (phaseId > (profile.current_phase || 1)) {
      return NextResponse.json({ error: "Fase ini belum terbuka." }, { status: 403 });
    }

    // Get specific phase progress
    const { data: phase, error: phaseError } = await supabase
      .from("phase_progress")
      .select("*")
      .eq("user_id", user.id)
      .eq("phase_number", phaseId)
      .single();

    if (phaseError || !phase) {
      return NextResponse.json({ error: "Phase data not found" }, { status: 404 });
    }

    // Define titles based on phase number
    const phaseTitles: Record<number, string> = {
      1: "Mental Reset",
      2: "Validasi Ide",
      3: "Bangun Fondasi",
      4: "Launch Pertama",
      5: "Stabilisasi",
      6: "Skala"
    };

    let checklistItems = (phase.checklist_items || []) as any[];
    
    // Auto-verify tool-based checklist items
    const toolsRequired = checklistItems.map(item => item.tool_required).filter(Boolean);
    const toolFilledMap: Record<string, boolean> = {};

    if (toolsRequired.length > 0) {
      const { data: toolData } = await supabase
        .from("tool_data")
        .select("tool_slug, data")
        .eq("user_id", user.id)
        .in("tool_slug", toolsRequired);
        
      if (toolData) {
        toolData.forEach(t => {
          if (t.tool_slug === "hpp") {
            toolFilledMap[t.tool_slug] = Array.isArray(t.data?.produkList) && t.data.produkList.length > 0;
          } else {
            toolFilledMap[t.tool_slug] = Object.keys(t.data || {}).length > 0;
          }
        });
      }
    }

    // Attach tool_filled status to checklist items
    checklistItems = checklistItems.map(item => {
      if (item.tool_required) {
        return {
          ...item,
          tool_filled: !!toolFilledMap[item.tool_required]
        };
      }
      return item;
    });

    const totalChecklist = checklistItems.length;
    const completedChecklist = checklistItems.filter(i => i.completed).length;
    
    // Gate requirements logic based on PRD
    let gateMet = false;
    let gateReq = "";
    
    if (phaseId === 1) {
      gateMet = completedChecklist >= 3;
      gateReq = "Minimal 3 dari 4 checklist harus selesai";
    } else if (phaseId >= 2 && phaseId <= 5) {
      gateMet = completedChecklist === totalChecklist;
      gateReq = `Semua ${totalChecklist} checklist harus selesai`;
    } else {
      gateMet = true; // Phase 6 has no gate
      gateReq = "Ongoing (tidak ada gate)";
    }

    return NextResponse.json({
      phase_number: phase.phase_number,
      name: phaseTitles[phase.phase_number] || "Unknown",
      status: phase.status,
      checklist_items: checklistItems,
      tasks: phase.task_items || [],
      gate_met: gateMet,
      gate_requirement: gateReq
    });

  } catch (error: any) {
    console.error("Roadmap Phase GET exception:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
