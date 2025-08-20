// src/app/cancel/still-looking/downsell/page.tsx
'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function DownsellPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#bfbfbf]/35 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl rounded-2xl bg-white shadow-xl ring-1 ring-black/5 overflow-hidden">
        {/* Header */}
        <div className="relative border-b px-4 sm:px-6 py-3 sm:py-4">
          <span className="absolute left-3 top-3 sm:left-4 sm:top-3 text-xs sm:text-sm text-gray-600">‹ Back</span>

          <div className="flex items-center justify-center">
            <h2 className="text-[12px] sm:text-sm font-medium text-gray-800">
              Subscription Cancellation
            </h2>
          </div>

          {/* Progress */}
          <div className="hidden md:flex items-center gap-2 absolute right-14 top-3 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <span className="inline-block h-1.5 w-6 rounded-full bg-gray-900" />
              <span className="inline-block h-1.5 w-6 rounded-full bg-gray-300" />
              <span className="inline-block h-1.5 w-6 rounded-full bg-gray-300" />
            </div>
            <span className="ml-2">Step 1 of 3</span>
          </div>

          <span className="absolute right-3 top-2.5 sm:right-4 sm:top-3 rounded p-2 text-gray-500">✕</span>

          {/* Mobile progress */}
          <div className="mt-2 flex items-center justify-center gap-3 md:hidden">
            <div className="flex items-center gap-1">
              <span className="inline-block h-1.5 w-6 rounded-full bg-gray-900" />
              <span className="inline-block h-1.5 w-6 rounded-full bg-gray-300" />
              <span className="inline-block h-1.5 w-6 rounded-full bg-gray-300" />
            </div>
            <span className="text-[11px] text-gray-600">Step 1 of 3</span>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 sm:p-6 md:p-8">
          {/* LEFT: copy + offer */}
          <div className="order-2 md:order-1">
            <h1 className="text-[22px] sm:text-[26px] font-extrabold leading-snug text-gray-900">
              We built this to help you land the job, this makes it a little easier.
            </h1>
            <p className="mt-2 text-[13px] sm:text-sm text-gray-600">
              We’ve been there and we’re here to help you. Keep your tools while you search.
            </p>

            {/* Purple offer card */}
            <div className="mt-4 rounded-2xl border border-purple-200 bg-gradient-to-b from-purple-50 to-purple-100/60 p-3 sm:p-4">
              <div className="rounded-xl bg-white/60 backdrop-blur-sm border border-purple-200 p-3 sm:p-4">
                <p className="text-[15px] sm:text-base font-semibold text-purple-900 text-center">
                  Here’s <span className="underline decoration-purple-300">$10 off</span> until you find a job.
                </p>

                {/* Price line (primary plan) */}
                <div className="mt-2 flex items-center justify-center gap-2 text-[13px] sm:text-sm">
                  <span className="font-semibold text-purple-900">$15/month</span>
                  <span className="text-gray-400 line-through">$25/month</span>
                </div>

                {/* Secondary plan note */}
                <div className="mt-1 text-center text-[11px] sm:text-xs text-purple-900/80">
                  On $29 plan: <span className="font-medium">$19</span>{' '}
                  <span className="text-gray-400 line-through">$29</span>
                </div>

                {/* CTAs */}
                <div className="mt-3 flex flex-col sm:flex-row gap-3">
                  {/* ✅ Accept → confirmation page */}
                  <button
                    type="button"
                    className="flex-1 rounded-lg bg-emerald-500 text-white font-medium py-2 text-sm hover:brightness-95"
                    onClick={() => router.push('/cancel/downsell_accepted')}
                  >
                    Get $10 off
                  </button>

                  {/* No thanks → route with promo flag */}
                  <button
                    type="button"
                    className="flex-1 rounded-lg border px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => router.push('/cancel/still-looking?offer=downsell')}
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

          {/* RIGHT: image (hidden on mobile) */}
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