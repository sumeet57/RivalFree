import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useMediaQuery } from "../../hooks/useMediaQuery";

const shorten = (text, max) => (text.length > max ? `${text.slice(0, max - 1)}…` : text);

// Horizontal bars: opportunity score (0-10) per missing feature.
// items: [{ name, score }]
export default function OpportunityChart({ items }) {
  const compact = useMediaQuery("(max-width: 639px)");
  const height = Math.max(200, items.length * 48 + 40);

  return (
    <div className="w-full" style={{ height }} role="img" aria-label="Opportunity score for each missing feature">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={items} layout="vertical" margin={{ left: 0, right: 12 }}>
          <XAxis type="number" domain={[0, 10]} tick={{ fontSize: 11, fill: "#5d7078" }} axisLine={false} tickLine={false} />
          <YAxis
            type="category"
            dataKey="name"
            width={compact ? 88 : 140}
            tickFormatter={(v) => shorten(v, compact ? 13 : 22)}
            tick={{ fontSize: compact ? 11 : 12, fill: "#14262d" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip cursor={{ fill: "#f2f5f6" }} formatter={(v) => [`${v} / 10`, "Opportunity"]} />
          <Bar dataKey="score" fill="#0d7a86" radius={[0, 4, 4, 0]} barSize={18} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
