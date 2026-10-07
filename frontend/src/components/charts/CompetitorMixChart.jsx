import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = { Direct: "#0d7a86", Indirect: "#a6d3d8" };
const THREAT_COLOR = { LOW: "text-signal-dark", MEDIUM: "text-amber-700", HIGH: "text-danger" };

// Donut of direct vs indirect rivals, with the overall threat level in the middle.
export default function CompetitorMixChart({ direct, indirect, threat }) {
  const data = [
    { name: "Direct", value: direct },
    { name: "Indirect", value: indirect },
  ].filter((d) => d.value > 0);

  return (
    <div className="mx-auto w-44 shrink-0 sm:mx-0">
      <div className="relative size-44">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" innerRadius="68%" outerRadius="100%" paddingAngle={2} stroke="none">
              {data.map((d) => <Cell key={d.name} fill={COLORS[d.name]} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        {threat && (
          <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
            <div>
              <p className="font-mono text-[11px] text-muted">threat</p>
              <p className={`text-sm font-bold ${THREAT_COLOR[String(threat).toUpperCase()] ?? ""}`}>{threat}</p>
            </div>
          </div>
        )}
      </div>
      <ul className="mt-3 flex justify-center gap-4 text-xs text-muted">
        {data.map((d) => (
          <li key={d.name} className="flex items-center gap-1.5">
            <span className="size-2 rounded-sm" style={{ background: COLORS[d.name] }} />
            {d.name} {d.value}
          </li>
        ))}
      </ul>
    </div>
  );
}
