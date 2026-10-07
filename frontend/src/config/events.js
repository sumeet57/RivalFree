// Single source of truth for every Socket.IO event name (see API docs).

export const ANALYSIS_EVENTS = {
  project: {
    emit: "create_project_analysis",
    complete: "analysis_complete",
    error: "analysis_error",
  },
  feature: {
    emit: "create_feature_analysis",
    complete: "feature_analysis_complete",
    error: "feature_analysis_error",
  },
};

export const CHAT_EVENTS = {
  project: {
    idKey: "projectId",
    emit: "chat_project_discussion",
    start: "chat_response_start",
    chunk: "chat_response_chunk",
    complete: "chat_response_complete",
    error: "chat_error",
  },
  feature: {
    idKey: "featureId",
    emit: "chat_feature_discussion",
    start: "feature_chat_response_start",
    chunk: "feature_chat_response_chunk",
    complete: "feature_chat_response_complete",
    error: "feature_chat_error",
  },
};

export const AGENT_STATUS_EVENT = "agent_status";
