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
    -- Create the trigger function if it doesn't exist
    CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS TRIGGER AS $$
    BEGIN
      INSERT INTO public.users (id, email, full_name)
      VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
      )
      ON CONFLICT (id) DO NOTHING;
      RETURN new;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;

    -- Create the trigger on auth.users
    DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

    -- Retroactively sync any existing auth.users to public.users that might be missing
    INSERT INTO public.users (id, email, full_name)
    SELECT
      id,
      email,
      COALESCE(raw_user_meta_data->>'full_name', split_part(email, '@', 1))
    FROM auth.users
    ON CONFLICT (id) DO NOTHING;
  `;

  await client.query(query);
  console.log("Auth trigger setup and users synced successfully!");
  await client.end();
}

run().catch(console.error);
