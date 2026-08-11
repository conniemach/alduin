const FOCUS_AREAS = [
  "Monitor severe weather",
  "Track geopolitical developments",
  "Manage investigations",
  "Produce intelligence briefings",
  "Coordinate crisis response",
];

/**
 * Same bordered-grid shape as vercel.com/about's "Backed by incredible
 * investors" section — here each cell is just one of the things
 * operators use Alduin to do, no second line.
 */
export function FocusAreaGrid() {
  return (
    <div className="grid grid-cols-1 divide-y divide-white/10 rounded-[20px] border border-white/15 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
      {FOCUS_AREAS.map((area) => (
        <div key={area} className="flex items-center justify-center px-6 py-10 text-center">
          <p className="font-mono text-[18px] leading-[21.6px] tracking-[-0.54px] text-white">
            {area}
          </p>
        </div>
      ))}
    </div>
  );
}
