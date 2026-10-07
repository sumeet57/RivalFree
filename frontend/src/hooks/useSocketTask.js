import { useCallback, useEffect, useRef, useState } from "react";
import { useSocket } from "../context/SocketContext";
import { AGENT_STATUS_EVENT } from "../config/events";

const initialState = { loading: false, steps: [], result: null, error: null };

export function useSocketTask(events, onComplete) {
  const socket = useSocket();
  const [state, setState] = useState(initialState);
  const offRef = useRef(() => {});
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => () => offRef.current(), []);

  const run = useCallback(
    (payload) => {
      offRef.current();

      const emitEvent = typeof events === "string" ? events : events.emit;
      const completeEvent = events?.complete || "analysis_complete";
      const errorEvent = events?.error || "analysis_error";

      const onStatus = (step) => setState((s) => ({ ...s, steps: [...s.steps, step] }));
      const onDone = (result) => {
        off();
        setState((s) => ({ ...s, loading: false, result }));
        onCompleteRef.current?.(result);
      };
      const onError = (err) => {
        off();
        setState((s) => ({ ...s, loading: false, error: err?.message || "Analysis failed" }));
      };
      const off = () => {
        socket.off(AGENT_STATUS_EVENT, onStatus);
        socket.off(completeEvent, onDone);
        socket.off(errorEvent, onError);
      };

      offRef.current = off;
      setState({ ...initialState, loading: true });
      socket.on(AGENT_STATUS_EVENT, onStatus);
      socket.on(completeEvent, onDone);
      socket.on(errorEvent, onError);
      socket.emit(emitEvent, payload);
    },
    [socket, events]
  );

  return { ...state, run };
}