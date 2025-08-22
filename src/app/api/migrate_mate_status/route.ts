import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

function parseBucketToMax(s: string | null | undefined) {
  // UI buckets like "0", "1–5", "6–20", "20+"
  const v = (s || '').trim();
  if (v === '0') return 0;
  if (v.includes('–')) {
    const parts = v.split('–');
    const max = Number(parts[1]?.replace('+', '') || 0);
    return Number.isFinite(max) ? max : 0;
  }
  if (v.endsWith('+')) {
    const n = Number(v.replace('+', ''));
    return Number.isFinite(n) ? n : 0;
  }
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = String(body?.email || '').trim().toLowerCase();
    if (!email) {
      return NextResponse.json({ ok: false, error: 'Missing email' }, { status: 400 });
    }

    // look up user
    const { data: user, error: userErr } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (userErr) return NextResponse.json({ ok: false, error: userErr.message }, { status: 500 });
    if (!user) return NextResponse.json({ ok: false, error: 'User not found' }, { status: 404 });

    // parse inputs
    const employedThroughMM = String(body?.foundWithMM || '').toLowerCase() === 'yes';
    const appliedMax   = parseBucketToMax(body?.appliedCount);
    const emailedMax   = parseBucketToMax(body?.emailedCount);
    const interviewMax = parseBucketToMax(body?.interviewCount);

    // upsert by user_id
    const { error: upsertErr } = await supabaseAdmin
      .from('migrate_mate_status')
      .upsert(
        {
          user_id: user.id,
          employed_through_mm: employedThroughMM,
          applied_count: appliedMax,
          contacts_count: emailedMax,
          interviews_count: interviewMax,
        },
        { onConflict: 'user_id' }
      );

    if (upsertErr) {
      return NextResponse.json({ ok: false, error: upsertErr.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'Server error' }, { status: 500 });
  }
}