// src/app/cancel/still-looking/downsell/page.tsx
'use client';

import { useRouter } from 'next/navigation';

export default function DownsellPage() {
  const router = useRouter();

  // NOTE: layout provides header, progress (Step 1), and the right image.
  return (
    <div className="order-2 md:order-1">
      <h1 className="text-[22px] sm:text-[26px] font-extrabold leading-snug text-gray-900">
        We built this to help you land the job, this makes it a little easier.
      </h1>
      <p className="mt-2 text-[13px] sm:text-sm text-gray-600">
        We’ve been there and we’re here to help you. Keep your tools while you search.
      </p>

      {/* Purple offer card */}
      <div className="mt-4 rounded-2xl border border-purple-200 bg-gradient-to-b from-purple-50 to-purple-100/60 p-3 sm:p-4">
        <div className="rounded-xl bg-white/60 backdrop-blur-sm border border-purple-200 p-3 sm:p-4">
          <p className="text-[15px] sm:text-base font-semibold text-purple-900 text-center">
            Here’s <span className="underline decoration-purple-300">$10 off</span> until you find a job.
          </p>

          {/* Price line (primary plan) */}
          <div className="mt-2 flex items-center justify-center gap-2 text-[13px] sm:text-sm">
            <span className="font-semibold text-purple-900">$15/month</span>
            <span className="text-gray-400 line-through">$25/month</span>
          </div>

          {/* Secondary plan note */}
          <div className="mt-1 text-center text-[11px] sm:text-xs text-purple-900/80">
            On $29 plan: <span className="font-medium">$19</span>{' '}
            <span className="text-gray-400 line-through">$29</span>
          </div>

          {/* CTAs */}
          <div className="mt-3 flex flex-col sm:flex-row gap-3">
            {/* ✅ Accept → confirmation page */}
            <button
              type="button"
              className="flex-1 rounded-lg bg-emerald-500 text-white font-medium py-2 text-sm hover:brightness-95"
              onClick={() => router.push('/cancel/downsell_accepted')}
            >
              Get $10 off
            </button>

            {/* No thanks → route with promo flag */}
            <button
              type="button"
              className="flex-1 rounded-lg border px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => router.push('/cancel/still-looking?offer=downsell')}
            >
              No thanks
            </button>
          </div>

          <p className="mt-2 text-center text-[10px] sm:text-[11px] text-gray-600">
            You won’t be charged until your next billing date.
          </p>
        </div>
      </div>
    </div>
  );
}