import { useAuth } from "../context/AuthContext";
import { DEFAULT_LIMITS } from "../config/site";
import GoogleSignInButton from "../components/auth/GoogleSignInButton";
import OpportunityChart from "../components/charts/OpportunityChart";
import Footer from "../components/layout/Footer";
import Logo from "../components/layout/Logo";
import Button from "../components/ui/Button";

const steps = [
  { title: "Plan", text: "An agent turns your idea into one precise search query." },
  { title: "Scan", text: "The query runs live on the web, so results reflect today's market." },
  { title: "Map", text: "Agents map competitors and threats while isolating the gaps, in parallel." },
  { title: "Spec", text: "You get a roadmap and a draft spec, and can discuss it with the analyst." },
];

const jobs = [
  { title: "Validate a startup idea", text: "See how crowded your space is, who the direct and indirect rivals are, and how to position against them." },
  { title: "Find feature voids", text: "Check a feature idea against real user complaints on existing tools, then get variations no one offers." },
  { title: "Track trends and pricing", text: "Follow pricing shifts, launches and ecosystem changes as they happen on the live web." },
];

const sample = [
  { name: "Real-time availability", score: 8 },
  { name: "Transparent pricing", score: 7 },
  { name: "Self-service inventory", score: 6 },
];

// Signed-in visitors get a link to the dashboard instead of the sign-in button.
function PrimaryAction({ user, variant, className }) {
  return user
    ? <Button to="/app" variant={variant} className={className}>Open dashboard</Button>
    : <GoogleSignInButton variant={variant} className={className} />;
}

export default function Landing() {
  const { user } = useAuth();
  const { projectLimit, featureLimit, aiLimit } = DEFAULT_LIMITS;

  return (
    <div className="min-h-dvh">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 py-3">
          <Logo />
          <PrimaryAction user={user} variant="secondary" />
        </div>
      </header>

      <section className="mx-auto grid grid-cols-1 max-w-6xl items-center gap-12 px-4 sm:px-6 py-12 lg:grid-cols-2 lg:py-24">
        <div>
          <h1 className="text-3xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl">
            Find the product space your rivals haven't reached.
          </h1>
          <p className="mt-5 max-w-lg text-lg text-muted">
            Describe your product or a feature idea. RivalFree scans the live web, maps who you're up against,
            and shows the gaps nobody has filled.
          </p>
          <div className="mt-8">
            <PrimaryAction user={user} className="px-6 py-3" />
          </div>
          <p className="mt-4 text-sm text-muted">
            Every account starts with {projectLimit} projects, {featureLimit} features and {aiLimit} AI requests.
          </p>
        </div>

        <figure className="rounded-lg border border-line bg-surface p-5">
          <figcaption className="mb-2 font-mono text-xs text-muted">Sample output: opportunity by missing feature</figcaption>
          <OpportunityChart items={sample} />
        </figure>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <h2 className="text-2xl font-bold tracking-tight">How a scan works</h2>
        <ol className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-4">
          {steps.map((s) => (
            <li key={s.title} className="border-t border-line pt-4">
              <h3 className="font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm text-muted">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto grid grid-cols-1 max-w-6xl gap-8 px-4 sm:px-6 py-12 md:grid-cols-5">
        <h2 className="text-2xl font-bold tracking-tight md:col-span-2">What teams use it for</h2>
        <dl className="divide-y divide-line md:col-span-3">
          {jobs.map((j) => (
            <div key={j.title} className="py-5 first:pt-0">
              <dt className="font-bold">{j.title}</dt>
              <dd className="mt-1 text-muted">{j.text}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
        <h2 className="text-2xl font-bold tracking-tight">Run your first scan in a minute.</h2>
        <p className="mt-2 text-muted">Sign in with Google, describe your product, and watch the agents work.</p>
        <div className="mt-6">
          <PrimaryAction user={user} className="px-6 py-3" />
        </div>
      </section>

      <Footer />
    </div>
  );
}
