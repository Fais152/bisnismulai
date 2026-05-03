import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const { businessType, businessStage, initialCapital, targetRevenue } = await request.json();

    const supabase = await createClient();

    // Verify user is authenticated
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Update user profile in Supabase
    // Make sure we have the correct tables in Prisma/Supabase
    // For now, since Prisma isn't fully linked via API, we'll try to insert using Supabase standard client
    // Or we should actually use Prisma. Let's use Prisma to be correct.
    // Wait, let's just use Supabase client to update the "users" table
    const { error } = await supabase
      .from('users')
      .update({
        business_type: businessType,
        business_stage: businessStage,
        initial_capital: initialCapital ? parseInt(initialCapital) : null,
        target_monthly_revenue: targetRevenue ? parseInt(targetRevenue) : null,
        onboarding_completed: true,
      })
      .eq('id', user.id);

    if (error) {
      // If we don't have triggers to create the user row yet, we might need an upsert or let Prisma handle it
      // Let's do an upsert
      const { error: upsertError } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || 'User',
          business_type: businessType,
          business_stage: businessStage,
          initial_capital: initialCapital ? parseInt(initialCapital) : null,
          target_monthly_revenue: targetRevenue ? parseInt(targetRevenue) : null,
          onboarding_completed: true,
        });
        
      if (upsertError) {
        return NextResponse.json({ error: upsertError.message }, { status: 400 });
      }
    }

    return NextResponse.json(
      { message: "Onboarding successful" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
