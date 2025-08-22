// src/app/cancel/reasons/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
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
  return input.replace(/javascript:|data:|vbscript:|on\\w+=/gi, '');
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
  const normalized = input.replace(/\\s+/g, ' ').trim();
  return escapeHtml(removeDangerous(stripTags(normalized)));
}

// Helper: resolve email from query/localStorage/default seed
function resolveEmail(sp: URLSearchParams): string {
  const fromQuery = (sp.get('email') || '').trim().toLowerCase();
  if (fromQuery) return fromQuery;
  if (typeof window !== 'undefined') {
    const ls = (localStorage.getItem('mm_active_email') || '').trim().toLowerCase();
    if (ls) return ls;
  }
  return 'user1@example.com'; // fallback to seed user
}

export default function ReasonsPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const showPromo = useMemo(() => sp.get('offer') === 'downsell', [sp]);

  const [reason, setReason] = useState<ReasonKey | null>(null);
  const [text, setText] = useState('');
  const [csrf, setCsrf] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [acceptingPromo, setAcceptingPromo] = useState(false);

  useEffect(() => {
    const key = 'mm_csrf_token';
    let tok = sessionStorage.getItem(key);
    if (!tok) {
      tok = crypto.randomUUID();
      sessionStorage.setItem(key, tok);
    }
    setCsrf(tok);
  }, []);

  const requiresText = useMemo(
    () =>
      reason === 'platform_not_helpful' ||
      reason === 'not_enough_relevant' ||
      reason === 'decided_not_to_move' ||
      reason === 'other',
    [reason]
  );

  const trimmed = text.trim();
  const hasAlnum = /[A-Za-z0-9]/.test(trimmed);

  let textValid = true;
  if (reason === 'too_expensive') {
    const value = Number(trimmed);
    textValid = Number.isFinite(value) && value > 0;
  } else if (requiresText) {
    textValid = trimmed.length >= 25 && hasAlnum;
  }
  const formValid = !!reason && textValid;

  // ✅ Promo flow still includes email
  const handleAcceptPromo = async () => {
    const email = resolveEmail(sp as any);
    try {
      setAcceptingPromo(true);
      const res = await fetch('/api/accept', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json?.ok === false) {
        console.warn(json?.error || 'Could not apply discount.');
      }
    } catch (e: any) {
      console.warn(e?.message || e);
    } finally {
      setAcceptingPromo(false);
    }
    router.push(`/cancel/downsell_accepted?email=${encodeURIComponent(email)}`);
  };

  const handleComplete = async () => {
    if (!formValid || !reason || submitting) return;

    try {
      setSubmitting(true);

      const safeText = sanitize(trimmed);
      const email = resolveEmail(sp as any);

      // Build "details" to persist with reason (optional)
      let details: string | undefined;
      if (reason === 'too_expensive') {
        details = trimmed;
      } else if (requiresText) {
        details = safeText;
      }

      const res = await fetch('/api/reason', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          email,
          reason,
          details: details ?? null,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json?.ok) {
        console.error(json);
        alert(json?.error || 'Failed to record reason');
        setSubmitting(false);
        return;
      }

      // ✅ include email when routing to cancellation
      const params = new URLSearchParams({
        r: reason ?? '',
        t: details ? String(details) : '',
        csrf,
        email, // 👈 new addition
      });

      router.push(`/cancel/cancellation?${params.toString()}`);
    } catch (e: any) {
      console.error(e);
      alert(String(e?.message ?? e));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
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
            min={1}
            step={1}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter amount"
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
          <button
            type="button"
            onClick={handleAcceptPromo}
            disabled={acceptingPromo}
            className="block w-full rounded-xl bg-emerald-500 text-white py-3 text-sm font-semibold text-center shadow-sm hover:brightness-95 disabled:opacity-50"
          >
            {acceptingPromo ? 'Applying…' : 'Get $10 off'}
          </button>
        )}

        <button
          type="button"
          disabled={!formValid || submitting}
          className={`w-full rounded-xl py-3 text-sm font-semibold text-center ${
            formValid && !submitting
              ? 'bg-gray-900 text-white hover:bg-black'
              : 'bg-gray-100 text-gray-500 cursor-not-allowed'
          }`}
          onClick={handleComplete}
        >
          {submitting ? 'Saving…' : 'Complete cancellation'}
        </button>
      </div>
    </div>
  );
}