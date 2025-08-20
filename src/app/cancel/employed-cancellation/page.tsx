// src/app/cancel/employed-cancellation/page.tsx
'use client';

import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';

export default function EmployedCancellationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasLawyer = (searchParams.get('hasLawyer') || '').toLowerCase() === 'yes';

  const title = hasLawyer
    ? "All done, your cancellation’s been processed."
    : "Your cancellation’s all sorted, mate, no more charges.";

  const body = hasLawyer ? (
    <p className="text-sm text-gray-700">
      We’re stoked to hear you’ve landed a job and sorted your visa.  
      Big congrats from the team. 🙌
    </p>
  ) : (
    <div className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white/70 p-3">
      {/* Mihailo’s profile image */}
      <div className="relative h-10 w-10 flex-shrink-0">
        <Image
          src="/images/mihailo-profile.jpeg"
          alt="Mihailo Bozic"
          fill
          className="rounded-full object-cover"
        />
      </div>

      <div className="text-sm text-gray-700">
        <p className="font-medium">Mihailo Bozic &lt;mihailo@migratemate.co&gt;</p>
        <p className="mt-2">
          I’ll be reaching out soon to help with the visa side of things.  
          We’ve got your back — whether it’s questions, paperwork, or just figuring out your options.  
          Keep an eye on your inbox — I’ll be in touch shortly.
        </p>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#bfbfbf]/35 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl rounded-2xl bg-white shadow-xl ring-1 ring-black/5 overflow-hidden">
        {/* Header */}
        <div className="relative border-b px-4 sm:px-6 py-3 sm:py-4">
          <h2 className="text-center text-[12px] sm:text-sm font-medium text-gray-800">
            Subscription Cancelled
          </h2>

          <button
            onClick={() => router.push('/')}
            aria-label="Close"
            className="absolute right-3 top-2.5 sm:right-4 sm:top-3 rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            ✕
          </button>

          {/* Completed pills */}
          <div className="mt-2 flex items-center justify-center gap-2">
            <span className="inline-block h-1.5 w-6 rounded-full bg-emerald-600" />
            <span className="inline-block h-1.5 w-6 rounded-full bg-emerald-600" />
            <span className="inline-block h-1.5 w-6 rounded-full bg-emerald-600" />
            <span className="text-[11px] text-gray-600 ml-2">Completed</span>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 sm:p-6 md:p-8 items-start">
          {/* LEFT */}
          <div className="order-1">
            <h1 className="text-[20px] sm:text-[24px] md:text-[26px] font-extrabold text-gray-900">
              {title}
            </h1>

            <div className="mt-4">{body}</div>

            <button
              type="button"
              className="mt-6 w-full rounded-xl bg-[#8952fc] text-white py-3 text-sm font-semibold shadow-sm hover:bg-[#7b40fc]"
              onClick={() => router.push('/')}
            >
              Finish
            </button>
          </div>

          {/* RIGHT: Empire State image */}
          <div className="order-2 hidden md:block">
            <div className="relative w-full h-[360px] lg:h-[420px]">
              <Image
                src="/images/empire-state-compressed.jpg"
                alt="Empire State Building"
                fill
                className="rounded-xl object-cover shadow-sm"
                sizes="(min-width:1024px) 40vw, (min-width:768px) 50vw, 100vw"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}