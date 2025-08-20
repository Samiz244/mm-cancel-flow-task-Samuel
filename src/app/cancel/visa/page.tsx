// src/app/cancel/visa/page.tsx
'use client';

import { useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';

type LawyerAns = 'yes' | 'no' | null;

export default function VisaPage() {
  const router = useRouter();
  const sp = useSearchParams();

  // ✅ derive foundWithMM from query safely
  const foundWithMM = useMemo(() => {
    const raw = (sp.get('foundWithMM') || '').trim().toLowerCase();
    if (['yes', 'true', '1', 'y'].includes(raw)) return true;
    if (['no', 'false', '0', 'n'].includes(raw)) return false;
    return false;
  }, [sp]);

  const title = foundWithMM
    ? "We helped you land the job, now let’s help you secure your visa."
    : "You landed the job! That’s what we live for.";

  const subIntro = foundWithMM
    ? null
    : "Even if it wasn’t through Migrate Mate, let us help get your visa sorted.";

  const [lawyer, setLawyer] = useState<LawyerAns>(null);
  const [visa, setVisa] = useState('');

  const needsVisaText = lawyer === 'yes' || lawyer === 'no';
  const canSubmit = !!lawyer && (!needsVisaText || visa.trim().length > 0);

  const handleComplete = () => {
    if (!canSubmit) return;
    router.push('/cancel/cancellation');
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
              <span className="inline-block h-1.5 w-6 rounded-full bg-gray-900" />
            </div>
            <span className="text-[11px] text-gray-600">Step 3 of 3</span>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 sm:p-6 md:p-8 items-start">
          {/* LEFT */}
          <div>
            <h1 className="text-[20px] sm:text-[26px] md:text-[28px] font-extrabold text-gray-900">
              {title}
            </h1>
            {subIntro && <p className="mt-2 text-sm text-gray-700">{subIntro}</p>}

            <div className="mt-6">
              <p className="text-[12px] sm:text-sm font-medium text-gray-800 mb-2">
                Is your company providing an immigration lawyer to help with your visa?*
              </p>

              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="lawyer"
                    className="h-4 w-4"
                    checked={lawyer === 'yes'}
                    onChange={() => setLawyer('yes')}
                  />
                  <span className="text-sm text-gray-800">Yes</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="lawyer"
                    className="h-4 w-4"
                    checked={lawyer === 'no'}
                    onChange={() => setLawyer('no')}
                  />
                  <span className="text-sm text-gray-800">No</span>
                </label>
              </div>

              {lawyer === 'yes' && (
                <div className="mt-5">
                  <label className="block text-xs text-gray-600 mb-2">
                    What visa will you be applying for?
                  </label>
                  <input
                    type="text"
                    value={visa}
                    onChange={(e) => setVisa(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200"
                    placeholder="e.g., H‑1B, O‑1, TN..."
                  />
                </div>
              )}

              {lawyer === 'no' && (
                <div className="mt-5">
                  <p className="text-xs text-gray-600 mb-2">
                    We can connect you with one of our trusted partners. Which visa would you like to apply for?
                  </p>
                  <input
                    type="text"
                    value={visa}
                    onChange={(e) => setVisa(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200"
                    placeholder="e.g., H‑1B, O‑1, TN..."
                  />
                </div>
              )}

              <div className="mt-6">
                <button
                  type="button"
                  disabled={!canSubmit}
                  onClick={handleComplete}
                  className={`w-full rounded-xl py-3 text-sm font-semibold transition ${
                    canSubmit ? 'bg-gray-900 text-white hover:bg-black' : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Complete cancellation
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: image (desktop only) */}
          <div className="hidden md:block">
            <div className="relative w-full h-[380px] lg:h-[460px]">
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