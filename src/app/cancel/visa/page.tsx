// src/app/cancel/visa/page.tsx
'use client';

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';

type LawyerChoice = 'yes' | 'no' | null;

export default function VisaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Optional: controls header copy only (from previous step)
  const foundWithMM = (searchParams.get('foundWithMM') || '').toLowerCase() === 'yes';

  // Local UI state
  const [hasLawyer, setHasLawyer] = useState<LawyerChoice>(null);
  const [visaType, setVisaType] = useState(''); // optional

  // ✅ Only the Yes/No choice is required
  const canComplete = useMemo(() => !!hasLawyer, [hasLawyer]);

  const onComplete = () => {
    if (!hasLawyer) return;
    // Forward hasLawyer, visaType is optional (kept for future use)
    const url = `/cancel/employed-cancellation?hasLawyer=${hasLawyer}${
      visaType ? `&visaType=${encodeURIComponent(visaType)}` : ''
    }`;
    router.push(url);
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

          {/* Center title */}
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

          {/* Progress (Step 3 of 3) */}
          <div className="mt-2 flex items-center justify-center gap-3">
            <div className="flex items-center gap-1">
              <span className="inline-block h-1.5 w-6 rounded-full bg-gray-900" />
              <span className="inline-block h-1.5 w-6 rounded-full bg-gray-900" />
              <span className="inline-block h-1.5 w-6 rounded-full bg-gray-900" />
            </div>
            <span className="text-[11px] text-gray-600">Step 3 of 3</span>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 sm:p-6 md:p-8 items-start">
          {/* LEFT: form */}
          <div className="order-1">
            {/* Title varies based on foundWithMM */}
            {foundWithMM ? (
              <>
                <h1 className="text-[20px] sm:text-[24px] md:text-[26px] font-extrabold text-gray-900">
                  We helped you land the job, now
                  <br className="hidden sm:block" /> let’s help you secure your visa.
                </h1>
                <p className="mt-3 text-sm text-gray-600">
                  Is your company providing an immigration lawyer to help with your visa?
                </p>
              </>
            ) : (
              <>
                <h1 className="text-[20px] sm:text-[24px] md:text-[26px] font-extrabold text-gray-900">
                  You landed the job!
                  <br className="hidden sm:block" />
                  <span className="italic font-semibold"> That’s what we live for.</span>
                </h1>
                <p className="mt-3 text-sm text-gray-600">
                  Even if it wasn’t through Migrate Mate, let us help get your visa sorted.
                </p>
                <p className="mt-2 text-sm text-gray-600">
                  Is your company providing an immigration lawyer to help with your visa?
                </p>
              </>
            )}

            {/* Choices */}
            <div className="mt-4 space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="hasLawyer"
                  className="h-4 w-4"
                  checked={hasLawyer === 'yes'}
                  onChange={() => setHasLawyer('yes')}
                />
                <span className="text-sm text-gray-800">Yes</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="hasLawyer"
                  className="h-4 w-4"
                  checked={hasLawyer === 'no'}
                  onChange={() => setHasLawyer('no')}
                />
                <span className="text-sm text-gray-800">No</span>
              </label>
            </div>

            {/* Optional input (kept for future; not required) */}
            {hasLawyer && (
              <div className="mt-4">
                <label className="block text-xs text-gray-600 mb-2">
                  {hasLawyer === 'yes'
                    ? 'What visa will you be applying for? (optional)'
                    : 'We can connect you with a partner. Which visa would you like to apply for? (optional)'}
                </label>
                <input
                  type="text"
                  placeholder="e.g., H‑1B"
                  value={visaType}
                  onChange={(e) => setVisaType(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200"
                />
              </div>
            )}

            {/* CTA */}
            <div className="mt-6">
              <button
                type="button"
                disabled={!canComplete}
                onClick={onComplete}
                className={`w-full rounded-xl py-3 text-sm font-semibold transition ${
                  canComplete
                    ? 'bg-gray-900 text-white hover:bg-black'
                    : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                }`}
              >
                Complete cancellation
              </button>
            </div>
          </div>

          {/* RIGHT: image (hidden on mobile) */}
          <div className="order-2 hidden md:block">
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