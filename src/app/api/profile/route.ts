// src/app/api/profile/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// optional: force Node runtime
// export const runtime = 'nodejs';

/**
 * Same-day-next-month in UTC, clamped for shorter months.
 * e.g. Jan 31 -> Feb 28, Aug 30 -> Sep 30 (or Sep 30 stays 30), etc.
 */
function addOneMonthSameDay(iso: string) {
  const d = new Date(iso); // subscription created_at
  const y = d.getUTCFullYear();
  const m = d.getUTCMonth();      // 0-11
  const day = d.getUTCDate();     // 1-31

  const targetMonth = (m + 1) % 12;
  const targetYear = y + Math.floor((m + 1) / 12);

  // Days in target month (UTC)
  const daysInTargetMonth = new Date(Date.UTC(targetYear, targetMonth + 1, 0)).getUTCDate();
  const clampedDay = Math.min(day, daysInTargetMonth);

  const next = new Date(
    Date.UTC(
      targetYear,
      targetMonth,
      clampedDay,
      d.getUTCHours(),
      d.getUTCMinutes(),
      d.getUTCSeconds(),
      d.getUTCMilliseconds()
    )
  );
  return next.toISOString();
}

export async function GET(req: NextRequest) {
  const email = (req.nextUrl.searchParams.get('email') || '').trim().toLowerCase();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: 'Missing or invalid email' }, { status: 400 });
  }

  // 1) user by email
  const { data: user, error: userErr } = await supabaseAdmin
    .from('users')
    .select('id, email, created_at')
    .eq('email', email)
    .maybeSingle();

  if (userErr) return NextResponse.json({ ok: false, error: userErr.message }, { status: 500 });
  if (!user) return NextResponse.json({ ok: false, error: 'User not found' }, { status: 404 });

  // 2) most recent subscription
  const { data: sub, error: subErr } = await supabaseAdmin
    .from('subscriptions')
    .select('status, monthly_price, created_at, updated_at')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (subErr) return NextResponse.json({ ok: false, error: subErr.message }, { status: 500 });

  const subscription = sub
    ? {
        status: sub.status as 'active' | 'pending_cancellation' | 'cancelled',
        monthlyPriceCents: sub.monthly_price,
        createdAt: new Date(sub.created_at).toISOString(),
        nextBillingDate:
          sub.status === 'cancelled'
            ? null
            : addOneMonthSameDay(new Date(sub.created_at).toISOString()),
      }
    : null;

    return NextResponse.json({ 
        ok: true, 
        email: user.email, 
        userId: user.id,       // add this line
        subscription 
      });
}