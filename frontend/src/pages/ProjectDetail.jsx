import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { getProjectById } from "../api/project.api";
import { getFeaturesByProject } from "../api/feature.api";
import { ANALYSIS_EVENTS } from "../config/events";
import { useSocketTask } from "../hooks/useSocketTask";
import { latestAnalysis } from "../utils/analysis";
import AnalysisForm from "../components/analysis/AnalysisForm";
import AnalysisProgress from "../components/analysis/AnalysisProgress";
import AnalysisView from "../components/analysis/AnalysisView";
import DiscussionTab from "../components/analysis/DiscussionTab";
import Button from "../components/ui/Button";
import ErrorText from "../components/ui/ErrorText";
import PageLoader from "../components/ui/PageLoader";
import Tabs from "../components/ui/Tabs";

const TABS = [
  { id: "analysis", label: "Analysis" },
  { id: "features", label: "Features" },
  { id: "discussion", label: "Discussion" },
];

const FEATURE_PLACEHOLDERS = {
  name: "e.g. Real-time availability calendar",
  about: "What the feature does and the problem it solves",
};

export default function ProjectDetail() {
  const { projectId } = useParams();
  const location = useLocation();

  const [project, setProject] = useState(null);
  const [features, setFeatures] = useState([]);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("analysis");
  const [thread, setThread] = useState("project"); // which conversation is open
  const [openFeature, setOpenFeature] = useState(null); // feature whose analysis is shown
  const [freshAnalyses, setFreshAnalyses] = useState({}); // featureId -> analysis from this session
  const [runningName, setRunningName] = useState("");
  const chatStore = useRef({}); // this session's messages per thread
  const resultRef = useRef(null);

  useEffect(() => {
    Promise.allSettled([getProjectById(projectId), getFeaturesByProject(projectId)]).then(
      ([projectRes, featuresRes]) => {
        if (projectRes.status === "fulfilled") {
          setProject(projectRes.value);
        } else {
          setError(projectRes.reason?.message || "Failed to load project details");
        }
        setFeatures(featuresRes.status === "fulfilled" && Array.isArray(featuresRes.value) ? featuresRes.value : []);
      }
    );
  }, [projectId]);

  const featureTask = useSocketTask(ANALYSIS_EVENTS.feature, ({ feature, analysis }) => {
    setFeatures((list) => [...list, feature]);
    setFreshAnalyses((m) => ({ ...m, [feature._id]: analysis }));
    setOpenFeature(feature._id);
  });

  // Bring a freshly opened analysis into view
  useEffect(() => {
    if (openFeature) resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [openFeature]);

  const startFeature = (data) => {
    setRunningName(data.name);
    featureTask.run({ projectId, ...data });
  };

  const discuss = (featureId) => {
    setThread(featureId);
    setTab("discussion");
  };

  if (error) return <ErrorText>{error}</ErrorText>;
  if (!project) return <PageLoader />;

  // Fresh result right after a scan, otherwise the newest saved run
  const projectAnalysis = location.state?.analysis ?? latestAnalysis(project.history);
  const selected = features.find((f) => f._id === openFeature);
  const selectedAnalysis = selected && (freshAnalyses[selected._id] ?? latestAnalysis(selected.history));

  return (
    <div className="space-y-8">
      <header>
        <Link to="/app" className="text-sm font-semibold text-muted hover:text-ink">Back to projects</Link>
        <h1 className="mt-3 break-words text-2xl font-bold tracking-tight">{project.name}</h1>
        <p className="mt-1 max-w-2xl text-muted">{project.about}</p>
        {project.link && (
          <a href={project.link} target="_blank" rel="noreferrer" className="mt-2 inline-block break-all font-mono text-xs text-signal-dark underline underline-offset-2">
            {project.link}
          </a>
        )}
        {project.summary && <p className="mt-5 max-w-3xl border-l-2 border-signal pl-4">{project.summary}</p>}
      </header>

      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      {tab === "analysis" &&
        (projectAnalysis ? (
          <AnalysisView data={projectAnalysis} />
        ) : (
          <p className="rounded-lg border border-dashed border-line p-8 text-sm text-muted">No analysis saved for this project yet.</p>
        ))}

      {tab === "features" && (
        <div className="space-y-10">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-5">
            <div className="order-2 md:order-1 md:col-span-3">
              {features.length === 0 ? (
                <p className="rounded-lg border border-dashed border-line p-8 text-sm text-muted">
                  No features yet. Describe a feature idea to check whether the space is open.
                </p>
              ) : (
                <ul className="divide-y divide-line rounded-lg border border-line bg-surface">
                  {features.map((f) => (
                    <li
                      key={f._id}
                      className={`flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5 ${f._id === openFeature ? "bg-paper" : ""}`}
                    >
                      <div className="min-w-0">
                        <p className="font-semibold">{f.name}</p>
                        {(f.summary || f.about) && <p className="mt-0.5 line-clamp-2 text-sm text-muted">{f.summary || f.about}</p>}
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <Button variant="secondary" onClick={() => setOpenFeature(f._id)}>Analysis</Button>
                        <Button variant="ghost" onClick={() => discuss(f._id)}>Discuss</Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="order-1 space-y-4 md:order-2 md:col-span-2">
              <h2 className="text-lg font-bold">Analyze a feature</h2>

              {featureTask.loading && (
                <AnalysisProgress
                  title={`Analyzing “${runningName}”`}
                  steps={featureTask.steps}
                  footnote="The analysis will appear on this page when it's ready."
                />
              )}

              <div className={featureTask.loading ? "hidden" : "space-y-4"}>
                <div className="rounded-lg border border-line bg-surface p-4 sm:p-5">
                  <AnalysisForm
                    submitLabel="Find the gap"
                    placeholders={FEATURE_PLACEHOLDERS}
                    loading={featureTask.loading}
                    onSubmit={startFeature}
                  />
                </div>
                <ErrorText>{featureTask.error}</ErrorText>
              </div>
            </div>
          </div>

          {selected && (
            <section ref={resultRef} className="scroll-mt-24 space-y-4">
              <h2 className="break-words text-lg font-bold">{selected.name}</h2>
              {selectedAnalysis ? (
                <AnalysisView data={selectedAnalysis} />
              ) : (
                <p className="text-sm text-muted">No analysis saved for this feature.</p>
              )}
            </section>
          )}
        </div>
      )}

      {tab === "discussion" && (
        <DiscussionTab project={project} features={features} thread={thread} onThreadChange={setThread} store={chatStore} />
      )}
    </div>
  );
}
