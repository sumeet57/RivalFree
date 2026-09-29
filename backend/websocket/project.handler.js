import crypto from "crypto";
import Project from "../models/project.model.js";
import { executeSerpApiSearch } from "../services/serpapi.service.js";
import {
  generateQueryPlan,
  runParallelSynthesis,
} from "../services/gemini.service.js";

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
      console.error("Radar Analysis Error:", error);
      socket.emit("analysis_error", {
        message: error.message || "Failed to complete radar analysis",
      });
    }
  });
};