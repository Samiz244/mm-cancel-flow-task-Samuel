// src/app/cancel/job-success/page.tsx
'use client';

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
    const found = (foundWithMM || '').toLowerCase(); // "yes" or "no"
    router.push(`/cancel/improvement?foundWithMM=${encodeURIComponent(found)}`);
  };

  // NOTE: layout provides header, progress (Step 1), and right image.
  return (
    <div className="order-2 md:order-1">
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
  );
}