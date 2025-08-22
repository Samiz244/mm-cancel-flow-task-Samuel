// src/app/cancel/still-looking/downsell/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const DEFAULT_EMAIL = 'user1@example.com';

// Safe currency helper
function fmtUSDfromCents(cents: unknown) {
  const n = typeof cents === 'number' ? cents : Number(cents);
  if (!Number.isFinite(n) || n < 0) return null;
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n / 100);
}

export default function DownsellPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const email = useMemo(() => (sp.get('email') || DEFAULT_EMAIL).trim(), [sp]);

  const [planCents, setPlanCents] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // Load the user's plan (from /api/profile)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const res = await fetch(`/api/profile?email=${encodeURIComponent(email)}`, {
          cache: 'no-store',
        });
        const json = await res.json();
        if (!res.ok || !json?.ok) throw new Error(json?.error || 'Failed to load your plan');
        const cents = Number(json?.subscription?.monthlyPriceCents);
        if (!Number.isFinite(cents) || cents <= 0) throw new Error('Could not determine your plan.');
        if (!cancelled) setPlanCents(cents);
      } catch (e: any) {
        if (!cancelled) setErr(e?.message ?? 'Unable to load plan');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [email]);

  // $10 off only if plan >= $25
  const eligibleForDiscount = planCents != null && planCents >= 2500;
  const discountedCents =
    planCents == null ? null : eligibleForDiscount ? Math.max(0, planCents - 1000) : planCents;

  const discountedLabel = fmtUSDfromCents(discountedCents ?? NaN);
  const originalLabel = fmtUSDfromCents(planCents ?? NaN);

  const handleAccept = async () => {
    try {
      await fetch('/api/accept', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email }),
      }).catch(() => {});
    } finally {
      router.push(`/cancel/downsell_accepted?email=${encodeURIComponent(email)}`);
    }
  };

  const handleNoThanks = () => {
    router.push(`/cancel/still-looking?offer=downsell&email=${encodeURIComponent(email)}`);
  };

  return (
    <div className="order-2 md:order-1">
      <h1 className="text-[22px] sm:text-[26px] font-extrabold leading-snug text-gray-900">
        We built this to help you land the job, this makes it a little easier.
      </h1>
      <p className="mt-2 text-[13px] sm:text-sm text-gray-600">
        We’ve been there and we’re here to help you. Keep your tools while you search.
      </p>

      {/* Offer card */}
      <div className="mt-4 rounded-2xl border border-purple-200 bg-gradient-to-b from-purple-50 to-purple-100/60 p-3 sm:p-4">
        <div className="rounded-xl bg-white/60 backdrop-blur-sm border border-purple-200 p-3 sm:p-4">
          <p className="text-[15px] sm:text-base font-semibold text-purple-900 text-center">
            Here’s <span className="underline decoration-purple-300">$10 off</span> until you find a job.
          </p>

          {/* Pricing row (only the user's plan; no other-plan messaging) */}
          <div className="mt-2 text-center">
            {loading ? (
              <div className="mx-auto h-4 w-24 rounded bg-purple-100 animate-pulse" />
            ) : err ? (
              <p className="text-xs text-red-600">{err}</p>
            ) : discountedLabel && originalLabel ? (
              <div className="mt-1 flex items-center justify-center gap-2 text-[13px] sm:text-sm">
                <span className="font-semibold text-purple-900">{discountedLabel}/month</span>
                {eligibleForDiscount && (
                  <span className="text-gray-400 line-through">{originalLabel}/month</span>
                )}
              </div>
            ) : (
              <span className="text-xs text-gray-600">Couldn’t format your price.</span>
            )}
          </div>

          {/* CTAs */}
          <div className="mt-3 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              className="flex-1 rounded-lg bg-emerald-500 text-white font-medium py-2 text-sm hover:brightness-95 disabled:opacity-50"
              onClick={handleAccept}
              disabled={loading || !!err || planCents == null}
            >
              Get $10 off
            </button>

            <button
              type="button"
              className="flex-1 rounded-lg border px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              onClick={handleNoThanks}
            >
              No thanks
            </button>
          </div>

          <p className="mt-2 text-center text-[10px] sm:text-[11px] text-gray-600">
            You won’t be charged until your next billing date.
          </p>
        </div>
      </div>
    </div>
  );
}