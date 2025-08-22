'use client';

import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';

type Sub = {
  status: 'active' | 'pending_cancellation' | 'cancelled';
  monthlyPriceCents: number;
  nextBillingDate: string | null; // coming directly from /api/profile
};

type ApiOk = { ok: true; email: string; userId: string; subscription: Sub | null };
type ApiErr = { ok: false; error: string };
type ApiData = ApiOk | ApiErr;

export default function CancellationPage() {
  const sp = useSearchParams();

  // grab email from query (?email=...), fallback to demo user
  const EMAIL = useMemo(() => {
    const q = (sp.get('email') || '').trim();
    return q || 'user1@example.com';
  }, [sp]);

  const [endDateLabel, setEndDateLabel] = useState('—');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/profile?email=${encodeURIComponent(EMAIL)}`, {
          cache: 'no-store',
        });
        const json: ApiData = await res.json();
        if (!alive) return;

        if ('ok' in json && json.ok && json.subscription?.nextBillingDate) {
          const nd = new Date(json.subscription.nextBillingDate);
          if (!Number.isNaN(nd.getTime())) {
            const label = nd.toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
            });
            setEndDateLabel(label);
          } else {
            setEndDateLabel('—');
          }
        } else {
          setEndDateLabel('—');
        }
      } catch (err) {
        console.error('cancellation page error:', err);
        if (alive) setEndDateLabel('—');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [EMAIL]);

  return (
    <div className="p-6">
    <h1 className="text-[22px] sm:text-[26px] font-extrabold text-gray-900">
  Sorry to see you go, mate.
</h1>

<p className="mt-3 text-[14px] sm:text-[16px] font-semibold text-gray-900">
  Thanks for being with us, and you’re always welcome back.
</p> <br></br>
      <p>
        Your subscription is set to end on{' '}
        <span className="font-medium">{loading ? '…' : endDateLabel}</span>.
      </p>
      <p>You’ll still have full access until then. No further charges after that.</p>
    </div>
  );
}