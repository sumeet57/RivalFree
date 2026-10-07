import { Link } from "react-router-dom";

const variants = {
  primary: "bg-signal text-white hover:bg-signal-dark",
  secondary: "bg-surface text-ink border border-line hover:border-signal",
  ghost: "text-muted hover:text-ink",
};

// Renders <Link> with `to`, <a> with `href`, otherwise <button>.
export default function Button({ variant = "primary", loading = false, className = "", to, href, children, ...props }) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 sm:py-2 ${variants[variant]} ${className}`;

  if (to) return <Link to={to} className={classes} {...props}>{children}</Link>;
  if (href) return <a href={href} className={classes} {...props}>{children}</a>;

  return (
    <button disabled={loading || props.disabled} className={classes} {...props}>
      {loading ? "Working…" : children}
    </button>
  );
}
