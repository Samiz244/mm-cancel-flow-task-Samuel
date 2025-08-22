// src/app/api/reason/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

type Body = {
  email: string;
  reason: string;        // dropdown option
  details?: string | null; // optional free-form text
};

function combineReason(reason: string, details?: string | null) {
  return details ? `${reason}: ${details}`.slice(0, 2000) : reason;
}

export async function POST(req: Request) {
  try {
    const { email, reason, details }: Body = await req.json();

    const cleanEmail = email.trim().toLowerCase();

    // 1) Get user
    const { data: user, error: userErr } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', cleanEmail)
      .single();

    if (userErr || !user) {
      return NextResponse.json({ ok: false, error: 'User not found' }, { status: 404 });
    }

    // 2) Get their subscription
    const { data: sub, error: subErr } = await supabaseAdmin
      .from('subscriptions')
      .select('id')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (subErr || !sub) {
      return NextResponse.json({ ok: false, error: 'No subscription' }, { status: 404 });
    }

    // 3) Update cancellation row’s reason
    const { error: cancelUpdateErr } = await supabaseAdmin
      .from('cancellations')
      .update({ reason: combineReason(reason, details) })
      .eq('user_id', user.id)
      .eq('subscription_id', sub.id);

    if (cancelUpdateErr) {
      return NextResponse.json({ ok: false, error: cancelUpdateErr.message }, { status: 500 });
    }

    // 4) Flip subscription → pending_cancellation
    const { error: subUpdateErr } = await supabaseAdmin
      .from('subscriptions')
      .update({
        status: 'pending_cancellation',
        updated_at: new Date().toISOString(),
      })
      .eq('id', sub.id);

    if (subUpdateErr) {
      return NextResponse.json({ ok: false, error: subUpdateErr.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}