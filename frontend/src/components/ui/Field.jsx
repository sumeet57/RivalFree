// Label + input (or textarea when `multiline`). Pass any native props through.
// 16px text on mobile stops iOS from zooming into the field.
export default function Field({ label, multiline = false, ...props }) {
  const Tag = multiline ? "textarea" : "input";
  return (
    <label className="block text-sm font-medium">
      {label}
      <Tag
        className="mt-1 w-full rounded-md border border-line bg-surface px-3 py-2 text-base font-normal placeholder:text-muted/60 focus:border-signal focus:outline-none focus:ring-2 focus:ring-signal/20 sm:text-sm"
        rows={multiline ? 4 : undefined}
        {...props}
      />
    </label>
  );
}
