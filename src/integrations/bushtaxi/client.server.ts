// Server-only Supabase client bound to the dedicated `bush_taxi` schema.
// Uses the existing project server credentials (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).
// Never import this from browser code.
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const BUSH_TAXI_SCHEMA = 'bush_taxi';

function isNewSupabaseApiKey(value: string): boolean {
  return value.startsWith('sb_publishable_') || value.startsWith('sb_secret_');
}

function createSupabaseFetch(supabaseKey: string): typeof fetch {
  return (input, init) => {
    const headers = new Headers(
      typeof Request !== 'undefined' && input instanceof Request ? input.headers : undefined,
    );

    if (init?.headers) {
      new Headers(init.headers).forEach((value, key) => headers.set(key, value));
    }

    // New-format Supabase API keys are opaque strings, not bearer JWTs.
    if (isNewSupabaseApiKey(supabaseKey) && headers.get('Authorization') === `Bearer ${supabaseKey}`) {
      headers.delete('Authorization');
    }

    headers.set('apikey', supabaseKey);
    return fetch(input, { ...init, headers });
  };
}

function createBushTaxiClient(): SupabaseClient<any, 'bush_taxi', any> {
  const url = process.env['BUSH_TAXI_SUPABASE_URL'];
  const serviceRoleKey = process.env['BUSH_TAXI_SUPABASE_SERVICE_ROLE_KEY'];

  if (!url || !serviceRoleKey) {
    const missing = [
      ...(!url ? ['BUSH_TAXI_SUPABASE_URL'] : []),
      ...(!serviceRoleKey ? ['BUSH_TAXI_SUPABASE_SERVICE_ROLE_KEY'] : []),
    ];
    throw new Error(`Missing Bush Taxi database configuration: ${missing.join(', ')}`);
  }

  return createClient(url, serviceRoleKey, {
    db: { schema: BUSH_TAXI_SCHEMA },
    global: { fetch: createSupabaseFetch(serviceRoleKey) },
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
}

let _client: SupabaseClient<any, 'bush_taxi', any> | undefined;

export function bushTaxiDb(): SupabaseClient<any, 'bush_taxi', any> {
  if (!_client) _client = createBushTaxiClient();
  return _client;
}
