export default function Skeleton({ className = "" }) {
  return <div className={`animate-pulse rounded-md bg-line/60 motion-reduce:animate-none ${className}`} />;
}
