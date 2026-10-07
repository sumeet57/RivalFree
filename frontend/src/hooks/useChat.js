import { useCallback, useEffect, useRef, useState } from "react";
import { useSocket } from "../context/SocketContext";
import { CHAT_EVENTS } from "../config/events";

/**
 * Streaming chat for a project or a feature.
 * - `type`: "project" | "feature"
 * - `id`: project / feature id
 * - `seed`: saved messages from the server ([{ sender, text }])
 * - `onChange(messages)`: called with each settled conversation (not mid-stream),
 *   so the parent can cache it while the user switches between threads
 */
export function useChat(type, id, seed = [], onChange) {
  const socket = useSocket();
  const events = CHAT_EVENTS[type];
  const [messages, setMessages] = useState(seed);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState(null);

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  useEffect(() => {
    if (!streaming) onChangeRef.current?.(messages);
  }, [messages, streaming]);

  useEffect(() => {
    const updateLast = (fn) =>
      setMessages((list) => list.map((m, i) => (i === list.length - 1 ? fn(m) : m)));

    const onStart = () => {
      setStreaming(true);
      setMessages((list) => [...list, { sender: "ai", text: "" }]);
    };
    const onChunk = ({ chunk }) => updateLast((m) => ({ ...m, text: m.text + chunk }));
    const onComplete = ({ reply }) => {
      setStreaming(false);
      updateLast((m) => ({ ...m, text: reply }));
    };
    const onError = ({ message }) => {
      setStreaming(false);
      setError(message);
      // drop the empty placeholder bubble
      setMessages((list) => (list.at(-1)?.sender === "ai" && !list.at(-1).text ? list.slice(0, -1) : list));
    };

    socket.on(events.start, onStart);
    socket.on(events.chunk, onChunk);
    socket.on(events.complete, onComplete);
    socket.on(events.error, onError);
    return () => {
      socket.off(events.start, onStart);
      socket.off(events.chunk, onChunk);
      socket.off(events.complete, onComplete);
      socket.off(events.error, onError);
    };
  }, [socket, events]);

  const send = useCallback(
    (text) => {
      setError(null);
      socket.emit(events.emit, { [events.idKey]: id, message: text, chatHistory: messages });
      setMessages((list) => [...list, { sender: "user", text }]);
    },
    [socket, events, id, messages]
  );

  return { messages, streaming, error, send };
}
