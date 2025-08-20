// src/app/cancel/still-looking/page.tsx
'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';

export default function StillLookingPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const showPromo = useMemo(() => sp.get('offer') === 'downsell', [sp]);

  const [q1, setQ1] = useState<string | null>(null);
  const [q2, setQ2] = useState<string | null>(null);
  const [q3, setQ3] = useState<string | null>(null);

  const canContinue = !!q1 && !!q2 && !!q3;

  const pillBase =
    'rounded-xl border px-3 py-2 text-[12px] sm:text-sm transition text-gray-800';
  const pillIdle = 'border-gray-300 hover:bg-gray-50';
  const pillActive = 'border-black ring-2 ring-black/10 bg-gray-50';

  // NOTE: layout provides header, step (2), and right image
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
        {showPromo && (
          <div className="mt-4">
            <Link
              href="/cancel/downsell_accepted"
              className="block w-full rounded-xl bg-emerald-500 text-white py-2 text-center text-sm font-semibold shadow-sm hover:brightness-95"
            >
              Get $10 off | $15.00 / $19.00
            </Link>
          </div>
        )}

        <button
          type="button"
          disabled={!canContinue}
          onClick={() =>
            router.push(`/cancel/reasons${showPromo ? '?offer=downsell' : ''}`)
          }
          className={`w-full rounded-xl py-3 text-sm font-semibold text-center transition ${
            canContinue
              ? 'bg-gray-900 text-white hover:bg-black'
              : 'bg-gray-200 text-gray-600 cursor-not-allowed'
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}