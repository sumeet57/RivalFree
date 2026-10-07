// Browser-side copy of each conversation so it survives a refresh.
const key = (type, id) => `rf-chat:${type}:${id}`;

export function loadChat(type, id) {
  try {
    const saved = JSON.parse(localStorage.getItem(key(type, id)));
    return Array.isArray(saved) ? saved : null;
  } catch {
    return null;
  }
}

export function saveChat(type, id, messages) {
  try {
    localStorage.setItem(key(type, id), JSON.stringify(messages.filter((m) => m.text)));
  } catch {
    /* storage full or unavailable: ignore */
  }
}

export function clearChats() {
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith("rf-chat:"))
      .forEach((k) => localStorage.removeItem(k));
  } catch {
    /* ignore */
  }
}
