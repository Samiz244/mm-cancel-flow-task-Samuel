// src/app/cancel/layout.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Progress from './_components/Progress';

export default function CancelLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  // Completed pages: change header + show "Completed", hide back
  const isCompleted =
    pathname === '/cancel/cancellation' || pathname === '/cancel/employed-cancellation';

  // Special title for downsell_accepted
  const isDownsellAccepted = pathname === '/cancel/downsell_accepted';

  const title = isCompleted
    ? 'Subscription Cancelled'
    : isDownsellAccepted
    ? 'Subscription'
    : 'Subscription Cancellation';

  const hideBackButton = isCompleted || isDownsellAccepted;

  // --- keep the image height matched to left content ---
  const leftRef = useRef<HTMLDivElement | null>(null);
  const [imageHeight, setImageHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (!leftRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const h = Math.ceil(entry.contentRect.height);
        setImageHeight(h > 0 ? h : undefined);
      }
    });
    ro.observe(leftRef.current);
    const onResize = () => {
      if (leftRef.current) {
        const h = Math.ceil(leftRef.current.getBoundingClientRect().height);
        setImageHeight(h > 0 ? h : undefined);
      }
    };
    window.addEventListener('resize', onResize);
    onResize();
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#bfbfbf]/35 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl rounded-2xl bg-white shadow-xl ring-1 ring-black/5 overflow-hidden">
        {/* Header */}
        <div className="relative border-b px-4 sm:px-6 py-3 sm:py-4">
          {!hideBackButton && (
            <button
              type="button"
              onClick={() => router.back()}
              className="absolute left-3 top-3 sm:left-4 sm:top-3 flex items-center gap-1.5 text-xs sm:text-sm text-gray-600 hover:text-gray-800"
              aria-label="Go back"
            >
              <span aria-hidden>‹</span> Back
            </button>
          )}

          <div className="flex flex-col items-center justify-center">
            <h2 className="text-[12px] sm:text-sm font-medium text-gray-800">{title}</h2>

            <div className="mt-1">
              {isCompleted ? (
                <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <span className="inline-block h-1.5 w-6 rounded-full bg-emerald-600" />
                    <span className="inline-block h-1.5 w-6 rounded-full bg-emerald-600" />
                    <span className="inline-block h-1.5 w-6 rounded-full bg-emerald-600" />
                  </div>
                  <span className="ml-2">Completed</span>
                </div>
              ) : (
                <Progress />
              )}
            </div>
          </div>

          <Link
            href="/"
            aria-label="Close and return to start"
            className="absolute right-3 top-2.5 sm:right-4 sm:top-3 rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            ✕
          </Link>
        </div>

        {/* 2-col content with right image that matches left height */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 sm:p-6 md:p-8 items-start">
          <div ref={leftRef} className="order-2 md:order-1">
            {children}
          </div>

          <div className="order-1 md:order-2 hidden md:block">
            <div
              className="relative w-full rounded-xl overflow-hidden shadow-sm"
              style={imageHeight ? { height: imageHeight } : { minHeight: 220 }}
            >
              <Image
                src="/images/empire-state-compressed.jpg"
                alt="City skyline"
                fill
                sizes="(min-width: 1024px) 40vw, (min-width: 768px) 50vw, 100vw"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}