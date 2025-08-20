// src/app/cancel/visa/page.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';

type LawyerChoice = 'yes' | 'no' | null;

export default function VisaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const foundWithMM = (searchParams.get('foundWithMM') || '').toLowerCase() === 'yes';

  const [hasLawyer, setHasLawyer] = useState<LawyerChoice>(null);
  const [visaType, setVisaType] = useState(''); // optional

  const canComplete = useMemo(() => !!hasLawyer, [hasLawyer]);

  const onComplete = () => {
    if (!hasLawyer) return;
    const url = `/cancel/employed-cancellation?hasLawyer=${hasLawyer}${
      visaType ? `&visaType=${encodeURIComponent(visaType)}` : ''
    }`;
    router.push(url);
  };

  // NOTE: layout provides header, progress (Step 3), and right image
  return (
    <div>
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

      {/* Optional input */}
      {hasLawyer && (
        <div className="mt-4">
          <label className="block text-xs text-gray-600 mb-2">
            {hasLawyer === 'yes'
              ? 'What visa will you be applying for? (optional)'
              : 'We can connect you with a partner. Which visa would you like to apply for? (optional)'}
          </label>
          <input
            type="text"
            placeholder="e.g., H-1B"
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
  );
}