import crypto from "crypto";
import Project from "../models/project.model.js";
import { executeSerpApiSearch } from "../services/serpapi.service.js";
import {
  generateQueryPlan,
  runParallelSynthesis,
} from "../services/gemini.service.js";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {
  HumanMessage,
  AIMessage,
  SystemMessage,
} from "@langchain/core/messages";
import { env } from "../config/env.js";
import User from "../models/user.model.js";

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-3.5-flash-lite",
  apiKey: env.GEMINI_API_KEY,
  temperature: 0.5,
});

const generateCacheHash = (prompt) => {
  return crypto
    .createHash("sha256")
    .update(prompt.trim().toLowerCase())
    .digest("hex");
};

export const registerProjectHandlers = (io, socket) => {
  socket.on("create_project_analysis", async (payload) => {
    try {
      const { name, about, link } = payload;
      const userId = socket.user?._id || socket.user?.id;

      const user = await User.findById(userId);
      if (!user) {
        socket.emit("analysis_error", { message: "Unauthorized user" });
        return;
      }
      if (user.projects.length >= user.limits.projectLimit) {
        socket.emit("analysis_error", {
          message:
            "Project limit reached. Upgrade your plan to create more projects.",
        });
        return;
      }

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
        "history.hash": hash,
      });

      if (cachedProject) {
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

      socket.emit("agent_status", {
        step: "QUERY_PLANNING",
        message: "Agent 1: Optimizing search parameters and site operators...",
      });

      const queryPlan = await generateQueryPlan(inputPrompt);

      const searchQueryStr =
        typeof queryPlan === "string"
          ? queryPlan
          : queryPlan?.query || queryPlan?.searchQuery || inputPrompt;

      socket.emit("agent_status", {
        step: "LIVE_SEARCH",
        message: `Agent 1: Executing live radar scan via SerpApi for '${searchQueryStr}'...`,
      });

      const serpResults = await executeSerpApiSearch(searchQueryStr);

      socket.emit("agent_status", {
        step: "PARALLEL_SYNTHESIS",
        message:
          "Agent 2 & 3: Mapping competitor threats and isolating feature voids in parallel...",
      });

      const synthesisResult = await runParallelSynthesis(
        serpResults,
        inputPrompt,
      );

      socket.emit("agent_status", {
        step: "SAVING_RESULTS",
        message:
          "Agent 4: Compiling executive roadmap and persisting project data...",
      });

      const newProject = await Project.create({
        name,
        about,
        link,
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
        user: userId,
      });
      user.projects.push(newProject._id);
      await user.save();

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
      const { projectId, message } = payload;

      if (!projectId || !message) {
        socket.emit("chat_error", {
          message: "Project ID and message are required",
        });
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
          `You are RivalFree Assistant, an elite AI business strategist and technical co-pilot. Your job is to help the user analyze, refine, and plan their product strategy based strictly on the generated market intelligence provided in the Context.

### STRICT OPERATIONAL BOUNDARIES & ANTI-HALLUCINATION RULES:
1. GROUND TRUTH PRIMACY: Base all factual assertions, competitor details, feature gaps, and strategic advice ONLY on the provided Project Context.
2. TRANSPARENT UNCERTAINTY: If the user asks about a competitor, market metric, or technical detail NOT present in the Context or verifiable SERP history, state clearly: "That specific detail isn't in your generated radar data." Then, provide reasonable strategic reasoning marked explicitly as a general hypothesis.
3. NO FABRICATED DATA: Never invent fake competitors, non-existent pricing models, fake user reviews, or unverified market statistics.
4. READ-ONLY INTEGRITY: You are a advisory partner. You CANNOT mutate, rewrite, or overwrite project summaries or stored database records.
5. CONCISE & ACTIONABLE: Deliver direct, high-density strategic insights without conversational fluff or meta-announcements.

### OUTPUT FORMATTING & STYLE:
- Use inline bolding for key concepts, metrics, and actionable steps.
- Present strategic comparisons or step-by-step implementations using concise bullet points or numbered lists.
- Keep the tone professional, sharp, and founder-focused.

### PROJECT CONTEXT:
${projectContext}`,
        ),
      ];

      if (project.chatHistory && project.chatHistory.length > 0) {
        project.chatHistory.forEach((chat) => {
          if (chat.role === "user") {
            formattedMessages.push(new HumanMessage(chat.message));
          } else if (chat.role === "assistant") {
            formattedMessages.push(new AIMessage(chat.message));
          }
        });
      }

      formattedMessages.push(new HumanMessage(message));

      socket.emit("chat_response_start");

      const responseStream = await llm.stream(formattedMessages);
      let fullResponse = "";

      for await (const chunk of responseStream) {
        const textChunk = chunk.content;
        fullResponse += textChunk;

        socket.emit("chat_response_chunk", { chunk: textChunk });
      }

      await Project.findByIdAndUpdate(projectId, {
        $push: {
          chatHistory: {
            $each: [
              { role: "user", message },
              { role: "assistant", message: fullResponse },
            ],
          },
        },
      });

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
