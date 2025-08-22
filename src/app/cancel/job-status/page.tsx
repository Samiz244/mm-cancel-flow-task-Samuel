'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

type Variant = 'A' | 'B';

export default function JobStatusPage() {
  const router = useRouter();
  const sp = useSearchParams();

  // Read from URL: /cancel/job-status?email=...&variant=...
  const email = useMemo(() => (sp.get('email') || '').trim().toLowerCase(), [sp]);
  const variantFromQuery = useMemo<Variant | null>(() => {
    const v = (sp.get('variant') || '').toUpperCase();
    return v === 'A' || v === 'B' ? (v as Variant) : null;
  }, [sp]);

  const [variant, setVariant] = useState<Variant | null>(null);
  const [loading, setLoading] = useState(false);
  const [savingYes, setSavingYes] = useState(false);

  // Fetch canonical variant from DB via /api/init (returns downsell_variant)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!email) {
        // No email provided: fall back to URL param or default 'A'
        setVariant(variantFromQuery ?? 'A');
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`/api/init?email=${encodeURIComponent(email)}`, {
          cache: 'no-store',
        });
        const json = await res.json().catch(() => ({} as any));
        if (!cancelled) {
          const v = json?.downsell_variant;
          if (res.ok && (v === 'A' || v === 'B')) {
            setVariant(v as Variant);
          } else {
            setVariant(variantFromQuery ?? 'A');
          }
        }
      } catch {
        if (!cancelled) setVariant(variantFromQuery ?? 'A');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [email, variantFromQuery]);

  const handleYes = useCallback(async () => {
    const qs = email ? `?email=${encodeURIComponent(email)}` : '';
    try {
      if (email) {
        setSavingYes(true);
        // Mark employed = true on server
        const res = await fetch('/api/user_status', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        // Non-blocking if it fails; but we try to surface obvious errors
        // (You can remove this check if you never want to block navigation)
        const j = await res.json().catch(() => ({}));
        if (!res.ok || j?.ok === false) {
          console.warn('user_status update failed:', j?.error || res.status);
        }
      }
    } finally {
      setSavingYes(false);
      router.push(`/cancel/job-success${qs}`);
    }
  }, [router, email]);

  const handleNotYet = useCallback(() => {
    const v: Variant = variant ?? variantFromQuery ?? 'A';
    const qs = email ? `?email=${encodeURIComponent(email)}` : '';
    if (v === 'B') {
      router.push(`/cancel/still-looking/downsell${qs}`);
    } else {
      router.push(`/cancel/still-looking${qs}`);
    }
  }, [router, email, variant, variantFromQuery]);

  return (
    <div className="flex flex-col">
      <h1 className="text-3xl sm:text-[32px] font-extrabold leading-tight text-gray-900">
        Hey mate,
        <br />
        Quick one before you go.
      </h1>

      <h3 className="mt-3 text-2xl sm:text-[28px] font-semibold italic text-gray-900">
        Have you found a job yet?
      </h3>

      <p className="mt-4 text-[13px] sm:text-sm text-gray-600 max-w-prose">
        Whatever your answer, we just want to help you take the next step —
        whether that’s visa support or learning how we can do better.
      </p>

      <div className="mt-6 space-y-3">
        <button
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-800 hover:bg-gray-50 transition shadow-sm disabled:opacity-50"
          onClick={handleYes}
          disabled={savingYes}
          aria-busy={savingYes}
        >
          {savingYes ? 'Saving…' : 'Yes, I’ve found a job'}
        </button>

        <button
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-800 hover:bg-gray-50 transition shadow-sm disabled:opacity-50"
          onClick={handleNotYet}
          disabled={loading}
          aria-busy={loading}
        >
          Not yet – I’m still looking
        </button>
      </div>
    </div>
  );
}