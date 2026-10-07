// Live view of the agent pipeline: renders every `agent_status` step as it arrives.
export default function ThoughtTerminal({ steps, loading }) {
  if (!loading && steps.length === 0) return null;

  return (
    <div className="rounded-lg bg-console p-4 font-mono text-xs leading-6" aria-live="polite">
      {steps.map((s, i) => (
        <p key={i} className="text-slate-400">
          <span className="text-teal-400">&gt; {s.step}</span> {s.message}
        </p>
      ))}
      {loading && <p className="animate-pulse text-teal-300">▍</p>}
    </div>
  );
}
