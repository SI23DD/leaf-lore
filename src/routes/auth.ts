import { Router, Request, Response } from 'express';
import { supabase, supabaseAdmin } from '../lib/supabase';

const router = Router();

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) return res.status(400).json({ error: 'email, password, and name are required' });
  if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });
  const { data: authData, error: authErr } = await supabaseAdmin.auth.admin.createUser({ email, password, email_confirm: true });
  if (authErr || !authData.user) return res.status(400).json({ error: authErr?.message || 'Registration failed' });
  const { error: profileErr } = await supabaseAdmin.from('users').insert({ id: authData.user.id, email, name, role: 'customer' });
  if (profileErr) { await supabaseAdmin.auth.admin.deleteUser(authData.user.id); return res.status(500).json({ error: 'Failed to create user profile' }); }
  return res.status(201).json({ message: 'Account created successfully. You can now log in.' });
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email and password are required' });
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) return res.status(401).json({ error: 'Invalid email or password' });
  const { data: profileData } = await supabaseAdmin.from('users').select('id, name, email, role').eq('id', data.user.id).single();
  const profile = profileData as { id: string; name: string; email: string; role: string } | null;
  return res.json({
    user: { id: data.user.id, email: data.user.email, name: profile?.name, role: profile?.role },
    access_token: data.session?.access_token,
    refresh_token: data.session?.refresh_token,
  });
});

export default router;
