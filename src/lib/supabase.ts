// src/lib/supabase.ts
// Supabase client configuration for database connections
// Does not include authentication setup or advanced features

// src/lib/supabase.ts
// src/lib/supabase.ts
// Centralized Supabase clients.
// - createClient(): safe for client or server (uses ANON key)
// - supabaseAdmin: SERVER-ONLY (uses SERVICE ROLE key). Do NOT import in client components.

import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Required envs
const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// 1) Public client (ok on client & server)
export function createClient() {
  return createSupabaseClient(url, anonKey);
}

// 2) Admin client (server-only). Keep as a named export to satisfy existing imports.
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Throw a helpful error if someone tries to use this on the client.
function assertServerOnly() {
  if (typeof window !== 'undefined') {
    throw new Error('supabaseAdmin must only be imported/used on the server.');
  }
}

// Exported constant so existing imports like `import { supabaseAdmin } from '@/lib/supabase'` keep working.
export const supabaseAdmin = (() => {
  assertServerOnly();
  if (!serviceRole) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is missing in environment.');
  }
  return createSupabaseClient(url, serviceRole);
})();