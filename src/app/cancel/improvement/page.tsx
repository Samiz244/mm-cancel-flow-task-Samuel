// src/app/cancel/improvement/page.tsx
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useMemo, useState } from 'react';

export default function ImprovementPage() {
  const router = useRouter();
  const sp = useSearchParams();

  // ✅ Read query param via hook (avoids Next.js sync warning)
  const foundWithMM = useMemo(() => {
    const raw = (sp.get('foundWithMM') || '').trim().toLowerCase();
    if (['yes', 'true', '1', 'y'].includes(raw)) return true;
    if (['no', 'false', '0', 'n'].includes(raw)) return false;
    return false;
  }, [sp]);

  const [feedback, setFeedback] = useState('');
  const isValid = feedback.trim().length >= 25;

  const handleContinue = () => {
    if (!isValid) return;
    router.push(`/cancel/visa?foundWithMM=${foundWithMM ? 'yes' : 'no'}`);
  };

  return (
    <main className="min-h-screen bg-[#bfbfbf]/35 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl rounded-2xl bg-white shadow-xl ring-1 ring-black/5 overflow-hidden">
        {/* Header */}
        <div className="relative border-b px-4 sm:px-6 py-3 sm:py-4">
          <button
            onClick={() => router.back()}
            className="absolute left-3 top-3 sm:left-4 sm:top-3 text-xs sm:text-sm text-gray-600"
          >
            ‹ Back
          </button>
          <h2 className="text-center text-[12px] sm:text-sm font-medium text-gray-800">
            Subscription Cancellation
          </h2>
          <button
            onClick={() => router.push('/')}
            aria-label="Close"
            className="absolute right-3 top-2.5 sm:right-4 sm:top-3 rounded p-2 text-gray-500"
          >
            ✕
          </button>

          {/* Progress */}
          <div className="mt-2 flex items-center justify-center gap-3">
            <div className="flex items-center gap-1">
              <span className="inline-block h-1.5 w-6 rounded-full bg-gray-900" />
              <span className="inline-block h-1.5 w-6 rounded-full bg-gray-900" />
              <span className="inline-block h-1.5 w-6 rounded-full bg-gray-300" />
            </div>
            <span className="text-[11px] text-gray-600">Step 2 of 3</span>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 sm:p-6 md:p-8 items-start">
          {/* LEFT: prompt + textarea */}
          <div>
            <h1 className="text-[20px] sm:text-[26px] md:text-[28px] font-extrabold text-gray-900">
              What’s one thing you wish we could’ve helped you with?
            </h1>
            <p className="mt-2 text-[12px] sm:text-sm text-gray-600">
              We’re always looking to improve; your thoughts can help us make Migrate Mate more useful for others.
            </p>

            <div className="mt-4">
              <textarea
                rows={6}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200"
                placeholder="Min 25 characters"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
              <div className="mt-1 text-[11px] text-gray-500">
                {`Min 25 characters (${feedback.trim().length}/25)`}
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                disabled={!isValid}
                onClick={handleContinue}
                className={`w-full rounded-xl py-3 text-sm font-semibold transition ${
                  isValid ? 'bg-gray-900 text-white hover:bg-black' : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                }`}
              >
                Continue
              </button>
            </div>
          </div>

          {/* RIGHT: image (desktop only) */}
          <div className="hidden md:block">
            <div className="relative w-full h-[360px] lg:h-[460px]">
              <Image
                src="/images/empire-state-compressed.jpg"
                alt="City skyline"
                fill
                sizes="(min-width: 1024px) 40vw, (min-width: 768px) 50vw"
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