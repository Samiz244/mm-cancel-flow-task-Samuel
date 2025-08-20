// src/app/cancel/still-looking/page.tsx
'use client';

import Image from 'next/image';

export default function StillLookingPage() {
  return (
    <main className="min-h-screen bg-[#bfbfbf]/35 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl rounded-2xl bg-white shadow-xl ring-1 ring-black/5 overflow-hidden">
        {/* Header */}
        <div className="relative border-b px-4 sm:px-6 py-3 sm:py-4">
          <span className="absolute left-3 top-3 sm:left-4 sm:top-3 text-xs sm:text-sm text-gray-600">
            ‹ Back
          </span>

          <div className="flex items-center justify-center">
            <h2 className="text-[12px] sm:text-sm font-medium text-gray-800">
              Subscription Cancellation
            </h2>
          </div>

          {/* Desktop progress (right side) */}
          <div className="hidden md:flex items-center gap-2 absolute right-14 top-3 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              {/* Step dots: 2 filled, 1 inactive for "Step 2 of 3" */}
              <span className="inline-block h-1.5 w-6 rounded-full bg-gray-900" />
              <span className="inline-block h-1.5 w-6 rounded-full bg-gray-900" />
              <span className="inline-block h-1.5 w-6 rounded-full bg-gray-300" />
            </div>
            <span className="ml-2">Step 2 of 3</span>
          </div>

          <span className="absolute right-3 top-2.5 sm:right-4 sm:top-3 rounded p-2 text-gray-500">
            ✕
          </span>

          {/* Mobile progress under title */}
          <div className="mt-2 flex items-center justify-center gap-3 md:hidden">
            <div className="flex items-center gap-1">
              <span className="inline-block h-1.5 w-6 rounded-full bg-gray-900" />
              <span className="inline-block h-1.5 w-6 rounded-full bg-gray-900" />
              <span className="inline-block h-1.5 w-6 rounded-full bg-gray-300" />
            </div>
            <span className="text-[11px] text-gray-600">Step 2 of 3</span>
          </div>
        </div>

        {/* Content: left form, right image (hidden on mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 sm:p-6 md:p-8">
          {/* LEFT — copy + questions (static) */}
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
                    className="rounded-xl border border-gray-300 px-3 py-2 text-[12px] sm:text-sm hover:bg-gray-50 transition text-gray-800"
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
                    className="rounded-xl border border-gray-300 px-3 py-2 text-[12px] sm:text-sm hover:bg-gray-50 transition text-gray-800"
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
                    className="rounded-xl border border-gray-300 px-3 py-2 text-[12px] sm:text-sm hover:bg-gray-50 transition text-gray-800"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions — no downsell; continue disabled look */}
            <div className="mt-6 grid grid-cols-1 gap-3">
              <button
                type="button"
                className="w-full rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed py-3 text-sm font-medium"
              >
                Continue
              </button>
            </div>
          </div>

          {/* RIGHT — image (desktop/tablet only) */}
          <div className="order-1 md:order-2 hidden md:block">
            <div className="relative w-full h-[360px] lg:h-[480px]">
              <Image
                src="/images/empire-state-compressed.jpg" // ensure file exists in /public/images
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