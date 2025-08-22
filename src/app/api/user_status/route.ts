// src/app/api/user_status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));

    const email = String(body?.email || '').trim().toLowerCase();
    if (!email) {
      return NextResponse.json({ ok: false, error: 'Missing email' }, { status: 400 });
    }

    // Accept both camelCase and snake_case from the client
    const hasImmigrationLawyer =
      typeof body?.has_immigration_lawyer === 'boolean'
        ? body.has_immigration_lawyer
        : typeof body?.hasImmigrationLawyer === 'boolean'
        ? body.hasImmigrationLawyer
        : null;

    const futureVisaApplyingFor =
      typeof body?.future_visa_applying_for === 'string'
        ? (body.future_visa_applying_for as string).trim() || null
        : typeof body?.futureVisaApplyingFor === 'string'
        ? (body.futureVisaApplyingFor as string).trim() || null
        : null;

    // Lookup user
    const { data: user, error: userErr } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (userErr) return NextResponse.json({ ok: false, error: userErr.message }, { status: 500 });
    if (!user) return NextResponse.json({ ok: false, error: 'User not found' }, { status: 404 });

    // Build update payload; only include provided fields
    const update: Record<string, any> = { user_id: user.id };
    if (hasImmigrationLawyer !== null) update.has_immigration_lawyer = hasImmigrationLawyer;
    if (futureVisaApplyingFor !== null) update.future_visa_applying_for = futureVisaApplyingFor;

    if (!('has_immigration_lawyer' in update) && !('future_visa_applying_for' in update)) {
      // Nothing to change: but still return current row if exists (helps debugging)
      const { data: existing } = await supabaseAdmin
        .from('user_status')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      return NextResponse.json({ ok: true, noop: true, row: existing || null });
    }

    // Upsert by user_id and RETURN the row so you can verify in devtools
    const { data: upserted, error: upsertErr } = await supabaseAdmin
      .from('user_status')
      .upsert(update, { onConflict: 'user_id' })
      .select('*') // <— return the written row
      .single();

    if (upsertErr) {
      return NextResponse.json({ ok: false, error: upsertErr.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, row: upserted });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'Server error' }, { status: 500 });
  }
}