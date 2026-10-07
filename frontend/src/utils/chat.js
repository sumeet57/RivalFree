export function normalizeHistory(history) {
  if (!Array.isArray(history)) return [];

  return history.flatMap((item) => {
    const text = item?.text ?? item?.message ?? item?.content ?? item?.reply;
    if (typeof text !== "string" || !text.trim()) return []; // skips non-chat entries

    const who = String(item.sender ?? item.role ?? "").toLowerCase();
    return [{ sender: who === "user" || who === "human" ? "user" : "ai", text }];
  });
}
