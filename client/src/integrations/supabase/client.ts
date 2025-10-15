import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

let client;

if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  console.error("Supabase URL and Anon Key are missing. Authentication and data fetching will fail.");
  // Cria um cliente dummy para evitar erros de referência, mas que não funcionará.
  // Isso permite que o componente de login seja renderizado.
  client = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signOut: () => Promise.resolve({ error: null }),
      signInWithPassword: () => Promise.resolve({ error: new Error("Supabase not configured.") }),
      signUp: () => Promise.resolve({ error: new Error("Supabase not configured.") }),
    },
    from: () => ({ select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: new Error("Supabase not configured.") }) }) }) }),
    rpc: () => Promise.resolve({ error: new Error("Supabase not configured.") }),
  } as any;
} else {
  client = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
}

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = client;