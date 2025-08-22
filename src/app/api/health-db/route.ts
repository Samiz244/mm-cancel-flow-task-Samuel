// src/app/api/health-db/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase'; // <-- uses your helper

export async function GET() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('users')
    .select('id, email')
    .limit(5);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, sample: data ?? [] });
}