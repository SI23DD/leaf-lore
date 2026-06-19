import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

// POST /api/auth/login
export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: 'email and password are required' }, { status: 400 });
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }

  // Fetch user profile for role info
  const { data: profileData } = await supabaseAdmin
    .from('users')
    .select('id, name, email, role')
    .eq('id', data.user.id)
    .single();

  const profile = profileData as { id: string; name: string; email: string; role: string } | null;

  return NextResponse.json({
    user: { id: data.user.id, email: data.user.email, name: profile?.name, role: profile?.role },
    access_token: data.session?.access_token,
    refresh_token: data.session?.refresh_token,
  });
}
