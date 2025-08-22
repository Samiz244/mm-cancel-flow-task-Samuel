import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    let { userId, email } = body as { userId?: string; email?: string };

    if (!userId && email) {
      // look up user id by email
      const { data: user, error: userErr } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('email', String(email).trim().toLowerCase())
        .single();

      if (userErr || !user) {
        return NextResponse.json({ ok: false, error: 'User not found' }, { status: 404 });
      }
      userId = user.id;
    }

    if (!userId) {
      return NextResponse.json({ ok: false, error: 'Missing userId or email' }, { status: 400 });
    }

    // find most-recent active/pending subscription for this user
    const { data: sub, error: subErr } = await supabaseAdmin
      .from('subscriptions')
      .select('id, status')
      .eq('user_id', userId)
      .in('status', ['active', 'pending_cancellation'])
      .order('updated_at', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (subErr) {
      return NextResponse.json({ ok: false, error: subErr.message }, { status: 500 });
    }
    if (!sub) {
      return NextResponse.json({ ok: false, error: 'Active subscription not found' }, { status: 404 });
    }

    // flip to pending_cancellation
    const { error: updErr } = await supabaseAdmin
      .from('subscriptions')
      .update({
        status: 'pending_cancellation',
        updated_at: new Date().toISOString(),
      })
      .eq('id', sub.id);

    if (updErr) {
      return NextResponse.json({ ok: false, error: updErr.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, subscriptionId: sub.id });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}