import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

// POST /api/auth/register
export async function POST(req: NextRequest) {
  const { email, password, name } = await req.json();

  if (!email || !password || !name) {
    return NextResponse.json({ error: 'email, password, and name are required' }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
  }

  // Create auth user in Supabase Auth
  const { data: authData, error: authErr } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authErr || !authData.user) {
    return NextResponse.json({ error: authErr?.message || 'Registration failed' }, { status: 400 });
  }

  // Save profile in our users table
  const { error: profileErr } = await supabaseAdmin.from('users').insert({
    id: authData.user.id,
    email,
    name,
    role: 'customer',
  });

  if (profileErr) {
    // Cleanup auth user if profile insert fails
    await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
    return NextResponse.json({ error: 'Failed to create user profile' }, { status: 500 });
  }

  return NextResponse.json({ message: 'Account created successfully. You can now log in.' }, { status: 201 });
}
