// src/app/cancel/visa/page.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

type LawyerChoice = 'yes' | 'no' | null;

export default function VisaPage() {
  const router = useRouter();
  const sp = useSearchParams();

  // Pick the email to use (override via ?email=... in the URL)
  const EMAIL_TO_USE = useMemo(() => {
    const q = (sp.get('email') || '').trim();
    return q || 'dave@example.com';
  }, [sp]);

  // Fallback signal from URL (used only if DB read fails)
  const urlFoundWithMM =
    (sp.get('foundWithMM') || '').trim().toLowerCase() === 'yes';

  // Header will be based on DB value:
  const [employedThroughMM, setEmployedThroughMM] = useState<boolean | null>(null);
  const [loadingMMStatus, setLoadingMMStatus] = useState(true);

  // Lawyer + visa inputs
  const [hasLawyer, setHasLawyer] = useState<LawyerChoice>(null);

  // Visa selector state
  const VISA_OPTIONS = [
    'H-1B',
    'O-1',
    'TN',
    'E-3',
    'L-1',
    'F-1 OPT',
    'J-1',
    'E-2',
    'Green Card',
  ] as const;

  const [visaType, setVisaType] = useState<string>(''); // holds selected option or 'OTHER'
  const [customVisa, setCustomVisa] = useState<string>(''); // only when OTHER

  // (Optional) light profile fetch so you can show “User: …”
  const [profile, setProfile] = useState<{ id?: string; email?: string } | null>(null);
  const [profileErr, setProfileErr] = useState<string | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Match reasons/page.tsx UX
  const [submitting, setSubmitting] = useState(false);

  // Load employed_through_mm from migrate_mate_status
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoadingMMStatus(true);
      try {
        const res = await fetch(
          `/api/migrate_mate_status?email=${encodeURIComponent(EMAIL_TO_USE)}`,
          { cache: 'no-store' }
        );
        const json = await res.json().catch(() => ({}));
        if (!alive) return;

        if (res.ok && json?.ok && typeof json?.employed_through_mm === 'boolean') {
          setEmployedThroughMM(Boolean(json.employed_through_mm));
        } else {
          setEmployedThroughMM(urlFoundWithMM);
        }
      } catch {
        if (alive) setEmployedThroughMM(urlFoundWithMM);
      } finally {
        if (alive) setLoadingMMStatus(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [EMAIL_TO_USE, urlFoundWithMM]);

  // Load profile (optional helper line)
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoadingProfile(true);
      setProfileErr(null);
      try {
        const res = await fetch(`/api/profile?email=${encodeURIComponent(EMAIL_TO_USE)}`, {
          cache: 'no-store',
        });
        const json = await res.json();
        if (!res.ok || !json?.ok) throw new Error(json?.error || 'Profile load failed');
        if (alive) setProfile({ id: json.id, email: json.email });
      } catch (e: any) {
        if (alive) setProfileErr(e?.message ?? String(e));
      } finally {
        if (alive) setLoadingProfile(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [EMAIL_TO_USE]);

  const formValid = !!hasLawyer;
  const disabled = !formValid || submitting;

  // On click: update user_status (has_immigration_lawyer, future_visa_applying_for)
  // then set subscription -> pending_cancellation, then navigate
  const onComplete = async () => {
    if (!formValid || submitting) return;
    setSubmitting(true);
    try {
      // resolve final visa string (dropdown or "Other" text)
      const finalVisa =
        visaType === 'OTHER'
          ? (customVisa.trim() || null)
          : (visaType || null);

      // 1) Update user_status
      try {
        const resUS = await fetch('/api/user_status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: EMAIL_TO_USE,
            has_immigration_lawyer: hasLawyer === 'yes',
            future_visa_applying_for: finalVisa,
          }),
        });
        const jUS = await resUS.json().catch(() => ({}));
        if (!resUS.ok || jUS?.ok === false) {
          console.warn('user_status update failed:', jUS?.error || resUS.status);
        }
      } catch (e) {
        console.warn('user_status update error:', e);
      }

      // 2) Set subscription -> pending_cancellation
      const res = await fetch('/api/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: EMAIL_TO_USE }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.ok === false) {
        throw new Error(data?.error || 'Failed to set pending_cancellation');
      }

      // 3) Go next
      const url = `/cancel/employed-cancellation?hasLawyer=${hasLawyer}${
        finalVisa ? `&visaType=${encodeURIComponent(finalVisa)}` : ''
      }&email=${encodeURIComponent(EMAIL_TO_USE)}`;
      router.push(url);
    } catch (err: any) {
      alert(`Error: ${err.message || String(err)}`);
    } finally {
      setSubmitting(false);
    }
  };

  const headerShowsFoundWithMM = employedThroughMM === true; // only true means show the MM header

  return (
    <div>
      {headerShowsFoundWithMM ? (
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

      {/* Lawyer choice */}
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

      {/* Visa selector (shown only after choosing lawyer) */}
      {hasLawyer && (
        <div className="mt-4">
          <label className="block text-xs text-gray-600 mb-2">
            {hasLawyer === 'yes'
              ? 'What visa will you be applying for?'
              : 'We can connect you with a partner. Which visa would you like to apply for?'}
          </label>

          <select
            value={VISA_OPTIONS.includes(visaType as any) ? visaType : (visaType ? 'OTHER' : '')}
            onChange={(e) => {
              const v = e.target.value;
              if (v === 'OTHER') {
                setVisaType('OTHER');
              } else {
                setVisaType(v);
                setCustomVisa('');
              }
            }}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200 bg-white"
          >
            <option value="">Select a visa type</option>
            {VISA_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
            <option value="OTHER">Other</option>
          </select>

          {visaType === 'OTHER' && (
            <div className="mt-2">
              <input
                type="text"
                placeholder="Type your visa (e.g., H-1B Cap-Exempt)"
                value={customVisa}
                onChange={(e) => setCustomVisa(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200"
              />
              <p className="mt-1 text-[11px] text-gray-500">If you don’t see it in the list, add it here.</p>
            </div>
          )}
        </div>
      )}

      {/* Profile status helper (optional to keep) */}
      <div className="mt-4 text-xs">
        {(loadingProfile || loadingMMStatus) && (
          <span className="text-gray-500">Loading your profile…</span>
        )}
        {profileErr && <span className="text-red-600">Profile error: “{profileErr}”</span>}
        {!loadingProfile && profile?.email && (
          <span className="text-gray-500">User: {profile.email}</span>
        )}
      </div>

      {/* CTA */}
      <div className="mt-6">
        <button
          type="button"
          disabled={disabled}
          onClick={onComplete}
          className={`w-full rounded-xl py-3 text-sm font-semibold text-center ${
            !disabled
              ? 'bg-gray-900 text-white hover:bg-black'
              : 'bg-gray-100 text-gray-500 cursor-not-allowed'
          }`}
        >
          {submitting ? 'Saving…' : 'Complete cancellation'}
        </button>
      </div>
    </div>
  );
}