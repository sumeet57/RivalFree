import { Link } from "react-router-dom";

export default function Logo({ to = "/", light = false }) {
  return (
    <Link to={to} className={`flex items-center gap-2 text-lg font-extrabold tracking-tight ${light ? "text-white" : "text-ink"}`}>
      <svg viewBox="0 0 24 24" className="size-6" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
        <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
        <path d="M12 12 L19 6" stroke="#0d7a86" strokeWidth="2" strokeLinecap="round" />
        <circle cx="12" cy="12" r="1.8" fill="#0d7a86" />
      </svg>
      <span>
        Rival<span className="text-signal">Free</span>
      </span>
    </Link>
  );
}
