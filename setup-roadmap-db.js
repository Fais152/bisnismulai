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
    DROP TABLE IF EXISTS public.phase_progress CASCADE;

    CREATE TABLE public.phase_progress (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
      phase_number SMALLINT NOT NULL CHECK (phase_number BETWEEN 1 AND 6),
      status VARCHAR(20) NOT NULL DEFAULT 'locked' CHECK (status IN ('locked', 'active', 'completed')),
      checklist_items JSONB NOT NULL DEFAULT '[]',
      task_items JSONB NOT NULL DEFAULT '[]',
      phase_data JSONB DEFAULT '{}',
      completed_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      UNIQUE(user_id, phase_number)
    );

    -- Enable RLS
    ALTER TABLE public.phase_progress ENABLE ROW LEVEL SECURITY;

    DO $$ BEGIN
      CREATE POLICY "Users can view their own phase progress" ON public.phase_progress FOR SELECT USING (auth.uid() = user_id);
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      CREATE POLICY "Users can update their own phase progress" ON public.phase_progress FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      CREATE POLICY "Users can insert their own phase progress" ON public.phase_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    -- Trigger for updated_at
    CREATE OR REPLACE FUNCTION public.update_phase_progress_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = now();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    DROP TRIGGER IF EXISTS phase_progress_updated_at ON public.phase_progress;
    CREATE TRIGGER phase_progress_updated_at
      BEFORE UPDATE ON public.phase_progress
      FOR EACH ROW EXECUTE FUNCTION public.update_phase_progress_updated_at();

    -- Function to initialize phases for a user
    CREATE OR REPLACE FUNCTION public.initialize_roadmap_phases(new_user_id UUID)
    RETURNS void AS $$
    BEGIN
      INSERT INTO public.phase_progress (user_id, phase_number, status, checklist_items, task_items)
      VALUES
        (new_user_id, 1, 'active',   '[{"id":"m1","label":"Sudah mengisi motivasi utama","completed":false,"tool_required":null},{"id":"m2","label":"Sudah estimasi runway finansial","completed":false,"tool_required":null},{"id":"m3","label":"Sudah pelajari 1 konsep keuangan","completed":false,"tool_required":null},{"id":"m4","label":"Sudah tulis skills relevan","completed":false,"tool_required":null}]', '[{"id":"t1","title":"Definisikan mengapa","completed":false},{"id":"t2","title":"Toleransi risiko","completed":false},{"id":"t3","title":"Pelajari dasar bisnis","completed":false},{"id":"t4","title":"Identifikasi skills","completed":false}]'),
        (new_user_id, 2, 'locked',   '[{"id":"v1","label":"Sudah wawancara 20 calon pelanggan","completed":false,"tool_required":null},{"id":"v2","label":"Sudah analisis 3 kompetitor","completed":false,"tool_required":"kompetitor"},{"id":"v3","label":"Value proposition sudah ditulis","completed":false,"tool_required":null},{"id":"v4","label":"Ada 5 orang berminat membayar","completed":false,"tool_required":null}]', '[{"id":"t1","title":"Riset masalah nyata","completed":false},{"id":"t2","title":"Analisis kompetitor","completed":false},{"id":"t3","title":"Definisikan value proposition","completed":false},{"id":"t4","title":"Buat MVP atau pre-order","completed":false}]'),
        (new_user_id, 3, 'locked',   '[{"id":"f1","label":"HPP dihitung dengan benar","completed":false,"tool_required":"hpp"},{"id":"f2","label":"Harga jual dengan margin 30%","completed":false,"tool_required":"hpp"},{"id":"f3","label":"Ada SOP minimal","completed":false,"tool_required":"sop"},{"id":"f4","label":"Rekening bisnis sudah dipisah","completed":false,"tool_required":null}]', '[{"id":"t1","title":"Hitung HPP","completed":false},{"id":"t2","title":"Buat SOP minimal","completed":false},{"id":"t3","title":"Pilih struktur legal","completed":false},{"id":"t4","title":"Setup pembukuan dasar","completed":false}]'),
        (new_user_id, 4, 'locked',   '[{"id":"l1","label":"Sudah dapat 10 pelanggan harga penuh","completed":false,"tool_required":null},{"id":"l2","label":"Sudah kumpulkan feedback 7 pelanggan","completed":false,"tool_required":null},{"id":"l3","label":"Ada minimal 1 testimonial","completed":false,"tool_required":null},{"id":"l4","label":"Sudah identifikasi pola pelanggan puas","completed":false,"tool_required":null}]', '[{"id":"t1","title":"Pilih 1 channel utama","completed":false},{"id":"t2","title":"Tawarkan ke jaringan","completed":false},{"id":"t3","title":"Minta feedback agresif","completed":false},{"id":"t4","title":"Iterate cepat","completed":false}]'),
        (new_user_id, 5, 'locked',   '[{"id":"s1","label":"Ada laporan keuangan mingguan","completed":false,"tool_required":null},{"id":"s2","label":"Repeat rate di atas 20%","completed":false,"tool_required":"kpi"},{"id":"s3","label":"Cash flow 6 bulan sudah diproyeksi","completed":false,"tool_required":"cash-flow"},{"id":"s4","label":"Ada 1 orang membantu operasional","completed":false,"tool_required":null}]', '[{"id":"t1","title":"Tracking KPI mingguan","completed":false},{"id":"t2","title":"Bangun sistem repeat","completed":false},{"id":"t3","title":"Proyeksi cash flow","completed":false},{"id":"t4","title":"Delegasi hal pertama","completed":false}]'),
        (new_user_id, 6, 'locked',   '[{"id":"sc1","label":"Unit economics positif (LTV > 3x CAC)","completed":false,"tool_required":"kpi"},{"id":"sc2","label":"Ada lever pertumbuhan yang dieksekusi","completed":false,"tool_required":null},{"id":"sc3","label":"Tim operasional sudah berjalan","completed":false,"tool_required":null},{"id":"sc4","label":"BMC diupdate dengan data aktual","completed":false,"tool_required":"bmc"}]', '[{"id":"t1","title":"Pilih lever pertumbuhan","completed":false},{"id":"t2","title":"Bangun tim inti","completed":false},{"id":"t3","title":"Formalisasi model bisnis","completed":false},{"id":"t4","title":"Siapkan monetisasi lanjutan","completed":false}]')
      ON CONFLICT (user_id, phase_number) DO NOTHING;
    END;
    $$ LANGUAGE plpgsql;

    -- Update handle_new_user to also call initialize_roadmap_phases
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

      -- Initialize roadmap
      PERFORM public.initialize_roadmap_phases(new.id);

      RETURN new;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;

    -- Initialize roadmap for existing users
    DO $$ 
    DECLARE
      usr RECORD;
    BEGIN
      FOR usr IN SELECT id FROM public.users LOOP
        PERFORM public.initialize_roadmap_phases(usr.id);
      END LOOP;
    END $$;
  `;

  await client.query(query);
  console.log("Phase progress table and triggers setup successfully!");
  await client.end();
}

run().catch(console.error);
