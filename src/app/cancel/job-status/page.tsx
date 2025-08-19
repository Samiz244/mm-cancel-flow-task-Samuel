// src/app/cancel/job-status/page.tsx
'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function JobStatusPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#bfbfbf]/35 flex items-center justify-center p-4">
      {/* Modal card */}
      <div className="w-full max-w-5xl rounded-2xl bg-white shadow-xl ring-1 ring-black/5 overflow-hidden">
        
        {/* Top bar with centered title + absolute close button */}
        <div className="relative border-b px-6 py-4">
          <h2 className="text-center text-sm font-medium text-gray-800">
            Subscription Cancellation
          </h2>
          <button
            onClick={() => router.push('/')}
            aria-label="Close"
            className="absolute right-4 top-4 rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            <svg viewBox="0 0 20 20" className="h-5 w-5" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 8.586 15.657 2.93l1.414 1.415L11.414 10l5.657 5.657-1.414 1.415L10 11.414l-5.657 5.658-1.415-1.415L8.586 10 2.93 4.343 4.343 2.93 10 8.586Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Content: mobile = stacked, desktop = 2 cols */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 sm:p-6 md:p-8">
          {/* IMAGE: first on mobile, second on desktop */}
          <div className="order-1 md:order-2">
            <div className="relative w-full aspect-[16/9] md:h-full">
              <Image
                src="/images/empire-state-compressed.jpg" // ✅ put this in /public/images
                alt="City skyline"
                fill
                className="rounded-xl object-cover shadow-sm"
                priority
              />
            </div>
          </div>

          {/* COPY + BUTTONS */}
          <div className="order-2 md:order-1 flex flex-col">
            <h2 className="text-3xl sm:text-[32px] font-extrabold leading-tight text-gray-900">
              Hey mate,
              <br />
              Quick one before you go.
            </h2>

            <h3 className="mt-3 text-2xl sm:text-[28px] font-semibold italic text-gray-900">
              Have you found a job yet?
            </h3>

            <p className="mt-4 text-[13px] sm:text-sm text-gray-600 max-w-prose">
              Whatever your answer, we just want to help you take the next step.
              With visa support, or by hearing how we can do better.
            </p>

            {/* Buttons */}
            <div className="mt-6 space-y-3">
              <button
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-800 hover:bg-gray-50 transition shadow-sm"
                onClick={() => router.push('/cancel/job-success')} // ✅ go to Congrats screen
              >
                Yes, I’ve found a job
              </button>

              <button
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-800 hover:bg-gray-50 transition shadow-sm"
                onClick={() => console.log('No — still looking')}
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