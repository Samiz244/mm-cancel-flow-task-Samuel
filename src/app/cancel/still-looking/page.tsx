// src/app/cancel/still-looking/page.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';

export default function StillLookingPage() {
  const router = useRouter();
  const sp = useSearchParams();

  // read ?offer=downsell safely on the client
  const showPromo = useMemo(() => sp.get('offer') === 'downsell', [sp]);

  // selections
  const [q1, setQ1] = useState<string | null>(null);
  const [q2, setQ2] = useState<string | null>(null);
  const [q3, setQ3] = useState<string | null>(null);

  const canContinue = !!q1 && !!q2 && !!q3;

  const pillBase =
    'rounded-xl border px-3 py-2 text-[12px] sm:text-sm transition text-gray-800';
  const pillIdle = 'border-gray-300 hover:bg-gray-50';
  const pillActive = 'border-black ring-2 ring-black/10 bg-gray-50';

  return (
    <main className="min-h-screen bg-[#bfbfbf]/35 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl rounded-2xl bg-white shadow-xl ring-1 ring-black/5 overflow-hidden">
        {/* Header */}
        <div className="relative border-b px-4 sm:px-6 py-3 sm:py-4">
          {/* ← Back: go to previous page in history */}
          <button
            type="button"
            onClick={() => router.back()}
            className="absolute left-3 top-3 sm:left-4 sm:top-3 flex items-center gap-1.5 text-xs sm:text-sm text-gray-600 hover:text-gray-800"
            aria-label="Go back"
          >
            <span aria-hidden>‹</span> Back
          </button>

          <div className="flex items-center justify-center">
            <h2 className="text-[12px] sm:text-sm font-medium text-gray-800">
              Subscription Cancellation
            </h2>
          </div>

          {/* Progress (desktop) */}
          <div className="hidden md:flex items-center gap-2 absolute right-14 top-3 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <span className="inline-block h-1.5 w-6 rounded-full bg-gray-900" />
              <span className="inline-block h-1.5 w-6 rounded-full bg-gray-900" />
              <span className="inline-block h-1.5 w-6 rounded-full bg-gray-300" />
            </div>
            <span className="ml-2">Step 2 of 3</span>
          </div>

          {/* X/Close: send them to the starting page ("/") */}
          <button
            type="button"
            onClick={() => router.push('/')}
            aria-label="Close and return to start"
            className="absolute right-3 top-2.5 sm:right-4 sm:top-3 rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            ✕
          </button>

          {/* Progress (mobile) */}
          <div className="mt-2 flex items-center justify-center gap-3 md:hidden">
            <div className="flex items-center gap-1">
              <span className="inline-block h-1.5 w-6 rounded-full bg-gray-900" />
              <span className="inline-block h-1.5 w-6 rounded-full bg-gray-900" />
              <span className="inline-block h-1.5 w-6 rounded-full bg-gray-300" />
            </div>
            <span className="text:[11px] text-gray-600">Step 2 of 3</span>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 sm:p-6 md:p-8">
          <div className="order-2 md:order-1">
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

            {/* Promo + Continue section */}
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

              {/* Continue is disabled until all three answers are chosen */}
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

          {/* Image (desktop only) */}
          <div className="order-1 md:order-2 hidden md:block">
            <div className="relative w-full h-[360px] lg:h-[480px]">
              <Image
                src="/images/empire-state-compressed.jpg"
                alt="City skyline"
                fill
                sizes="(min-width: 1024px) 40vw, (min-width: 768px) 50vw, 100vw"
                className="rounded-xl object-cover shadow-sm"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}