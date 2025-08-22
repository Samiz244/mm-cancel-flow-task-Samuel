// src/app/cancel/still-looking/page.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState, useCallback } from 'react';

const DEFAULT_EMAIL = 'user1@example.com';

// Transform UI buckets into strings your current API (parseBucketToMax)
// will convert to the *minimum* we want (int4):
// "0" -> "0"        -> 0
// "1–5" -> "1+"     -> 1
// "6–20" -> "6+"    -> 6
// "5+" -> "6+"      -> 6
// "20+" -> "21+"    -> 21
function transformBucketForAPI(val: string | null): string | null {
  if (!val) return null;
  const v = val.trim();
  if (v === '0') return '0';
  if (v === '1–5') return '1+';
  if (v === '6–20') return '6+';
  if (v === '5+') return '6+';
  if (v === '20+') return '21+';
  // fallback (shouldn't happen with our options)
  return v;
}

export default function StillLookingPage() {
  const router = useRouter();
  const sp = useSearchParams();

  // use the email in the URL if present, otherwise a seed email
  const email = useMemo(() => (sp.get('email') || DEFAULT_EMAIL).trim(), [sp]);

  const [q1, setQ1] = useState<string | null>(null); // appliedCount bucket
  const [q2, setQ2] = useState<string | null>(null); // emailedCount bucket
  const [q3, setQ3] = useState<string | null>(null); // interviewCount bucket

  const [loadingInit, setLoadingInit] = useState(true);
  const [showPromo, setShowPromo] = useState(false);

  // For promo acceptance
  const [accepting, setAccepting] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  // For saving buckets
  const [saving, setSaving] = useState(false);

  const canContinue = !!q1 && !!q2 && !!q3;

  useEffect(() => {
    let alive = true;

    (async () => {
      setLoadingInit(true);
      setErrMsg(null);
      try {
        // Your /api/init assigns/returns downsell_variant + accepted_downsell
        const res = await fetch('/api/init', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ email }),
          cache: 'no-store',
        });

        const json = await res.json().catch(() => ({} as any));
        if (!alive) return;

        if (res.ok && json?.ok !== false) {
          const v = (json?.downsell_variant ?? json?.variant) as 'A' | 'B' | undefined;
          const accepted = Boolean(json?.accepted_downsell);
          setShowPromo(v === 'B' && !accepted);
        } else {
          setShowPromo(false);
          setErrMsg(json?.error || 'Failed to load cancellation info.');
        }
      } catch (e: any) {
        if (alive) {
          setShowPromo(false);
          setErrMsg(e?.message ?? 'Unable to load cancellation info.');
        }
      } finally {
        if (alive) setLoadingInit(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [email]);

  const pillBase =
    'rounded-xl border px-3 py-2 text-[12px] sm:text-sm transition text-gray-800';
  const pillIdle = 'border-gray-300 hover:bg-gray-50';
  const pillActive = 'border-black ring-2 ring-black/10 bg-gray-50';

  // Accept promo -> set accepted_downsell=true then go to downsell_accepted
  const handleAcceptPromo = useCallback(async () => {
    try {
      setAccepting(true);
      setErrMsg(null);
      const res = await fetch('/api/accept', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json?.ok === false) {
        throw new Error(json?.error || 'Could not apply discount.');
      }
    } catch (e: any) {
      // Non-blocking — still navigate to show the accepted screen
      console.warn(e?.message || e);
    } finally {
      setAccepting(false);
    }
    router.push(`/cancel/downsell_accepted?email=${encodeURIComponent(email)}`);
  }, [email, router]);

  // Save the three buckets to migrate_mate_status (as transformed strings),
  // then continue
  const handleContinue = useCallback(async () => {
    if (!canContinue || saving) return;
    setSaving(true);
    try {
      await fetch('/api/migrate_mate_status', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          email,
          // No employed_through_mm on this page (still looking)
          appliedCount:   transformBucketForAPI(q1), // e.g. "1–5" => "1+" -> 1 (int4)
          emailedCount:   transformBucketForAPI(q2), // e.g. "6–20" => "6+" -> 6
          interviewCount: transformBucketForAPI(q3), // e.g. "5+" => "6+" -> 6
        }),
      }).catch(() => {});

      const next = showPromo
        ? `/cancel/reasons?offer=downsell&email=${encodeURIComponent(email)}`
        : `/cancel/reasons?email=${encodeURIComponent(email)}`;

      router.push(next);
    } finally {
      setSaving(false);
    }
  }, [canContinue, saving, email, q1, q2, q3, showPromo, router]);

  return (
    <div>
      <h1 className="text-[22px] sm:text-[26px] font-extrabold leading-snug text-gray-900">
        Help us understand how you
        <br className="hidden sm:block" /> were using Migrate Mate.
      </h1>

      {/* Q1 */}
      <div className="mt-5">
        <p className="text-[11px] sm:text-xs text-gray-600 mb-2">
          How many roles did you apply for through Migrate Mate?
        </p>
        <div className="grid grid-cols-4 gap-3">
          {['0', '1–5', '6–20', '20+'].map((t) => (
            <button
              key={`q1-${t}`}
              type="button"
              onClick={() => setQ1(t)}
              className={`${pillBase} ${q1 === t ? pillActive : pillIdle}`}
              aria-pressed={q1 === t}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Q2 */}
      <div className="mt-5">
        <p className="text-[11px] sm:text-xs text-gray-600 mb-2">
          How many companies did you email directly?
        </p>
        <div className="grid grid-cols-4 gap-3">
          {['0', '1–5', '6–20', '20+'].map((t) => (
            <button
              key={`q2-${t}`}
              type="button"
              onClick={() => setQ2(t)}
              className={`${pillBase} ${q2 === t ? pillActive : pillIdle}`}
              aria-pressed={q2 === t}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Q3 */}
      <div className="mt-5">
        <p className="text-[11px] sm:text-xs text-gray-600 mb-2">
          How many different companies did you interview with?
        </p>
        <div className="grid grid-cols-4 gap-3">
          {['0', '1–2', '3–5', '5+'].map((t) => (
            <button
              key={`q3-${t}`}
              type="button"
              onClick={() => setQ3(t)}
              className={`${pillBase} ${q3 === t ? pillActive : pillIdle}`}
              aria-pressed={q3 === t}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Promo + Continue */}
      <div className="mt-6 space-y-3">
        {/* Only render promo when DB says: variant B AND not accepted */}
        {!loadingInit && showPromo && (
          <div className="mt-4">
            <button
              type="button"
              onClick={handleAcceptPromo}
              disabled={accepting}
              className="block w-full rounded-xl bg-emerald-500 text-white py-2 text-center text-sm font-semibold shadow-sm hover:brightness-95 disabled:opacity-50"
            >
              {accepting ? 'Applying…' : 'Get $10 off'}
            </button>
          </div>
        )}

        <button
          type="button"
          disabled={!canContinue || saving}
          onClick={handleContinue}
          className={`w-full rounded-xl py-3 text-sm font-semibold text-center transition ${
            canContinue && !saving
              ? 'bg-gray-900 text-white hover:bg-black'
              : 'bg-gray-200 text-gray-600 cursor-not-allowed'
          }`}
          aria-busy={saving}
        >
          {saving ? 'Saving…' : 'Continue'}
        </button>

        {/* Optional tiny error line */}
        {errMsg && (
          <p className="text-[11px] text-red-600 text-center">{errMsg}</p>
        )}
      </div>
    </div>
  );
}