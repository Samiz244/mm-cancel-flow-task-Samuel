// src/app/cancel/downsell_accepted/page.tsx
export default function DownsellAcceptedPage() {
  return (
    <div className="flex flex-col items-start space-y-4">
      {/* TEXT CONTENT */}
      <h1 className="text-[22px] sm:text-[26px] font-extrabold text-gray-900">
        Great choice, mate!
      </h1>

      <p className="text-[14px] sm:text-[16px] text-gray-800 font-semibold">
        You’re still on the path to your dream role.{" "}
        <span className="text-[#7b40fc]">Let’s make it happen together!</span>
      </p>

      <div className="space-y-1 text-[12px] sm:text-sm text-gray-600">
        <p>
          You’ve got <span className="font-medium">XX days</span> left on your current plan.
        </p>
        <p>
          Starting from <span className="font-medium">XX date</span>, your monthly payment will be{" "}
          <span className="font-semibold text-gray-900">$15.00</span>{" "}
          <span className="text-gray-400">($29 plan would be $19.00)</span>.
        </p>
        <p className="italic text-gray-500">You can cancel anytime before then.</p>
      </div>

      <button
        type="button"
        className="w-full rounded-xl bg-[#8952fc] text-white py-3 text-sm font-semibold shadow-sm hover:bg-[#7b40fc]"
      >
        Land your dream role
      </button>
    </div>
  );
}