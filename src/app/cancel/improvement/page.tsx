// src/app/cancel/improvement/page.tsx
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

export default function ImprovementPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const foundWithMM = useMemo(() => {
    const raw = (sp.get('foundWithMM') || '').trim().toLowerCase();
    if (['yes', 'true', '1', 'y'].includes(raw)) return true;
    if (['no', 'false', '0', 'n'].includes(raw)) return false;
    return false;
  }, [sp]);

  const [feedback, setFeedback] = useState('');
  const isValid = feedback.trim().length >= 25;

  const handleContinue = () => {
    if (!isValid) return;
    router.push(`/cancel/visa?foundWithMM=${foundWithMM ? 'yes' : 'no'}`);
  };

  // NOTE: layout provides header, step (2), and right image
  return (
    <div>
      <h1 className="text-[20px] sm:text-[26px] md:text-[28px] font-extrabold text-gray-900">
        What’s one thing you wish we could’ve helped you with?
      </h1>
      <p className="mt-2 text-[12px] sm:text-sm text-gray-600">
        We’re always looking to improve; your thoughts can help us make Migrate Mate more useful for others.
      </p>

      <div className="mt-4">
        <textarea
          rows={6}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200"
          placeholder="Min 25 characters"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
        <div className="mt-1 text-[11px] text-gray-500">
          {`Min 25 characters (${feedback.trim().length}/25)`}
        </div>
      </div>

      <div className="mt-6">
        <button
          type="button"
          disabled={!isValid}
          onClick={handleContinue}
          className={`w-full rounded-xl py-3 text-sm font-semibold transition ${
            isValid ? 'bg-gray-900 text-white hover:bg-black' : 'bg-gray-100 text-gray-500 cursor-not-allowed'
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}