import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const TOOL_SLUG = "cashflow";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = await request.json();

    const existing = await prisma.toolData.findUnique({
      where: { user_id_tool_slug: { user_id: user.id, tool_slug: TOOL_SLUG } },
    });

    if (existing) {
      await prisma.toolDataHistory.create({
        data: { tool_data_id: existing.id, user_id: user.id, tool_slug: TOOL_SLUG, data_snapshot: existing.data as any },
      });
      const updated = await prisma.toolData.update({
        where: { id: existing.id },
        data: { data: payload, version: { increment: 1 } },
      });
      return NextResponse.json({ message: "Updated", data: updated });
    }

    const created = await prisma.toolData.create({
      data: { user_id: user.id, tool_slug: TOOL_SLUG, data: payload },
    });
    return NextResponse.json({ message: "Created", data: created }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const row = await prisma.toolData.findUnique({
      where: { user_id_tool_slug: { user_id: user.id, tool_slug: TOOL_SLUG } },
    });
    return NextResponse.json({ data: row?.data ?? null });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
