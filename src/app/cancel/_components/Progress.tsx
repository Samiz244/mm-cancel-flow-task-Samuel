// src/app/cancel/_components/Progress.tsx
'use client';

import { usePathname } from 'next/navigation';

const TOTAL_STEPS = 3 as const;

// tiny class joiner (no clsx)
function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export default function Progress({ compact = false }: { compact?: boolean }) {
  const pathname = usePathname();
  const segs = pathname.split('/').filter(Boolean);
  const deepest = segs[segs.length - 1] || '';

  // Hide on job-status
  if (deepest === 'job-status') return null;

  // Step 1 pages
  if (deepest === 'job-success' || deepest === 'downsell') {
    return <StepBar current={1} compact={compact} />;
  }

  // Step 2 pages
  if (deepest === 'still-looking' || deepest === 'improvement') {
    return <StepBar current={2} compact={compact} />;
  }

  // Step 3 pages
  if (deepest === 'visa' || deepest === 'reasons') {
    return <StepBar current={3} compact={compact} />;
  }

  // Otherwise, hide
  return null;
}

function StepBar({ current, compact }: { current: number; compact?: boolean }) {
  return (
    <div className={cx('flex items-center', compact ? 'gap-3' : 'gap-2')}>
      <div className="flex items-center gap-1">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <span
            key={i}
            className={cx(
              'inline-block h-1.5 w-6 rounded-full',
              i < current ? 'bg-gray-900' : 'bg-gray-300'
            )}
          />
        ))}
      </div>
      <span className={cx(compact ? 'text-[11px]' : 'text-xs', 'text-gray-600')}>
        Step {current} of {TOTAL_STEPS}
      </span>
    </div>
  );
}