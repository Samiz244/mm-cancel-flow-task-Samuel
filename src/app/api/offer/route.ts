// app/api/offer/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

const TEN_DOLLARS = 1000;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');
  const userId = searchParams.get('user_id');

  try {
    // 1) Resolve user id
    let uid: string | null = null;

    if (email) {
      const { data: user, error: userErr } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('email', email)
        .maybeSingle(); // ← no throw if 0/2+ rows

      if (userErr) {
        return NextResponse.json({ ok: false, error: userErr.message }, { status: 500 });
      }
      if (!user) {
        return NextResponse.json({ ok: false, error: 'User not found' }, { status: 404 });
      }
      uid = user.id;
    } else if (userId) {
      uid = userId;
    }

    // 2) Get most recent active/pending subscription for that user (or fallback to any)
    let subQuery = supabaseAdmin
      .from('subscriptions')
      .select('monthly_price, status, created_at')
      .order('created_at', { ascending: false })
      .limit(1);

    if (uid) {
      subQuery = subQuery.eq('user_id', uid);
    }
    // Prefer active/pending if you want:
    // subQuery = subQuery.in('status', ['active', 'pending_cancellation']);

    const { data: sub, error: subErr } = await subQuery.maybeSingle(); // ← important

    if (subErr) {
      return NextResponse.json({ ok: false, error: subErr.message }, { status: 500 });
    }
    if (!sub) {
      return NextResponse.json({ ok: false, error: 'No subscription found' }, { status: 404 });
    }

    const original = Number(sub.monthly_price);      // cents
    const discounted = Math.max(original - TEN_DOLLARS, 0);

    return NextResponse.json({
      ok: true,
      planCents: original,         // e.g., 2500 or 2900
      discountedCents: discounted, // e.g., 1500 or 1900
      offCents: TEN_DOLLARS,       // 1000
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message ?? e) }, { status: 500 });
  }
}