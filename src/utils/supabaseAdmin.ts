import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ncdwlflcmlklzfsuijvj.supabase.co';
const SERVICE_ROLE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jZHdsZmxjbWxrbHpmc3VpanZqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyMDM4OTY1NSwiZXhwIjoyMDM1OTY1NjU1fQ.Ln3Fx48cteAOCrziGI31L5KUCaUXrX0bI5NbkKqrmXc';

export const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
