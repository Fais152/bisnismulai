import { createClient } from "@supabase/supabase-js";

/**
 * Admin Supabase client using service_role key.
 * ONLY use in server-side API routes — never expose to client.
 * Bypasses RLS — always validate user auth separately before using.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
