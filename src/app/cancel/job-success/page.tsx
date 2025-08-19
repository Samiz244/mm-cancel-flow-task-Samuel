// src/app/cancel/job-success/page.tsx
'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Choice = string | null;

function Pill({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl border px-3 py-2 text-[12px] sm:text-sm transition
        ${selected ? 'border-black ring-2 ring-black/10 bg-gray-50' : 'border-gray-300 hover:bg-gray-50'}`}
      aria-pressed={selected}
    >
      {label}
    </button>
  );
}

export default function JobSuccessPage() {
  const router = useRouter();

  // Selections
  const [foundWithMM, setFoundWithMM] = useState<Choice>(null);
  const [appliedCount, setAppliedCount] = useState<Choice>(null);
  const [emailedCount, setEmailedCount] = useState<Choice>(null);
  const [interviewCount, setInterviewCount] = useState<Choice>(null);

  const canContinue =
    !!foundWithMM && !!appliedCount && !!emailedCount && !!interviewCount;

  const goNext = () => {
    if (!canContinue) return;
    // Stub: next step; we’ll replace with the real route later
    router.push('/cancel/confirm');
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

          {/* Progress (visible on all sizes; we keep it centered under title) */}
          <div className="mt-2 flex items-center justify-center gap-3">
            <div className="flex items-center gap-1">
              <span className="inline-block h-1.5 w-6 rounded-full bg-gray-900" />
              <span className="inline-block h-1.5 w-6 rounded-full bg-gray-300" />
              <span className="inline-block h-1.5 w-6 rounded-full bg-gray-300" />
            </div>
            <span className="text-[11px] text-gray-600">Step 1 of 3</span>
          </div>
        </div>

        {/* Content — 1 col on mobile, 2 cols on md+ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 sm:p-6 md:p-8 items-start">
          {/* LEFT: form */}
          <div className="order-1">
            <h1 className="text-[20px] sm:text-[26px] md:text-[30px] font-extrabold text-gray-900">
              Congrats on the new role! 🎉
            </h1>

            {/* Q1 */}
            <div className="mt-5">
              <label className="block text-[12px] sm:text-sm font-medium text-gray-800 mb-2">
                Did you find this job with MigrateMate?*
              </label>
              <div className="grid grid-cols-2 gap-3">
                {['Yes', 'No'].map((t) => (
                  <Pill
                    key={t}
                    label={t}
                    selected={foundWithMM === t}
                    onClick={() => setFoundWithMM(t)}
                  />
                ))}
              </div>
            </div>

            {/* Q2 */}
            <div className="mt-5">
              <label className="block text-[12px] sm:text-sm font-medium text-gray-800 mb-2">
                How many roles did you apply for through Migrate Mate?*
              </label>
              <div className="grid grid-cols-4 gap-3">
                {['0', '1–5', '6–20', '20+'].map((t) => (
                  <Pill
                    key={t}
                    label={t}
                    selected={appliedCount === t}
                    onClick={() => setAppliedCount(t)}
                  />
                ))}
              </div>
            </div>

            {/* Q3 */}
            <div className="mt-5">
              <label className="block text-[12px] sm:text-sm font-medium text-gray-800 mb-2">
                How many companies did you email directly?*
              </label>
              <div className="grid grid-cols-4 gap-3">
                {['0', '1–5', '6–20', '20+'].map((t) => (
                  <Pill
                    key={t}
                    label={t}
                    selected={emailedCount === t}
                    onClick={() => setEmailedCount(t)}
                  />
                ))}
              </div>
            </div>

            {/* Q4 */}
            <div className="mt-5">
              <label className="block text-[12px] sm:text-sm font-medium text-gray-800 mb-2">
                How many different companies did you interview with?*
              </label>
              <div className="grid grid-cols-4 gap-3">
                {['0', '1–2', '3–5', '5+'].map((t) => (
                  <Pill
                    key={t}
                    label={t}
                    selected={interviewCount === t}
                    onClick={() => setInterviewCount(t)}
                  />
                ))}
              </div>
            </div>

            {/* Continue */}
            <div className="mt-6">
              <button
                onClick={goNext}
                disabled={!canContinue}
                className={`w-full rounded-xl py-3 text-sm font-medium transition
                  ${canContinue ? 'bg-black text-white hover:bg-black/90' : 'text-gray-500 bg-gray-100 cursor-not-allowed'}`}
              >
                Continue
              </button>
            </div>
          </div>

          {/* RIGHT: image — hidden on mobile, shown on md+ */}
          <div className="order-2 hidden md:block">
            {/* Give the image a real height so Next/Image fill works */}
            <div className="relative w-full h-[420px] lg:h-[520px]">
              <Image
                src="/images/empire-state-compressed.jpg"   // ensure file lives in public/images
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