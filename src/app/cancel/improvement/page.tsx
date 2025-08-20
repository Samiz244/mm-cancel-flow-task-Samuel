// src/app/cancel/improvement/page.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';

export default function ImprovementPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // "yes" or "no" from previous page
  const foundWithMM = (searchParams.get('foundWithMM') || '').toLowerCase();

  const [text, setText] = useState('');
  const minChars = 25;
  const canContinue = text.trim().length >= minChars;

  const handleContinue = () => {
    if (!canContinue) return;

    // Route based on the Q1 answer we received
    const nextRoute =
      foundWithMM === 'yes'
        ? '/cancel/job-success/with-mm'      // TODO: build this page later
        : '/cancel/job-success/not-with-mm';  // TODO: build this page later

    router.push(nextRoute);
  };

  return (
    <main className="min-h-screen bg-[#bfbfbf]/35 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl rounded-2xl bg-white shadow-xl ring-1 ring-black/5 overflow-hidden">

        {/* Header */}
        <div className="relative border-b px-4 sm:px-6 py-3 sm:py-4">
          {/* Back */}
          <button
            onClick={() => router.back()}
            className="absolute left-3 top-3 sm:left-4 sm:top-3 flex items-center gap-1.5 text-xs sm:text-sm text-gray-600 hover:text-gray-800"
          >
            <span aria-hidden>‹</span> Back
          </button>

          {/* Centered title */}
          <h2 className="text-center text-[12px] sm:text-sm font-medium text-gray-800">
            Subscription Cancellation
          </h2>

          {/* Close */}
          <button
            onClick={() => router.push('/')}
            aria-label="Close"
            className="absolute right-3 top-2.5 sm:right-4 sm:top-3 rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
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
          <div className="order-2 md:order-1">
            <h1 className="text-[22px] sm:text-[26px] font-extrabold leading-snug text-gray-900">
              What’s one thing you wish we<br className="hidden sm:block" />
              could’ve helped you with?
            </h1>

            <p className="mt-3 text-[12px] sm:text-sm text-gray-600">
              We’re always looking to improve, your thoughts can help us
              make Migrate Mate more useful for others.
            </p>

            <div className="mt-4">
              <textarea
                rows={5}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder=""
                className="w-full rounded-xl border border-gray-300 px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-gray-200"
              />
              <div className="mt-1 text-[11px] text-gray-500 text-right">
                Min {minChars} characters ({text.trim().length}/{minChars})
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleContinue}
                disabled={!canContinue}
                className={`w-full rounded-xl py-3 text-sm font-semibold text-center transition
                  ${canContinue ? 'bg-black text-white hover:bg-black/90' : 'bg-gray-100 text-gray-500 cursor-not-allowed'}
                `}
              >
                Continue
              </button>
            </div>
          </div>

         {/* RIGHT: image (desktop only) */}
<div className="order-2 hidden md:block">
  <div className="relative w-full h-[360px] lg:h-[420px]">
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