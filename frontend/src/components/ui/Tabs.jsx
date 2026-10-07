export default function Tabs({ tabs, active, onChange }) {
  return (
    <div role="tablist" className="flex gap-6 overflow-x-auto border-b border-line">
      {tabs.map((t) => (
        <button
          key={t.id}
          role="tab"
          aria-selected={active === t.id}
          onClick={() => onChange(t.id)}
          className={`-mb-px whitespace-nowrap border-b-2 pb-3 text-sm font-semibold transition-colors ${
            active === t.id ? "border-signal text-ink" : "border-transparent text-muted hover:text-ink"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
