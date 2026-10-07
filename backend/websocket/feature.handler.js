import crypto from "crypto";
import Feature from "../models/feature.model.js";
import Project from "../models/project.model.js";
import { executeSerpApiSearch } from "../services/serpapi.service.js";
import {
  generateQueryPlan,
  runParallelSynthesis,
} from "../services/gemini.service.js";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages";
import { env } from "../config/env.js";

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-3.5-flash-lite",
  apiKey: env.GEMINI_API_KEY,
  temperature: 0.5,
});

const generateCacheHash = (prompt) => {
  return crypto.createHash("sha256").update(prompt.trim().toLowerCase()).digest("hex");
};

export const registerFeatureHandlers = (io, socket) => {
  socket.on("create_feature_analysis", async (payload) => {
    try {
      const { name, about, projectId } = payload;
      const userId = socket.user?._id || socket.user?.id;

      if (!name || !projectId) {
        socket.emit("analysis_error", {
          message: "Feature name and projectId are required",
        });
        return;
      }

      const project = await Project.findById(projectId);
      if (!project) {
        socket.emit("analysis_error", { message: "Associated project not found" });
        return;
      }

      const combinedPrompt = `Project: ${project.name}. Project Summary: ${project.summary || ""}. Feature Name: ${name}. Feature Context: ${about || ""}`.trim();
      const hash = generateCacheHash(combinedPrompt);

      socket.emit("agent_status", {
        step: "CACHE_CHECK",
        message: "Checking cache for existing feature void analysis...",
      });

      let cachedFeature = await Feature.findOne({
        project: projectId,
        user: userId,
        name: name,
      });

      if (cachedFeature && cachedFeature.history && cachedFeature.history.length > 0) {
        const hasMatchingHash = cachedFeature.history.some(
          (item) => item.hash === hash
        );

        if (hasMatchingHash) {
          socket.emit("agent_status", {
            step: "CACHE_HIT",
            message: "Cache hit! Retrieving feature analysis...",
          });

          socket.emit("analysis_complete", {
            feature: cachedFeature,
            isCached: true,
          });
          return;
        }
      }

      socket.emit("agent_status", {
        step: "QUERY_PLANNING",
        message: "Agent 1: Crafting targeted search query for feature market gap...",
      });

      const queryPlan = await generateQueryPlan(combinedPrompt);

      const searchQueryStr = typeof queryPlan === "string"
        ? queryPlan
        : (queryPlan?.query || queryPlan?.searchQuery || combinedPrompt);

      socket.emit("agent_status", {
        step: "LIVE_SEARCH",
        message: `Agent 1: Executing web search via SerpApi for '${searchQueryStr}'...`,
      });

      const serpResults = await executeSerpApiSearch(searchQueryStr);

      socket.emit("agent_status", {
        step: "PARALLEL_SYNTHESIS",
        message: "Agent 2 & 3: Analyzing market voids, user complaints, and tech specs...",
      });

      const synthesisResult = await runParallelSynthesis(serpResults, combinedPrompt);

      socket.emit("agent_status", {
        step: "SAVING_RESULTS",
        message: "Agent 4: Compiling feature roadmap and updating project references...",
      });

      const newFeature = await Feature.create({
        name,
        about,
        summary: synthesisResult?.roadmap?.positioningStrategy || "",
        history: [
          {
            hash,
            queryPlan,
            competitors: synthesisResult.competitors,
            voids: synthesisResult.voids,
            roadmap: synthesisResult.roadmap,
            createdAt: new Date(),
          },
        ],
        project: projectId,
        user: userId,
      });

      await Project.findByIdAndUpdate(projectId, {
        $push: { features: newFeature._id },
      });

      socket.emit("analysis_complete", {
        feature: newFeature,
        analysis: synthesisResult,
        isCached: false,
      });
    } catch (error) {
      console.error("Feature Analysis Error:", error);
      socket.emit("analysis_error", {
        message: error.message || "Failed to complete feature analysis",
      });
    }
  });

  socket.on("chat_feature_discussion", async (payload) => {
  try {
    const { featureId, message } = payload;

    if (!featureId || !message) {
      socket.emit("feature_chat_error", {
        message: "Feature ID and message are required",
      });
      return;
    }

    const feature = await Feature.findById(featureId).populate("project");
    if (!feature) {
      socket.emit("feature_chat_error", { message: "Feature not found" });
      return;
    }

    const featureContext = `
Project Context:
- Name: ${feature.project?.name || "N/A"}
- Summary/Strategy: ${feature.project?.summary || "N/A"}

Feature Details:
- Name: ${feature.name}
- About: ${feature.about || "N/A"}
- Feature Void Summary: ${feature.summary || "N/A"}
- Analysis History: ${JSON.stringify(feature.history || [])}
`;

    const formattedMessages = [
      new SystemMessage(
        `You are RivalFree Assistant, an expert AI advisor helping the user refine, understand, and build out this specific feature within their project scope.
Answer questions directly and offer technical, architectural, or strategy advice based on the context provided below.
DO NOT attempt to overwrite or alter the feature summary or historical analysis data.

Feature Context:
${featureContext}`
      ),
    ];

    if (feature.chatHistory && feature.chatHistory.length > 0) {
      feature.chatHistory.forEach((chat) => {
        if (chat.role === "user") {
          formattedMessages.push(new HumanMessage(chat.message));
        } else if (chat.role === "assistant") {
          formattedMessages.push(new AIMessage(chat.message));
        }
      });
    }

    formattedMessages.push(new HumanMessage(message));

    socket.emit("feature_chat_response_start");

    const responseStream = await llm.stream(formattedMessages);
    let fullResponse = "";

    for await (const chunk of responseStream) {
      const textChunk = chunk.content;
      fullResponse += textChunk;

      socket.emit("feature_chat_response_chunk", { chunk: textChunk });
    }

    await Feature.findByIdAndUpdate(featureId, {
      $push: {
        chatHistory: {
          $each: [
            { role: "user", message },
            { role: "assistant", message: fullResponse },
          ],
        },
      },
    });

    socket.emit("feature_chat_response_complete", {
      reply: fullResponse,
    });
  } catch (error) {
    console.error("Feature Chat Error:", error);
    socket.emit("feature_chat_error", {
      message: error.message || "Failed to process message",
    });
  }
});
};