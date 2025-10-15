import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

let client;

if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  console.error("Supabase URL and Anon Key are missing. Authentication and data fetching will fail.");

  // Mock de funções de query para evitar falhas de referência em hooks que usam .select(), .eq(), .order(), etc.
  const mockQuery = () => ({
    select: () => mockQuery(),
    eq: () => mockQuery(),
    order: () => mockQuery(),
    single: () => Promise.resolve({ data: null, error: new Error("Supabase not configured.") }),
    rpc: () => Promise.resolve({ data: null, error: new Error("Supabase not configured.") }),
    delete: () => Promise.resolve({ error: new Error("Supabase not configured.") }),
    update: () => Promise.resolve({ error: new Error("Supabase not configured.") }),
    insert: () => Promise.resolve({ error: new Error("Supabase not configured.") }),
    // Retorna dados vazios para consultas de lista
    then: (resolve: (value: { data: any[], error: null }) => any) => resolve({ data: [], error: null }),
  });

  client = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signOut: () => Promise.resolve({ error: null }),
      signInWithPassword: () => Promise.resolve({ error: new Error("Supabase not configured.") }),
      signUp: () => Promise.resolve({ error: new Error("Supabase not configured.") }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    },
    from: () => mockQuery(),
    rpc: () => Promise.resolve({ data: null, error: new Error("Supabase not configured.") }),
    functions: {
      invoke: () => Promise.resolve({ data: null, error: new Error("Supabase not configured.") }),
    }
  } as any;
} else {
  client = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
}

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = client;