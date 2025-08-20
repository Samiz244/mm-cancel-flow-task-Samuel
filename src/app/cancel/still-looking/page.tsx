// src/app/cancel/still-looking/page.tsx
import Image from 'next/image';
import Link from 'next/link';

export default function StillLookingPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const showPromo = searchParams?.offer === 'downsell';

  return (
    <main className="min-h-screen bg-[#bfbfbf]/35 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl rounded-2xl bg-white shadow-xl ring-1 ring-black/5 overflow-hidden">
        {/* Header */}
        <div className="relative border-b px-4 sm:px-6 py-3 sm:py-4">
          <span className="absolute left-3 top-3 sm:left-4 sm:top-3 text-xs sm:text-sm text-gray-600">‹ Back</span>
          <div className="flex items-center justify-center">
            <h2 className="text-[12px] sm:text-sm font-medium text-gray-800">
              Subscription Cancellation
            </h2>
          </div>
          <div className="hidden md:flex items-center gap-2 absolute right-14 top-3 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <span className="inline-block h-1.5 w-6 rounded-full bg-gray-900" />
              <span className="inline-block h-1.5 w-6 rounded-full bg-gray-900" />
              <span className="inline-block h-1.5 w-6 rounded-full bg-gray-300" />
            </div>
            <span className="ml-2">Step 2 of 3</span>
          </div>
          <span className="absolute right-3 top-2.5 sm:right-4 sm:top-3 rounded p-2 text-gray-500">✕</span>
          <div className="mt-2 flex items-center justify-center gap-3 md:hidden">
            <div className="flex items-center gap-1">
              <span className="inline-block h-1.5 w-6 rounded-full bg-gray-900" />
              <span className="inline-block h-1.5 w-6 rounded-full bg-gray-900" />
              <span className="inline-block h-1.5 w-6 rounded-full bg-gray-300" />
            </div>
            <span className="text-[11px] text-gray-600">Step 2 of 3</span>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 sm:p-6 md:p-8">
          <div className="order-2 md:order-1">
            <h1 className="text-[22px] sm:text-[26px] font-extrabold leading-snug text-gray-900">
              Help us understand how you<br className="hidden sm:block" /> were using Migrate Mate.
            </h1>

            {/* Survey questions */}
            <div className="mt-5">
              <p className="text-[11px] sm:text-xs text-gray-600 mb-2">
                How many roles did you apply for through Migrate Mate?
              </p>
              <div className="grid grid-cols-4 gap-3">
                {['0', '1–5', '6–20', '20+'].map((t) => (
                  <button
                    key={`q1-${t}`}
                    className="rounded-xl border border-gray-300 px-3 py-2 text-[12px] sm:text-sm hover:bg-gray-50 transition text-gray-800"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <p className="text-[11px] sm:text-xs text-gray-600 mb-2">
                How many companies did you email directly?
              </p>
              <div className="grid grid-cols-4 gap-3">
                {['0', '1–5', '6–20', '20+'].map((t) => (
                  <button
                    key={`q2-${t}`}
                    className="rounded-xl border border-gray-300 px-3 py-2 text-[12px] sm:text-sm hover:bg-gray-50 transition text-gray-800"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <p className="text-[11px] sm:text-xs text-gray-600 mb-2">
                How many different companies did you interview with?
              </p>
              <div className="grid grid-cols-4 gap-3">
                {['0', '1–2', '3–5', '5+'].map((t) => (
                  <button
                    key={`q3-${t}`}
                    className="rounded-xl border border-gray-300 px-3 py-2 text-[12px] sm:text-sm hover:bg-gray-50 transition text-gray-800"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Promo + Continue section */}
            <div className="mt-6 space-y-3">
              {showPromo && (
                <div className="mt-4">
                  <Link
                    href="/cancel/downsell_accepted"
                    className="block w-full rounded-xl bg-emerald-500 text-white py-2 text-center text-sm font-semibold shadow-sm hover:brightness-95"
                  >
                    Get $10 off | $15.00 / $19.00
                  </Link>
                </div>
              )}

              <Link
                href="/cancel/reasons"
                className="block w-full rounded-xl bg-gray-200 text-gray-600 py-3 text-sm font-semibold text-center hover:bg-gray-300"
              >
                Continue
              </Link>
            </div>
          </div>

          <div className="order-1 md:order-2 hidden md:block">
            <div className="relative w-full h-[360px] lg:h-[480px]">
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
        </div>
      </div>
    </main>
  );
}