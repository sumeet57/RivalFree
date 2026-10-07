import Skeleton from "./Skeleton";

// Placeholder shaped like a page: a heading and a few rows.
export default function PageLoader() {
  return (
    <div className="space-y-3 p-2" role="status" aria-label="Loading">
      <Skeleton className="h-7 w-1/3" />
      <Skeleton className="h-16" />
      <Skeleton className="h-16" />
      <Skeleton className="h-16" />
    </div>
  );
}
