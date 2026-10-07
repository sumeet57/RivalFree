import CompetitorMixChart from "../charts/CompetitorMixChart";
import OpportunityChart from "../charts/OpportunityChart";
import Markdown from "../ui/Markdown";
import DataView from "./DataView";

const list = (v) => (Array.isArray(v) ? v : []);

function Section({ title, children }) {
  return (
    <section className="space-y-4">
      <h3 className="text-lg font-bold">{title}</h3>
      {children}
    </section>
  );
}

function Label({ children }) {
  return <p className="font-mono text-xs text-muted">{children}</p>;
}

function CompetitorList({ title, items }) {
  if (items.length === 0) return null;
  return (
    <div>
      <Label>{title} ({items.length})</Label>
      <ul className="mt-1 divide-y divide-line">
        {items.map((c, i) => (
          <li key={i} className="py-3">
            <p className="font-semibold">
              {c.link ? (
                <a href={c.link} target="_blank" rel="noreferrer" className="hover:text-signal hover:underline">{c.name}</a>
              ) : (
                c.name
              )}
            </p>
            <p className="mt-0.5 text-sm text-muted">{c.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Project analysis: { queryPlan?, competitors, voids, roadmap }.
 * Unknown shapes fall back to the generic DataView.
 */
export default function AnalysisView({ data }) {
  if (!data) return null;
  const { queryPlan, competitors, voids, roadmap } = data;
  if (!competitors && !voids && !roadmap) return <DataView data={data} />;

  const direct = list(competitors?.directCompetitors);
  const indirect = list(competitors?.indirectCompetitors);
  const features = list(voids?.missingFeatures);
  const gaps = list(voids?.marketGaps);
  const mvp = list(roadmap?.coreMVPFeatures);
  const chartItems = features
    .filter((f) => typeof f.opportunityScore === "number")
    .map((f) => ({ name: f.feature, score: f.opportunityScore }));
  const roadmapText = [
    ["Positioning", roadmap?.positioningStrategy],
    ["Differentiator", roadmap?.differentiator],
    ["Recommended spec", roadmap?.recommendedSpec],
  ].filter(([, text]) => text);

  return (
    <div className="space-y-12">
      {queryPlan?.query && <p className="break-words font-mono text-xs text-muted">Searched: {queryPlan.query}</p>}

      {competitors && (
        <Section title="Competition">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            {(direct.length > 0 || indirect.length > 0) && (
              <CompetitorMixChart direct={direct.length} indirect={indirect.length} threat={competitors.threatLevel} />
            )}
            {competitors.summary && <Markdown className="max-w-prose text-sm">{competitors.summary}</Markdown>}
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <CompetitorList title="Direct" items={direct} />
            <CompetitorList title="Indirect" items={indirect} />
          </div>
        </Section>
      )}

      {voids && (
        <Section title="Opportunities">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <ul className="divide-y divide-line">
              {features.map((f, i) => (
                <li key={i} className="py-3 first:pt-0">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="font-semibold">{f.feature}</p>
                    {typeof f.opportunityScore === "number" && (
                      <span className="font-mono text-xs text-muted">{f.opportunityScore}/10</span>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm text-muted">{f.painPoint}</p>
                </li>
              ))}
            </ul>
            {chartItems.length > 0 && <OpportunityChart items={chartItems} />}
          </div>
          {gaps.length > 0 && (
            <div>
              <Label>Market gaps</Label>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                {gaps.map((g, i) => <li key={i}>{g}</li>)}
              </ul>
            </div>
          )}
        </Section>
      )}

      {roadmap && (
        <Section title="Roadmap">
          <dl className="space-y-5">
            {roadmapText.map(([label, text]) => (
              <div key={label}>
                <dt><Label>{label}</Label></dt>
                <dd className="mt-1 max-w-prose text-sm"><Markdown>{text}</Markdown></dd>
              </div>
            ))}
          </dl>
          {mvp.length > 0 && (
            <div>
              <Label>Core MVP features</Label>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                {mvp.map((m, i) => <li key={i}>{m}</li>)}
              </ul>
            </div>
          )}
        </Section>
      )}
    </div>
  );
}
