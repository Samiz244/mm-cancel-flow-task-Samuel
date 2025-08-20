// src/app/cancel/reasons/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

type ReasonKey =
  | 'too_expensive'
  | 'platform_not_helpful'
  | 'not_enough_relevant'
  | 'decided_not_to_move'
  | 'other';

// --- Simple sanitizers for XSS hardening ---
function stripTags(input: string) {
  return input.replace(/<\/?[^>]+(>|$)/g, '');
}
function removeDangerous(input: string) {
  return input.replace(/javascript:|data:|vbscript:|on\w+=/gi, '');
}
function escapeHtml(input: string) {
  return input
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
function sanitize(input: string) {
  const normalized = input.replace(/\s+/g, ' ').trim();
  return escapeHtml(removeDangerous(stripTags(normalized)));
}

export default function ReasonsPage() {
  const router = useRouter();
  const sp = useSearchParams();

  // Only show promo if we came from downsell
  const showPromo = useMemo(() => sp.get('offer') === 'downsell', [sp]);

  const [reason, setReason] = useState<ReasonKey | null>(null);
  const [text, setText] = useState('');
  const [csrf, setCsrf] = useState<string>('');

  // Initialize CSRF-style token
  useEffect(() => {
    const key = 'mm_csrf_token';
    let tok = sessionStorage.getItem(key);
    if (!tok) {
      tok = crypto.randomUUID();
      sessionStorage.setItem(key, tok);
    }
    setCsrf(tok);
  }, []);

  // Which reasons require text
  const requiresText = useMemo(
    () =>
      reason === 'platform_not_helpful' ||
      reason === 'not_enough_relevant' ||
      reason === 'decided_not_to_move' ||
      reason === 'other',
    [reason]
  );

  // Validation
  const trimmed = text.trim();
  const hasAlnum = /[A-Za-z0-9]/.test(trimmed);

  let textValid = true;
  if (reason === 'too_expensive') {
    textValid = /^\d+(\.\d{1,2})?$/.test(trimmed) && parseFloat(trimmed) > 0;
  } else if (requiresText) {
    textValid = trimmed.length >= 25 && hasAlnum;
  }

  const formValid = !!reason && textValid;

  const handleComplete = () => {
    if (!formValid) return;

    const safeText = sanitize(trimmed);

    const params = new URLSearchParams({
      r: reason ?? '',
      t: safeText,
      csrf,
    });

    router.push(`/cancel/cancellation?${params.toString()}`);
  };

  return (
    <main className="min-h-screen bg-[#bfbfbf]/35 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl rounded-2xl bg-white shadow-xl ring-1 ring-black/5 overflow-hidden">
        {/* Header */}
        <div className="relative border-b px-4 sm:px-6 py-3 sm:py-4">
          <span
            onClick={() => router.back()}
            className="absolute left-3 top-3 sm:left-4 sm:top-3 text-xs sm:text-sm text-gray-600 cursor-pointer"
          >
            ‹ Back
          </span>

          <div className="flex items-center justify-center">
            <h2 className="text-[12px] sm:text-sm font-medium text-gray-800">
              Subscription Cancellation
            </h2>
          </div>

          {/* Progress (desktop) */}
          <div className="hidden md:flex items-center gap-2 absolute right-14 top-3 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <span className="inline-block h-1.5 w-6 rounded-full bg-gray-900" />
              <span className="inline-block h-1.5 w-6 rounded-full bg-gray-900" />
              <span className="inline-block h-1.5 w-6 rounded-full bg-gray-900" />
            </div>
            <span className="ml-2">Step 3 of 3</span>
          </div>

          <span
            onClick={() => router.push('/')}
            className="absolute right-3 top-2.5 sm:right-4 sm:top-3 rounded p-2 text-gray-500 cursor-pointer"
          >
            ✕
          </span>

          {/* Progress (mobile) */}
          <div className="mt-2 flex items-center justify-center gap-3 md:hidden">
            <div className="flex items-center gap-1">
              <span className="inline-block h-1.5 w-6 rounded-full bg-gray-900" />
              <span className="inline-block h-1.5 w-6 rounded-full bg-gray-900" />
              <span className="inline-block h-1.5 w-6 rounded-full bg-gray-900" />
            </div>
            <span className="text-[11px] text-gray-600">Step 3 of 3</span>
          </div>
        </div>

        {/* CONTENT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 sm:p-6 md:p-8 items-center">
          {/* LEFT: form */}
          <div className="order-2 md:order-1">
            <h1 className="text-[22px] sm:text-[26px] font-extrabold leading-snug text-gray-900">
              What’s the main reason for cancelling?
            </h1>
            <p className="mt-2 text-[12px] sm:text-sm text-gray-600">
              Please take a minute to let us know why:
            </p>

            {/* Reasons */}
            <div className="mt-4 space-y-3">
              {(
                [
                  { key: 'too_expensive', label: 'Too expensive' },
                  { key: 'platform_not_helpful', label: 'Platform not helpful' },
                  { key: 'not_enough_relevant', label: 'Not enough relevant jobs' },
                  { key: 'decided_not_to_move', label: 'Decided not to move' },
                  { key: 'other', label: 'Other' },
                ] as { key: ReasonKey; label: string }[]
              ).map(({ key, label }) => (
                <label key={key} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="reason"
                    className="h-4 w-4"
                    checked={reason === key}
                    onChange={() => setReason(key)}
                  />
                  <span className="text-sm text-gray-800">{label}</span>
                </label>
              ))}
            </div>

            {/* Conditional inputs */}
            {reason === 'too_expensive' && (
              <div className="mt-4">
                <label className="block text-xs text-gray-600 mb-2">
                  What would be the maximum you’d be willing to pay?
                </label>
                <input
                  type="number"
                  placeholder="$"
                  inputMode="decimal"
                  min={1}
                  max={100000}
                  step="0.01"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                {!textValid && (
                  <p className="mt-1 text-[11px] text-red-500">
                    Please enter a valid positive number.
                  </p>
                )}
              </div>
            )}

            {reason === 'platform_not_helpful' && (
              <div className="mt-4">
                <label className="block text-xs text-gray-600 mb-2">
                  What can we change to make the platform more helpful?
                </label>
                <textarea
                  rows={4}
                  maxLength={2000}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                {!textValid && (
                  <p className="mt-1 text-[11px] text-red-500">
                    Please provide at least 25 characters with some real details.
                  </p>
                )}
              </div>
            )}

            {reason === 'not_enough_relevant' && (
              <div className="mt-4">
                <label className="block text-xs text-gray-600 mb-2">
                  In which way can we make the jobs more relevant?
                </label>
                <textarea
                  rows={4}
                  maxLength={2000}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                {!textValid && (
                  <p className="mt-1 text-[11px] text-red-500">
                    Please provide at least 25 characters with some real details.
                  </p>
                )}
              </div>
            )}

            {reason === 'decided_not_to_move' && (
              <div className="mt-4">
                <label className="block text-xs text-gray-600 mb-2">
                  What changed for you to decide to not move?
                </label>
                <textarea
                  rows={4}
                  maxLength={2000}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                {!textValid && (
                  <p className="mt-1 text-[11px] text-red-500">
                    Please provide at least 25 characters with some real details.
                  </p>
                )}
              </div>
            )}

            {reason === 'other' && (
              <div className="mt-4">
                <label className="block text-xs text-gray-600 mb-2">
                  What would have helped you the most?
                </label>
                <textarea
                  rows={4}
                  maxLength={2000}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                {!textValid && (
                  <p className="mt-1 text-[11px] text-red-500">
                    Please provide at least 25 characters with some real details.
                  </p>
                )}
              </div>
            )}

            {/* CTA row */}
            <div className="mt-6 space-y-3">
              {showPromo && (
                <Link
                  href="/cancel/downsell_accepted"
                  className="block w-full rounded-xl bg-emerald-500 text-white py-3 text-sm font-semibold text-center shadow-sm hover:brightness-95"
                >
                  Get $10 off | $15.00 / $19.00
                </Link>
              )}

              <button
                type="button"
                disabled={!formValid}
                className={`w-full rounded-xl py-3 text-sm font-semibold text-center ${
                  formValid
                    ? 'bg-gray-900 text-white hover:bg-black'
                    : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                }`}
                onClick={handleComplete}
              >
                Complete cancellation
              </button>
            </div>
          </div>

          {/* RIGHT: image */}
          <div className="order-1 md:order-2 hidden md:block">
            <div className="relative w-full h-[360px] lg:h-[480px]">
              <Image
                src="/images/empire-state-compressed.jpg"
                alt="City View"
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