import { normalizeHistory } from "../../utils/chat";
import ChatPanel from "./ChatPanel";

/**
 * One conversation per project and per feature.
 * Saved messages come from `chatHistory` on each record. `store` holds this
 * session's newer messages so switching threads never shows stale history.
 */
export default function DiscussionTab({ project, features, thread, onThreadChange, store }) {
  const threads = [
    { key: "project", type: "project", id: project._id, name: "Whole project", chatHistory: project.chatHistory },
    ...features.map((f) => ({ key: f._id, type: "feature", id: f._id, name: f.name, chatHistory: f.chatHistory })),
  ];
  const active = threads.find((t) => t.key === thread) ?? threads[0];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
      <ul className="flex gap-1 overflow-x-auto md:flex-col md:overflow-visible">
        {threads.map((t) => (
          <li key={t.key} className="shrink-0 md:shrink">
            <button
              onClick={() => onThreadChange(t.key)}
              className={`w-full whitespace-nowrap rounded-md px-3 py-2 text-left text-sm font-semibold transition-colors md:whitespace-normal ${
                t.key === active.key ? "bg-surface text-ink ring-1 ring-line" : "text-muted hover:text-ink"
              }`}
            >
              {t.name}
            </button>
          </li>
        ))}
      </ul>

      <div className="min-w-0 md:col-span-3">
        <ChatPanel
          key={active.key}
          type={active.type}
          id={active.id}
          title={active.type === "project" ? "Discuss your strategy" : `Discuss: ${active.name}`}
          seed={store.current[active.key] ?? normalizeHistory(active.chatHistory)}
          onChange={(messages) => {
            store.current[active.key] = messages;
          }}
        />
      </div>
    </div>
  );
}
