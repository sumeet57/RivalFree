import crypto from "crypto";
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
  model: "gemini-2.5-flash-lite",
  apiKey: env.GEMINI_API_KEY,
  temperature: 0.5,
});

const generateCacheHash = (prompt) => {
  return crypto.createHash("sha256").update(prompt.trim().toLowerCase()).digest("hex");
};

export const registerProjectHandlers = (io, socket) => {
  socket.on("create_project_analysis", async (payload) => {
    try {
      const { name, about, link } = payload;
      const userId = socket.user?._id || socket.user?.id;

      if (!name) {
        socket.emit("analysis_error", { message: "Project name is required" });
        return;
      }

      const inputPrompt = `${name} ${about || ""} ${link || ""}`.trim();
      const hash = generateCacheHash(inputPrompt);

      socket.emit("agent_status", {
        step: "CACHE_CHECK",
        message: "Checking database cache for prior market analysis...",
      });

      let cachedProject = await Project.findOne({
        user: userId,
        summary: { $exists: true,$ne: "" },
      });

      if (cachedProject && cachedProject.history && cachedProject.history.length > 0) {
        const hasMatchingHash = cachedProject.history.some(
          (item) => item.hash === hash
        );

        if (hasMatchingHash) {
          socket.emit("agent_status", {
            step: "CACHE_HIT",
            message: "Cache hit! Retrieving saved market matrix...",
          });

          socket.emit("analysis_complete", {
            project: cachedProject,
            isCached: true,
          });
          return;
        }
      }

      socket.emit("agent_status", {
        step: "QUERY_PLANNING",
        message: "Agent 1: Optimizing search parameters and site operators...",
      });

      const queryPlan = await generateQueryPlan(inputPrompt);

      socket.emit("agent_status", {
        step: "LIVE_SEARCH",
        message: `Agent 1: Executing live radar scan via SerpApi for '${queryPlan.searchQuery}'...`,
      });

      const serpResults = await executeSerpApiSearch(queryPlan.searchQuery);

      socket.emit("agent_status", {
        step: "PARALLEL_SYNTHESIS",
        message: "Agent 2 & 3: Mapping competitor threats and isolating feature voids in parallel...",
      });

      const synthesisResult = await runParallelSynthesis(serpResults, inputPrompt);

      socket.emit("agent_status", {
        step: "SAVING_RESULTS",
        message: "Agent 4: Compiling executive roadmap and persisting project data...",
      });

      const newProject = await Project.create({
        name,
        about,
        link,
        summary: synthesisResult.roadmap.positioningStrategy,
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
        user: userId,
      });

      socket.emit("analysis_complete", {
        project: newProject,
        analysis: synthesisResult,
        isCached: false,
      });
    } catch (error) {
      console.error("Project Analysis Error:", error);
      socket.emit("analysis_error", {
        message: error.message || "Failed to complete project analysis",
      });
    }
  });

  socket.on("chat_project_discussion", async (payload) => {
    try {
      const { projectId, message, chatHistory = [] } = payload;

      if (!projectId || !message) {
        socket.emit("chat_error", { message: "Project ID and message are required" });
        return;
      }

      const project = await Project.findById(projectId);
      if (!project) {
        socket.emit("chat_error", { message: "Project not found" });
        return;
      }

      const projectContext = `
Project Name: ${project.name}
About: ${project.about || "N/A"}
Positioning Strategy/Summary: ${project.summary || "N/A"}
Analysis History: ${JSON.stringify(project.history || [])}
`;

      const formattedMessages = [
        new SystemMessage(
          `You are RivalFree Assistant, an expert AI advisor helping the user refine, understand, and discuss their project strategy based on their generated competitive analysis.
Answer questions directly and offer actionable advice based on the project context provided below.
DO NOT attempt to overwrite or alter the project summary or historical analysis data.

Project Context:
${projectContext}`
        ),
      ];

      chatHistory.forEach((msg) => {
        if (msg.sender === "user") {
          formattedMessages.push(new HumanMessage(msg.text));
        } else if (msg.sender === "ai") {
          formattedMessages.push(new AIMessage(msg.text));
        }
      });

      formattedMessages.push(new HumanMessage(message));

      socket.emit("chat_response_start");

      const responseStream = await llm.stream(formattedMessages);
      let fullResponse = "";

      for await (const chunk of responseStream) {
        const textChunk = chunk.content;
        fullResponse += textChunk;

        socket.emit("chat_response_chunk", { chunk: textChunk });
      }

      socket.emit("chat_response_complete", {
        reply: fullResponse,
      });
    } catch (error) {
      console.error("Chat Discussion Error:", error);
      socket.emit("chat_error", {
        message: error.message || "Failed to process message",
      });
    }
  });
};