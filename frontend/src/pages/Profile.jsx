import { useAuth } from "../context/AuthContext";
import { useUsage } from "../hooks/useUsage";
import { formatDate } from "../utils/format";
import LimitMeter from "../components/profile/LimitMeter";
import LimitNotice from "../components/ui/LimitNotice";

export default function Profile() {
  const { user } = useAuth();
  const usage = useUsage();
  const limits = user?.limits;

  return (
    <div className="max-w-2xl space-y-10">
      <header className="flex items-center gap-5">
        {user.avatar ? (
          <img src={user.avatar} alt="" className="size-16 rounded-full" referrerPolicy="no-referrer" />
        ) : (
          <span className="grid size-16 place-items-center rounded-full bg-signal text-2xl font-bold text-white">{user.name?.[0]}</span>
        )}
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-bold tracking-tight">{user.name}</h1>
          <p className="truncate text-muted">{user.email}</p>
          {user.createdAt && <p className="mt-1 font-mono text-xs text-muted">Member since {formatDate(user.createdAt)}</p>}
        </div>
      </header>

      {limits && (
        <section className="space-y-3">
          <h2 className="text-lg font-bold">Plan limits</h2>
          <div className="divide-y divide-line rounded-lg border border-line bg-surface">
            <LimitMeter label="Projects" used={usage.projects} limit={limits.projectLimit} hint="Each market analysis creates one project." />
            <LimitMeter label="Features" used={usage.features} limit={limits.featureLimit} hint="Feature ideas analyzed across all projects." />
            <LimitMeter label="AI requests" limit={limits.aiLimit} hint="Included with your account." />
          </div>
        </section>
      )}

      <LimitNotice />
    </div>
  );
}
