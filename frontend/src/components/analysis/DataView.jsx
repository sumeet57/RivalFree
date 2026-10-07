// Fallback renderer for analysis shapes we have no dedicated view for.
const HIDDEN = new Set(["_id", "__v", "hash", "createdAt", "updatedAt"]);

const titleCase = (key) =>
  key.replace(/([A-Z])/g, " $1").replace(/[_-]/g, " ").replace(/^./, (c) => c.toUpperCase());

function Node({ value }) {
  if (value === null || value === undefined || value === "") return null;

  if (Array.isArray(value)) {
    return (
      <ul className="divide-y divide-line">
        {value.map((item, i) => (
          <li key={i} className="py-2"><Node value={item} /></li>
        ))}
      </ul>
    );
  }

  if (typeof value === "object") {
    return (
      <dl className="space-y-2">
        {Object.entries(value)
          .filter(([k]) => !HIDDEN.has(k))
          .map(([k, v]) => (
            <div key={k}>
              <dt className="font-mono text-xs text-muted">{titleCase(k)}</dt>
              <dd className="text-sm"><Node value={v} /></dd>
            </div>
          ))}
      </dl>
    );
  }

  return <span className="text-sm">{String(value)}</span>;
}

export default function DataView({ data }) {
  if (!data) return null;
  return (
    <div className="space-y-8">
      {Object.entries(data)
        .filter(([k]) => !HIDDEN.has(k))
        .map(([key, value]) => (
          <section key={key}>
            <h3 className="mb-3 text-lg font-bold">{titleCase(key)}</h3>
            <Node value={value} />
          </section>
        ))}
    </div>
  );
}
