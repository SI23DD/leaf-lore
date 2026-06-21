import dotenv from 'dotenv';
dotenv.config();

// Must set global WebSocket BEFORE importing Supabase (Node 20 fix)
// eslint-disable-next-line @typescript-eslint/no-require-imports
(globalThis as unknown as Record<string, unknown>).WebSocket = require('ws');

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});
