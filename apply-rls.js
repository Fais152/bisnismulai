const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const envLocal = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf-8');
const match = envLocal.match(/^DIRECT_URL="?([^"\n]+)"?/m);
if (!match) throw new Error("DIRECT_URL not found in .env.local");

const client = new Client({
  connectionString: match[1]
});

async function run() {
  await client.connect();
  console.log("Connected to DB.");

  const query = `
    -- Users table
    ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
    DO $$ BEGIN CREATE POLICY "Users can view their own users record" ON public.users FOR SELECT USING (auth.uid() = id); EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN CREATE POLICY "Users can update their own users record" ON public.users FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id); EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN CREATE POLICY "Users can insert their own users record" ON public.users FOR INSERT WITH CHECK (auth.uid() = id); EXCEPTION WHEN duplicate_object THEN null; END $$;

    -- tool_data table
    ALTER TABLE public.tool_data ENABLE ROW LEVEL SECURITY;
    DO $$ BEGIN CREATE POLICY "Users can view their own tool data" ON public.tool_data FOR SELECT USING (auth.uid() = user_id); EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN CREATE POLICY "Users can insert their own tool data" ON public.tool_data FOR INSERT WITH CHECK (auth.uid() = user_id); EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN CREATE POLICY "Users can update their own tool data" ON public.tool_data FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id); EXCEPTION WHEN duplicate_object THEN null; END $$;

    -- tool_data_history table
    ALTER TABLE public.tool_data_history ENABLE ROW LEVEL SECURITY;
    DO $$ BEGIN CREATE POLICY "Users can view their own tool_data_history" ON public.tool_data_history FOR SELECT USING (auth.uid() = user_id); EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN CREATE POLICY "Users can insert their own tool_data_history" ON public.tool_data_history FOR INSERT WITH CHECK (auth.uid() = user_id); EXCEPTION WHEN duplicate_object THEN null; END $$;
  `;

  await client.query(query);
  console.log("RLS Policies Applied Successfully.");
  await client.end();
}

run().catch(console.error);
