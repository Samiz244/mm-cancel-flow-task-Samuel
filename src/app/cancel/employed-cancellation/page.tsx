// src/app/cancel/employed-cancellation/page.tsx
'use client';

import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';

export default function EmployedCancellationPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const hasLawyer = (sp.get('hasLawyer') || '').toLowerCase() === 'yes';

  const title = hasLawyer
    ? "All done, your cancellation’s been processed."
    : "Your cancellation’s all sorted, mate, no more charges.";

  const body = hasLawyer ? (
    <p className="text-sm text-gray-700">
      We’re stoked to hear you’ve landed a job and sorted your visa. Big congrats from the team. 🙌
    </p>
  ) : (
    <div className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white/70 p-3">
      {/* Small profile image stays (part of left content) */}
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
          I’ll be reaching out soon to help with the visa side of things. We’ve got your back —
          whether it’s questions, paperwork, or just figuring out your options. Keep an eye on your
          inbox — I’ll be in touch shortly.
        </p>
      </div>
    </div>
  );

  // Layout provides header, completed bar, and right-side Empire State image
  return (
    <div>
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
  );
}