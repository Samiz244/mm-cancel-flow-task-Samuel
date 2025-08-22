// src/app/api/init/route.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabase';

// Deterministic 50/50 A/B from user.id (stable across sessions)
function pickVariantFromId(id: string): 'A' | 'B' {
  const h = crypto.createHash('sha256').update(id).digest('hex');
  return parseInt(h.slice(-1), 16) % 2 === 0 ? 'A' : 'B';
}

async function handleInit(email: string) {
  // 1) Find user
  const { data: user, error: userErr } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('email', email)
    .maybeSingle();

  if (userErr) {
    return NextResponse.json({ ok: false, error: userErr.message }, { status: 500 });
  }
  if (!user) {
    return NextResponse.json({ ok: false, error: 'User not found' }, { status: 404 });
  }

  // 2) Latest active/pending subscription (if any)
  const { data: sub, error: subErr } = await supabaseAdmin
    .from('subscriptions')
    .select('id, status, created_at')
    .eq('user_id', user.id)
    .in('status', ['active', 'pending_cancellation'])
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (subErr) {
    return NextResponse.json({ ok: false, error: subErr.message }, { status: 500 });
  }

  // If there is an eligible subscription, ensure we have a cancellations row tied to it.
  if (sub?.id) {
    // 3) Try to reuse an existing cancellation row for this sub
    const { data: existing, error: existErr } = await supabaseAdmin
      .from('cancellations')
      .select('id, downsell_variant, accepted_downsell')
      .eq('user_id', user.id)
      .eq('subscription_id', sub.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existErr) {
      return NextResponse.json({ ok: false, error: existErr.message }, { status: 500 });
    }

    if (existing?.downsell_variant === 'A' || existing?.downsell_variant === 'B') {
      // Reuse
      return NextResponse.json({
        ok: true,
        downsell_variant: existing.downsell_variant,
        accepted_downsell: Boolean(existing.accepted_downsell),
      });
    }

    // 4) First time for this subscription: assign variant & insert
    const variant: 'A' | 'B' = pickVariantFromId(user.id);
    const { data: inserted, error: insErr } = await supabaseAdmin
      .from('cancellations')
      .insert({
        user_id: user.id,
        subscription_id: sub.id,
        downsell_variant: variant,
        accepted_downsell: false,
      })
      .select('downsell_variant, accepted_downsell')
      .single();

    if (insErr) {
      return NextResponse.json({ ok: false, error: insErr.message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      downsell_variant: inserted.downsell_variant,
      accepted_downsell: Boolean(inserted.accepted_downsell),
    });
  }

  // No active/pending subscription: compute a stable variant but don't insert a row
  const fallbackVariant: 'A' | 'B' = pickVariantFromId(user.id);
  return NextResponse.json({
    ok: true,
    downsell_variant: fallbackVariant,
    accepted_downsell: false,
  });
}

// --- Handlers ---
// Your client uses: GET /api/init?email=...
export async function GET(req: NextRequest) {
  const email = (req.nextUrl.searchParams.get('email') || '').trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: 'Missing or invalid email' }, { status: 400 });
  }
  return handleInit(email);
}

// Keep POST for compatibility (body: { email })
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    const e = String(email || '').trim().toLowerCase();
    if (!e || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) {
      return NextResponse.json({ ok: false, error: 'Missing or invalid email' }, { status: 400 });
    }
    return handleInit(e);
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 });
  }
}