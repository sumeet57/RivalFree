// Friendly progress view for the agent pipeline. The backend's `agent_status`
// steps are mapped to plain-language stages instead of showing raw messages.
const PIPELINE = [
  { id: "CACHE_CHECK", label: "Checking saved results", hint: "Looking for an earlier analysis of the same idea." },
  { id: "QUERY_PLANNING", label: "Planning the search", hint: "Turning your idea into one precise query." },
  { id: "LIVE_SEARCH", label: "Scanning the live web", hint: "Pulling in today's competitors and pricing." },
  { id: "PARALLEL_SYNTHESIS", label: "Analyzing the market", hint: "Mapping rivals and finding gaps at the same time." },
  { id: "SAVING_RESULTS", label: "Writing your roadmap", hint: "Drafting the roadmap and saving everything." },
];

function Indicator({ state }) {
  if (state === "done") {
    return (
      <span className="grid size-5 shrink-0 place-items-center rounded-full bg-signal text-white">
        <svg viewBox="0 0 16 16" className="size-3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 8.5l3.2 3L13 4.5" />
        </svg>
      </span>
    );
  }
  if (state === "active") {
    return <span className="size-5 shrink-0 animate-spin rounded-full border-2 border-signal border-t-transparent motion-reduce:animate-none" />;
  }
  return <span className="size-5 shrink-0 rounded-full border-2 border-line" />;
}

export default function AnalysisProgress({ title, steps, footnote }) {
  const reached = steps.map((s) => PIPELINE.findIndex((p) => p.id === s.step)).filter((i) => i >= 0);
  const current = reached.length ? Math.max(...reached) : 0;
  const percent = Math.round(((current + 0.5) / PIPELINE.length) * 100);

  return (
    <div className="rounded-lg border border-line bg-surface p-5" role="status" aria-live="polite">
      <p className="font-bold">{title}</p>
      {footnote && <p className="mt-1 text-sm text-muted">{footnote}</p>}

      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-paper">
        <div className="h-full rounded-full bg-signal transition-all duration-700" style={{ width: `${percent}%` }} />
      </div>

      <ol className="mt-5 space-y-4">
        {PIPELINE.map((p, i) => {
          const state = i < current ? "done" : i === current ? "active" : "pending";
          return (
            <li key={p.id} className="flex gap-3">
              <Indicator state={state} />
              <div className="min-w-0">
                <p className={`text-sm font-semibold ${state === "pending" ? "text-muted" : ""}`}>{p.label}</p>
                {state === "active" && <p className="mt-0.5 text-xs text-muted">{p.hint}</p>}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
