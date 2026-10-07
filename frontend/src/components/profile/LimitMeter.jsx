// One plan limit as a row. Shows a usage bar when `used` is known.
export default function LimitMeter({ label, used, limit, hint }) {
  const known = typeof used === "number" && typeof limit === "number";
  const pct = known ? Math.min(100, Math.round((used / limit) * 100)) : 0;

  return (
    <div className="px-5 py-4">
      <div className="flex items-baseline justify-between gap-4">
        <p className="font-semibold">{label}</p>
        <p className="font-mono text-sm">{known ? `${used} / ${limit}` : limit != null ? `${limit} included` : "-"}</p>
      </div>
      {known && (
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-paper" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
          <div className={`h-full rounded-full ${used >= limit ? "bg-danger" : "bg-signal"}`} style={{ width: `${pct}%` }} />
        </div>
      )}
      <p className="mt-2 text-xs text-muted">{hint}</p>
    </div>
  );
}
