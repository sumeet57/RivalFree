import { useEffect, useRef, useState } from "react";
import { useChat } from "../../hooks/useChat";
import Button from "../ui/Button";
import ErrorText from "../ui/ErrorText";
import Markdown from "../ui/Markdown";

const SUGGESTIONS = [
  "What is my biggest market threat?",
  "How should I position against direct competitors?",
  "What should I build first?",
];

export default function ChatPanel({ type, id, title, seed, onChange }) {
  const { messages, streaming, error, send } = useChat(type, id, seed, onChange);
  const [text, setText] = useState("");
  const listRef = useRef(null);

  // Keep the newest message in view (also jumps to the end of saved history)
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const submit = (value) => {
    if (!value.trim() || streaming) return;
    send(value.trim());
    setText("");
  };

  return (
    <div className="flex h-[32rem] max-h-[75dvh] flex-col rounded-lg bg-console text-slate-200">
      <h3 className="truncate border-b border-console-line px-4 py-3 font-mono text-sm text-teal-300">{title}</h3>

      <div ref={listRef} className="flex-1 space-y-4 overflow-y-auto p-3 sm:p-4">
        {messages.length === 0 && (
          <div className="space-y-3">
            <p className="text-sm text-slate-400">Ask about positioning, threats, or what to build next.</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => submit(s)}
                  className="rounded-full border border-console-line px-3 py-1.5 text-left text-xs text-slate-300 transition-colors hover:border-teal-400 hover:text-white"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) =>
          m.sender === "user" ? (
            <div key={i} className="text-right">
              <p className="inline-block max-w-[88%] whitespace-pre-wrap break-words rounded-lg bg-signal px-3 py-2 text-left text-sm text-white">
                {m.text}
              </p>
            </div>
          ) : (
            <div key={i} className="max-w-[94%] break-words rounded-lg bg-console-line px-3 py-2 text-sm text-slate-200">
              {m.text ? <Markdown>{m.text}</Markdown> : <span className="animate-pulse text-teal-300">▍</span>}
            </div>
          )
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(text);
        }}
        className="flex gap-2 border-t border-console-line p-3"
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your question"
          aria-label="Message"
          className="min-w-0 flex-1 rounded-md border border-console-line bg-transparent px-3 py-2 text-base text-white placeholder:text-slate-500 focus:border-teal-400 focus:outline-none sm:text-sm"
        />
        <Button type="submit" loading={streaming}>Send</Button>
      </form>
      {error && <div className="px-4 pb-3"><ErrorText>{error}</ErrorText></div>}
    </div>
  );
}
