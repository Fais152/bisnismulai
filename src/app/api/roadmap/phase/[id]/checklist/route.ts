import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
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

    const body = await request.json();
    const { item_id, completed } = body;

    if (!item_id || typeof completed !== 'boolean') {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    // Fetch current phase progress
    const { data: phase, error: phaseError } = await supabase
      .from("phase_progress")
      .select("id, checklist_items")
      .eq("user_id", user.id)
      .eq("phase_number", phaseId)
      .single();

    if (phaseError || !phase) {
      return NextResponse.json({ error: "Phase progress not found" }, { status: 404 });
    }

    const checklistItems = [...(phase.checklist_items || [])] as any[];
    const itemIndex = checklistItems.findIndex(item => item.id === item_id);

    if (itemIndex === -1) {
      return NextResponse.json({ error: "Checklist item not found" }, { status: 404 });
    }

    const item = checklistItems[itemIndex];

    // If attempting to mark as completed, verify tool_required
    if (completed && item.tool_required) {
      const { data: toolData } = await supabase
        .from("tool_data")
        .select("data")
        .eq("user_id", user.id)
        .eq("tool_slug", item.tool_required)
        .single();
        
      let isToolFilled = false;
      if (toolData) {
         if (item.tool_required === "hpp") {
            isToolFilled = Array.isArray(toolData.data?.produkList) && toolData.data.produkList.length > 0;
         } else {
            isToolFilled = Object.keys(toolData.data || {}).length > 0;
         }
      }

      if (!isToolFilled) {
        return NextResponse.json({ 
          error: "Tool required not filled", 
          tool_required: item.tool_required 
        }, { status: 400 });
      }
    }

    // Update item
    checklistItems[itemIndex].completed = completed;

    // Save to database
    const { error: updateError } = await supabase
      .from("phase_progress")
      .update({ checklist_items: checklistItems })
      .eq("id", phase.id);

    if (updateError) {
      return NextResponse.json({ error: "Failed to update checklist" }, { status: 500 });
    }

    // Check gate status
    const totalChecklist = checklistItems.length;
    const completedChecklist = checklistItems.filter(i => i.completed).length;
    
    let gateMet = false;
    if (phaseId === 1) {
      gateMet = completedChecklist >= 3;
    } else if (phaseId >= 2 && phaseId <= 5) {
      gateMet = completedChecklist === totalChecklist;
    } else {
      gateMet = true; 
    }

    return NextResponse.json({
      updated: true,
      gate_met: gateMet,
      next_phase_unlockable: gateMet && phaseId < 6
    });

  } catch (error: any) {
    console.error("Roadmap Checklist PUT exception:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
