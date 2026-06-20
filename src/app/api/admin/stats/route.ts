import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@backend/lib/supabaseAdmin';

// GET /api/admin/stats — dashboard stats
export async function GET() {
  const [booksRes, ordersRes, usersRes, revenueRes] = await Promise.all([
    supabaseAdmin.from('books').select('id', { count: 'exact', head: true }),
    supabaseAdmin.from('orders').select('id', { count: 'exact', head: true }),
    supabaseAdmin.from('users').select('id', { count: 'exact', head: true }),
    supabaseAdmin.from('orders').select('total_amount').neq('status', 'Cancelled'),
  ]);

  const revenue = (revenueRes.data || []).reduce(
    (sum: number, o: { total_amount: number }) => sum + (o.total_amount || 0),
    0
  );

  // Orders in last 30 days
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const { count: recentOrders } = await supabaseAdmin
    .from('orders')
    .select('id', { count: 'exact', head: true })
    .gte('created_at', thirtyDaysAgo);

  // Orders by status
  const { data: statusData } = await supabaseAdmin
    .from('orders')
    .select('status');

  const statusCounts = (statusData || []).reduce((acc: Record<string, number>, o: { status: string }) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  return NextResponse.json({
    totalBooks: booksRes.count ?? 0,
    totalOrders: ordersRes.count ?? 0,
    totalUsers: usersRes.count ?? 0,
    totalRevenue: revenue,
    recentOrders: recentOrders ?? 0,
    ordersByStatus: statusCounts,
  });
}
