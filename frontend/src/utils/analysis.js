// Analyses are stored in `history` on projects/features (one entry per run).
// Returns the newest entry that holds analysis data, skipping chat messages.
export function latestAnalysis(history) {
  if (!Array.isArray(history)) return null;
  const isChat = (h) => "sender" in h || "text" in h;

  const structured = history.findLast((h) => h && (h.competitors || h.voids || h.roadmap));
  if (structured) return structured;

  return history.findLast((h) => h && typeof h === "object" && !isChat(h)) ?? null;
}
