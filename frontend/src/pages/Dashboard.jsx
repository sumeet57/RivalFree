import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getProjects } from "../api/project.api";
import { ANALYSIS_EVENTS } from "../config/events";
import { useSocketTask } from "../hooks/useSocketTask";
import { formatDate } from "../utils/format";
import AnalysisForm from "../components/analysis/AnalysisForm";
import AnalysisProgress from "../components/analysis/AnalysisProgress";
import ErrorText from "../components/ui/ErrorText";
import LimitNotice from "../components/ui/LimitNotice";
import PageLoader from "../components/ui/PageLoader";

const PLACEHOLDERS = {
  name: "e.g. Waffy",
  about: "What it does, who it's for and how it makes money",
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [projects, setProjects] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [runningName, setRunningName] = useState("");

  useEffect(() => {
    getProjects().then(setProjects).catch((e) => setLoadError(e.message));
  }, []);

  // Creating a project = running the analysis; go to it when it finishes.
  const task = useSocketTask(ANALYSIS_EVENTS.project, ({ project, analysis }) =>
    navigate(`/app/projects/${project._id}`, { state: { analysis } })
  );

  const start = (data) => {
    setRunningName(data.name);
    task.run(data);
  };

  const limit = user?.limits?.projectLimit;
  const limitReached = limit != null && projects != null && projects.length >= limit;

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-5 lg:gap-12">
      <section className="order-2 lg:order-1 lg:col-span-3">
        <div className="flex items-baseline justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          {projects && limit != null && (
            <span className="font-mono text-xs text-muted">{projects.length} / {limit}</span>
          )}
        </div>

        <div className="mt-5">
          <ErrorText>{loadError}</ErrorText>
          {!projects && !loadError && <PageLoader />}
          {projects?.length === 0 && (
            <p className="rounded-lg border border-dashed border-line p-8 text-sm text-muted">
              No projects yet. Describe your product to run your first scan.
            </p>
          )}
          {projects?.length > 0 && (
            <ul className="divide-y divide-line rounded-lg border border-line bg-surface">
              {projects.map((p) => (
                <li key={p._id}>
                  <Link
                    to={`/app/projects/${p._id}`}
                    className="flex flex-col gap-1 px-4 py-4 transition-colors hover:bg-paper sm:flex-row sm:items-baseline sm:justify-between sm:gap-4 sm:px-5"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold">{p.name}</p>
                      <p className="mt-0.5 truncate text-sm text-muted">{p.about}</p>
                    </div>
                    {p.createdAt && <span className="shrink-0 font-mono text-xs text-muted">{formatDate(p.createdAt)}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="order-1 space-y-4 lg:order-2 lg:col-span-2">
        <h2 className="text-lg font-bold">New analysis</h2>

        {task.loading && (
          <AnalysisProgress
            title={`Analyzing “${runningName}”`}
            steps={task.steps}
            footnote="You'll be taken to the results automatically."
          />
        )}

        {/* Kept mounted (just hidden) so typed text survives a failed run */}
        <div className={task.loading ? "hidden" : "space-y-4"}>
          {limitReached ? (
            <LimitNotice subject="Increase my RivalFree project limit">
              You've used all {limit} projects on your account.
            </LimitNotice>
          ) : (
            <div className="rounded-lg border border-line bg-surface p-4 sm:p-5">
              <AnalysisForm submitLabel="Run analysis" withLink placeholders={PLACEHOLDERS} loading={task.loading} onSubmit={start} />
            </div>
          )}
          <ErrorText>{task.error}</ErrorText>
        </div>
      </section>
    </div>
  );
}
