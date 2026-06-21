import { Router, Request, Response } from 'express';
import { supabaseAdmin } from '../lib/supabase';

const router = Router();

// POST /api/admin/auth
router.post('/auth', (req: Request, res: Response) => {
  const { key } = req.body;
  const expectedKey = process.env.ADMIN_SECRET_KEY || 'leaflore-admin-2024';
  if (key === expectedKey) return res.json({ success: true });
  return res.status(401).json({ error: 'Invalid admin key' });
});

// GET /api/admin/stats
router.get('/stats', async (_req: Request, res: Response) => {
  const [booksRes, ordersRes, usersRes, revenueRes] = await Promise.all([
    supabaseAdmin.from('books').select('id', { count: 'exact', head: true }),
    supabaseAdmin.from('orders').select('id', { count: 'exact', head: true }),
    supabaseAdmin.from('users').select('id', { count: 'exact', head: true }),
    supabaseAdmin.from('orders').select('total_amount').neq('status', 'Cancelled'),
  ]);
  const revenue = (revenueRes.data || []).reduce((sum: number, o: {total_amount: number}) => sum + (o.total_amount || 0), 0);
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const { count: recentOrders } = await supabaseAdmin.from('orders').select('id', { count: 'exact', head: true }).gte('created_at', thirtyDaysAgo);
  const { data: statusData } = await supabaseAdmin.from('orders').select('status');
  const statusCounts = (statusData || []).reduce((acc: Record<string, number>, o: {status: string}) => { acc[o.status] = (acc[o.status] || 0) + 1; return acc; }, {});
  return res.json({ totalBooks: booksRes.count ?? 0, totalOrders: ordersRes.count ?? 0, totalUsers: usersRes.count ?? 0, totalRevenue: revenue, recentOrders: recentOrders ?? 0, ordersByStatus: statusCounts });
});

export default router;
