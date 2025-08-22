// src/app/api/cancel/accept/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { email, userId: rawUserId } = await req.json?.() ?? {};
    let userId = (rawUserId || '').trim();

    if (!userId) {
      // resolve by email if userId was not provided
      const e = (email || '').trim().toLowerCase();
      if (!e) {
        return NextResponse.json(
          { ok: false, error: 'Missing userId or email' },
          { status: 400 }
        );
      }
      const { data: user, error: userErr } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('email', e)
        .single();

      if (userErr || !user?.id) {
        return NextResponse.json(
          { ok: false, error: userErr?.message || 'User not found' },
          { status: 404 }
        );
      }
      userId = user.id;
    }

    // find the latest cancellation row for this user
    const { data: latest, error: findErr } = await supabaseAdmin
      .from('cancellations')
      .select('id, accepted_downsell')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (findErr) {
      return NextResponse.json(
        { ok: false, error: findErr.message },
        { status: 500 }
      );
    }
    if (!latest?.id) {
      // You said a row will exist; if not, just return a clear message.
      return NextResponse.json(
        { ok: false, error: 'No cancellation row found for user' },
        { status: 404 }
      );
    }

    // already accepted? just return ok
    if (latest.accepted_downsell === true) {
      return NextResponse.json({ ok: true, alreadyAccepted: true });
    }

    const { error: updErr } = await supabaseAdmin
      .from('cancellations')
      .update({ accepted_downsell: true })
      .eq('id', latest.id);

    if (updErr) {
      return NextResponse.json(
        { ok: false, error: updErr.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, updatedId: latest.id });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || 'Unexpected error' },
      { status: 500 }
    );
  }
}