// src/app/cancel/still-looking/downsell_accepted/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const DEFAULT_EMAIL = 'user1@example.com';

function fmtUSDfromCents(cents: unknown) {
  const n = typeof cents === 'number' ? cents : Number(cents);
  if (!Number.isFinite(n) || n < 0) return null;
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n / 100);
}

export default function DownsellAcceptedPage() {
  const sp = useSearchParams();
  const email = useMemo(() => (sp.get('email') || DEFAULT_EMAIL).trim(), [sp]);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setErr(null);
      setLabel(null);
      try {
        if (!email) throw new Error('Missing email');
        const res = await fetch(`/api/profile?email=${encodeURIComponent(email)}`, { cache: 'no-store' });
        const json = await res.json();

        if (!res.ok || json?.ok === false) {
          throw new Error(json?.error || 'Failed to load profile');
        }

        // Expecting: json.subscription.monthlyPriceCents (int4 cents)
        const raw = json?.subscription?.monthlyPriceCents;
        const planCents = Number(raw);
        if (!Number.isFinite(planCents) || planCents <= 0) {
          throw new Error('No active subscription or invalid price.');
        }

        // $10 off but only if plan is >= $25 (2500 cents)
        const discounted = planCents >= 2500 ? planCents - 1000 : planCents;
        const formatted = fmtUSDfromCents(discounted);
        if (!formatted) throw new Error('Could not format price.');

        if (alive) setLabel(formatted);
      } catch (e: any) {
        if (alive) setErr(e?.message ?? String(e));
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [email]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">You’re all set — discount applied</h1>
      <p className="mt-2 text-sm text-gray-600">
        We’ve applied your $10/mo discount. You’ll see the new price on your next billing date.
      </p>

      <div className="mt-4 rounded-xl border bg-purple-50 p-4">
        {loading ? (
          <div className="h-5 w-24 mx-auto bg-purple-100 rounded animate-pulse" />
        ) : err ? (
          <p className="text-red-600 text-sm">{err}</p>
        ) : label ? (
          <p className="text-lg font-semibold text-purple-900">{label}/month</p>
        ) : (
          <p className="text-gray-600 text-sm">Couldn’t calculate your price.</p>
        )}
      </div>
    </div>
  );
}