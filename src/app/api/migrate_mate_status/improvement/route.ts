import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = String(body?.email || '').trim().toLowerCase();
    const rawImprovement = typeof body?.improvement === 'string' ? body.improvement : '';

    if (!email) {
      return NextResponse.json({ ok: false, error: 'Missing email' }, { status: 400 });
    }
    if (!rawImprovement.trim()) {
      return NextResponse.json({ ok: false, error: 'Missing improvement text' }, { status: 400 });
    }

    // find user
    const { data: user, error: userErr } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (userErr) return NextResponse.json({ ok: false, error: userErr.message }, { status: 500 });
    if (!user)   return NextResponse.json({ ok: false, error: 'User not found' }, { status: 404 });

    // upsert JUST the improvement field; other fields untouched
    const { error: upsertErr } = await supabaseAdmin
      .from('migrate_mate_status')
      .upsert(
        { user_id: user.id, improvement: rawImprovement.trim().slice(0, 2000) },
        { onConflict: 'user_id', ignoreDuplicates: false }
      );

    if (upsertErr) {
      return NextResponse.json({ ok: false, error: upsertErr.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'Server error' }, { status: 500 });
  }
}