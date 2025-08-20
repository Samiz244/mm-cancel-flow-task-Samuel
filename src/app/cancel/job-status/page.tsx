// src/app/cancel/job-status/page.tsx
'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function JobStatusPage() {
  const router = useRouter();

  /**
   * Persistent A/B variant for the "Not yet" path.
   * - Chosen once with crypto RNG (50/50)
   * - Stored in localStorage so it never re-randomizes
   * - 'A' = normal reasons flow
   * - 'B' = downsell flow
   */
  const [variant, setVariant] = useState<'A' | 'B' | null>(null);

  useEffect(() => {
    const KEY = 'mm_cancel_variant';
    // Read any previously assigned variant
    const saved = typeof window !== 'undefined' ? localStorage.getItem(KEY) : null;
    if (saved === 'A' || saved === 'B') {
      setVariant(saved);
      return;
    }
    // Assign deterministically with secure RNG (50/50)
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    const assigned: 'A' | 'B' = buf[0] % 2 === 0 ? 'A' : 'B';
    localStorage.setItem(KEY, assigned);
    setVariant(assigned);
  }, []);

  // Handlers
  const handleYes = () => {
    // User has a job → go to the "Congrats" step
    router.push('/cancel/job-success');
  };

  const handleNotYet = () => {
    // Route based on persistent variant (default to A if not set yet)
    const v = variant ?? 'A';
    if (v === 'B') {
      router.push('/cancel/still-looking/downsell');
    } else {
      router.push('/cancel/still-looking');
    }
  };

  return (
    <main className="min-h-screen bg-[#bfbfbf]/35 flex items-center justify-center p-4">
      {/* Card container */}
      <div className="w-full max-w-5xl rounded-2xl bg-white shadow-xl ring-1 ring-black/5 overflow-hidden">
        {/* Top bar: centered title + absolute close button */}
        <div className="relative border-b px-6 py-4">
          <h2 className="text-center text-sm font-medium text-gray-800">
            Subscription Cancellation
          </h2>
          <button
            onClick={() => router.push('/')}
            aria-label="Close"
            className="absolute right-4 top-2.5 rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Content: mobile stacked, desktop 2-col (text left / image right) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 sm:p-6 md:p-8">
          {/* IMAGE: first on mobile, second on desktop */}
          <div className="order-1 md:order-2">
            <div className="relative w-full aspect-video md:aspect-auto h-48 sm:h-56 md:h-full">
              <Image
                src="/images/empire-state-compressed.jpg" // ensure file exists under public/images/
                alt="City skyline"
                fill
                sizes="(max-width: 767px) 100vw, 50vw"
                className="rounded-xl object-cover shadow-sm"
                priority
              />
            </div>
          </div>

          {/* COPY + ACTIONS */}
          <div className="order-2 md:order-1 flex flex-col">
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

            {/* Choices */}
            <div className="mt-6 space-y-3">
              <button
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-800 hover:bg-gray-50 transition shadow-sm"
                onClick={handleYes}
              >
                Yes, I’ve found a job
              </button>

              <button
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-800 hover:bg-gray-50 transition shadow-sm"
                onClick={handleNotYet}
              >
                Not yet – I’m still looking
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}