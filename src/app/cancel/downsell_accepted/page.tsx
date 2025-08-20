// src/app/cancel/downsell_accepted/page.tsx
import Image from 'next/image';

export default function DownsellAcceptedPage() {
  return (
    <main className="min-h-screen bg-[#bfbfbf]/35 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl rounded-2xl bg-white shadow-xl ring-1 ring-black/5 overflow-hidden">
        {/* Header */}
        <div className="relative border-b px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-center">
            <h2 className="text-[12px] sm:text-sm font-medium text-gray-800">Subscription</h2>
          </div>
          <span className="absolute right-3 top-2.5 sm:right-4 sm:top-3 rounded p-2 text-gray-500">✕</span>
        </div>

        {/* Content (image on top for mobile, right for md+) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 sm:p-6 md:p-8 items-start">
          {/* IMAGE */}
          <div className="order-1 md:order-2">
            <div className="relative w-full h-[220px] sm:h-[260px] md:h-[360px] lg:h-[420px]">
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

          {/* COPY */}
          <div className="order-2 md:order-1">
            <h1 className="text-[22px] sm:text-[26px] font-extrabold text-gray-900">
              Great choice, mate!
            </h1>

            <p className="mt-2 text-[14px] sm:text-[16px] text-gray-800 font-semibold">
              You’re still on the path to your dream role.
              <span className="text-[#7b40fc]"> Let’s make it happen together!</span>
            </p>

            <div className="mt-4 space-y-2 text-[12px] sm:text-sm text-gray-600">
              <p>
                You’ve got <span className="font-medium">XX days</span> left on your current plan.
              </p>
              <p>
                Starting from <span className="font-medium">XX date</span>, your monthly payment will be
                <span className="font-semibold text-gray-900"> $15.00</span>
                <span className="text-gray-400"> ($29 plan would be $19.00)</span>.
              </p>
              <p>You can cancel anytime before then.</p>
            </div>

            <div className="mt-6">
              <button
                type="button"
                className="w-full rounded-xl bg-[#8952fc] text-white py-3 text-sm font-semibold shadow-sm hover:bg-[#7b40fc]"
              >
                Land your dream role
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}