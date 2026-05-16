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
    const { task_id, completed } = body;

    if (!task_id || typeof completed !== 'boolean') {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    // Fetch current phase progress
    const { data: phase, error: phaseError } = await supabase
      .from("phase_progress")
      .select("id, task_items")
      .eq("user_id", user.id)
      .eq("phase_number", phaseId)
      .single();

    if (phaseError || !phase) {
      return NextResponse.json({ error: "Phase progress not found" }, { status: 404 });
    }

    const taskItems = [...(phase.task_items || [])] as any[];
    const itemIndex = taskItems.findIndex(item => item.id === task_id);

    if (itemIndex === -1) {
      return NextResponse.json({ error: "Task item not found" }, { status: 404 });
    }

    // Update item
    taskItems[itemIndex].completed = completed;

    // Save to database
    const { error: updateError } = await supabase
      .from("phase_progress")
      .update({ task_items: taskItems })
      .eq("id", phase.id);

    if (updateError) {
      return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
    }

    return NextResponse.json({ updated: true });

  } catch (error: any) {
    console.error("Roadmap Task PUT exception:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
