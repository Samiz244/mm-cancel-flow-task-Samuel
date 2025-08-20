// src/app/cancel/cancellation/page.tsx
'use client';

import Link from 'next/link';

export default function CancellationCompletePage() {
  return (
    <div className="p-4 sm:p-6 md:p-8">
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
  );
}