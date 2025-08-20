// src/app/cancel/job-status/page.tsx
'use client';

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
    const saved = typeof window !== 'undefined' ? localStorage.getItem(KEY) : null;
    if (saved === 'A' || saved === 'B') {
      setVariant(saved);
      return;
    }
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    const assigned: 'A' | 'B' = buf[0] % 2 === 0 ? 'A' : 'B';
    localStorage.setItem(KEY, assigned);
    setVariant(assigned);
  }, []);

  const handleYes = () => {
    router.push('/cancel/job-success');
  };

  const handleNotYet = () => {
    const v = variant ?? 'A';
    if (v === 'B') {
      router.push('/cancel/still-looking/downsell');
    } else {
      router.push('/cancel/still-looking');
    }
  };

  // NOTE: The /cancel/layout.tsx provides the header, progress, and right-side image.
  // This component only renders the left-column content.
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
  );
}