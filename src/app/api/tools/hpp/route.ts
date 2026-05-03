import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await request.json();

    // Check if ToolData already exists for this user and tool
    const existingToolData = await prisma.toolData.findUnique({
      where: {
        user_id_tool_slug: {
          user_id: user.id,
          tool_slug: "hpp"
        }
      }
    });

    if (existingToolData) {
      // If exists, push current to history and update
      await prisma.toolDataHistory.create({
        data: {
          tool_data_id: existingToolData.id,
          user_id: user.id,
          tool_slug: "hpp",
          data_snapshot: existingToolData.data as any,
        }
      });

      const updated = await prisma.toolData.update({
        where: { id: existingToolData.id },
        data: {
          data: payload,
          version: { increment: 1 }
        }
      });

      return NextResponse.json({ message: "Updated", data: updated }, { status: 200 });
    } else {
      // Create new
      const created = await prisma.toolData.create({
        data: {
          user_id: user.id,
          tool_slug: "hpp",
          data: payload,
        }
      });

      return NextResponse.json({ message: "Created", data: created }, { status: 201 });
    }
  } catch (error: any) {
    console.error("API Tools HPP Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const toolData = await prisma.toolData.findUnique({
      where: {
        user_id_tool_slug: {
          user_id: user.id,
          tool_slug: "hpp"
        }
      }
    });

    return NextResponse.json({ data: toolData?.data || null }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
