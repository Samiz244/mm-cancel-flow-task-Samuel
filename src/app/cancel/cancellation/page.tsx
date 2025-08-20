// src/app/cancel/cancellation/page.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function CancellationCompletePage() {
  return (
    <main className="min-h-screen bg-[#bfbfbf]/35 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl rounded-2xl bg-white shadow-xl ring-1 ring-black/5 overflow-hidden">
        {/* Header */}
        <div className="relative border-b px-4 sm:px-6 py-3 sm:py-4">
          <span className="absolute left-3 top-3 sm:left-4 sm:top-3 text-xs sm:text-sm text-gray-600">‹ Back</span>

          <div className="flex items-center justify-center">
            <h2 className="text-[12px] sm:text-sm font-medium text-gray-800">
              Subscription Cancelled
            </h2>
          </div>

          {/* progress (desktop) */}
          <div className="hidden md:flex items-center gap-2 absolute right-14 top-3 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <span className="inline-block h-1.5 w-6 rounded-full bg-gray-900" />
              <span className="inline-block h-1.5 w-6 rounded-full bg-gray-900" />
              <span className="inline-block h-1.5 w-6 rounded-full bg-gray-900" />
            </div>
            <span className="ml-2">Completed</span>
          </div>

          <span className="absolute right-3 top-2.5 sm:right-4 sm:top-3 rounded p-2 text-gray-500">✕</span>

          {/* progress (mobile) */}
          <div className="mt-2 flex items-center justify-center gap-3 md:hidden">
            <div className="flex items-center gap-1">
              <span className="inline-block h-1.5 w-6 rounded-full bg-gray-900" />
              <span className="inline-block h-1.5 w-6 rounded-full bg-gray-900" />
              <span className="inline-block h-1.5 w-6 rounded-full bg-gray-900" />
            </div>
            <span className="text-[11px] text-gray-600">Completed</span>
          </div>
        </div>

        {/* Content (image on top for mobile, on right for md+) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 sm:p-6 md:p-8 items-start">
          {/* IMAGE */}
          <div className="order-1 md:order-2">
            <div className="relative w-full h-[220px] sm:h-[260px] md:h-[360px] lg:h-[420px]">
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

          {/* COPY */}
          <div className="order-2 md:order-1">
            <h1 className="text-[22px] sm:text-[26px] font-extrabold text-gray-900">
              Sorry to see you go, mate.
            </h1>

            <p className="mt-3 text-[14px] sm:text-[16px] font-semibold text-gray-900">
              Thanks for being with us, and you’re always welcome back.
            </p>

            <div className="mt-4 space-y-2 text-[12px] sm:text-sm text-gray-600">
              <p>
                Your subscription is set to end on <span className="font-medium">XX date</span>.
                You’ll still have full access until then. No further charges after that.
              </p>
              <p>
                Changed your mind? You can reactivate anytime before your end date.
              </p>
            </div>

            <div className="mt-6">
              <Link
                href="/"
                className="block w-full rounded-xl bg-[#8952fc] text-white py-3 text-sm font-semibold text-center shadow-sm hover:bg-[#7b40fc]"
              >
                Back to Jobs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}